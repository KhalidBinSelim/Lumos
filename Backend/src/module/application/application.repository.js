const Application = require('./application.model');

class ApplicationRepository {
  /**
   * Create a new application
   */
  async create(applicationData) {
    const application = new Application(applicationData);
    return await application.save();
  }

  /**
   * Find application by ID
   */
  async findById(id, populate = true) {
    const query = Application.findById(id);
    if (populate) {
      query.populate('scholarship');
    }
    return await query.exec();
  }

  /**
   * Find application by user and scholarship
   */
  async findByUserAndScholarship(userId, scholarshipId) {
    return await Application.findOne({
      user: userId,
      scholarship: scholarshipId,
    }).populate('scholarship');
  }

  /**
   * Check if application exists
   */
  async exists(userId, scholarshipId) {
    const app = await Application.findOne({
      user: userId,
      scholarship: scholarshipId,
    }).select('_id');
    return !!app;
  }

  /**
   * Find all applications for a user
   */
  async findByUser(userId, filters = {}, options = {}) {
    const {
      page = 1,
      limit = 20,
      sortBy = 'lastActivityAt',
      sortOrder = 'desc',
    } = options;

    const query = { user: userId };

    // Status filter
    if (filters.status && filters.status !== 'All') {
      query.status = filters.status;
    }

    // Search filter
    if (filters.search) {
      // We'll need to filter after populating scholarship
    }

    const skip = (page - 1) * limit;
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    let applications = await Application.find(query)
      .populate('scholarship')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Apply search filter on populated data
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      applications = applications.filter(app => 
        app.scholarship?.title?.toLowerCase().includes(searchLower) ||
        app.scholarship?.org?.toLowerCase().includes(searchLower)
      );
    }

    const total = await Application.countDocuments(query);

    return {
      applications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get application statistics for a user
   */
  async getStatsByUser(userId) {
    const stats = await Application.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    // Get won amount
    const wonApps = await Application.find({
      user: userId,
      status: 'Won',
    }).populate('scholarship', 'amount');

    const wonAmount = wonApps.reduce((sum, app) => {
      return sum + (app.scholarship?.amount || 0);
    }, 0);

    const result = {
      total: 0,
      inProgress: 0,
      submitted: 0,
      won: 0,
      rejected: 0,
      withdrawn: 0,
      wonAmount,
    };

    stats.forEach(stat => {
      result.total += stat.count;
      switch (stat._id) {
        case 'In Progress':
          result.inProgress = stat.count;
          break;
        case 'Submitted':
          result.submitted = stat.count;
          break;
        case 'Won':
          result.won = stat.count;
          break;
        case 'Rejected':
          result.rejected = stat.count;
          break;
        case 'Withdrawn':
          result.withdrawn = stat.count;
          break;
      }
    });

    return result;
  }

  /**
   * Get urgent applications (deadline within 7 days)
   */
  async getUrgentApplications(userId) {
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    const applications = await Application.find({
      user: userId,
      status: 'In Progress',
    }).populate({
      path: 'scholarship',
      match: {
        deadline: { $lte: sevenDaysFromNow, $gte: new Date() },
      },
    }).lean();

    // Filter out applications where scholarship didn't match
    return applications.filter(app => app.scholarship !== null);
  }

  /**
   * Update application by ID
   */
  async updateById(id, updateData) {
    return await Application.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('scholarship');
  }

  /**
   * Update requirement status
   */
  async updateRequirement(applicationId, requirementId, status, details = null) {
    const updateObj = {
      'requirements.$.status': status,
    };
    if (details) {
      updateObj['requirements.$.details'] = details;
    }
    if (status === 'completed') {
      updateObj['requirements.$.completedAt'] = new Date();
    }

    const application = await Application.findOneAndUpdate(
      { _id: applicationId, 'requirements._id': requirementId },
      { $set: updateObj },
      { new: true }
    ).populate('scholarship');

    if (application) {
      application.calculateProgress();
      await application.save();
    }

    return application;
  }

  /**
   * Add requirement
   */
  async addRequirement(applicationId, requirement) {
    return await Application.findByIdAndUpdate(
      applicationId,
      { $push: { requirements: requirement } },
      { new: true }
    ).populate('scholarship');
  }

  /**
   * Remove requirement
   */
  async removeRequirement(applicationId, requirementId) {
    return await Application.findByIdAndUpdate(
      applicationId,
      { $pull: { requirements: { _id: requirementId } } },
      { new: true }
    ).populate('scholarship');
  }

  /**
   * Save essay draft
   */
  async saveEssayDraft(applicationId, content, wordCount) {
    const application = await Application.findById(applicationId);
    if (!application) return null;

    const newDraft = {
      content,
      wordCount,
      version: (application.essay?.drafts?.length || 0) + 1,
      lastUpdated: new Date(),
    };

    application.essay = application.essay || {};
    application.essay.drafts = application.essay.drafts || [];
    application.essay.drafts.push(newDraft);
    application.essay.currentDraft = application.essay.drafts.length - 1;

    application.addTimelineEvent('Essay Updated', `Draft ${newDraft.version} saved`);

    return await application.save();
  }

  /**
   * Add document to application
   */
  async addDocument(applicationId, document) {
    const application = await Application.findByIdAndUpdate(
      applicationId,
      { $push: { documents: document } },
      { new: true }
    ).populate('scholarship');

    return application;
  }

  /**
   * Remove document from application
   */
  async removeDocument(applicationId, documentId) {
    return await Application.findByIdAndUpdate(
      applicationId,
      { $pull: { documents: { _id: documentId } } },
      { new: true }
    ).populate('scholarship');
  }

  /**
   * Submit application
   */
  async submit(applicationId, confirmationNumber) {
    const application = await Application.findById(applicationId);
    if (!application) return null;

    application.submit(confirmationNumber);
    return await application.save();
  }

  /**
   * Mark as won
   */
  async markAsWon(applicationId, awardDetails) {
    const application = await Application.findById(applicationId);
    if (!application) return null;

    application.markAsWon(awardDetails);
    return await application.save();
  }

  /**
   * Mark as rejected
   */
  async markAsRejected(applicationId, feedback) {
    const application = await Application.findById(applicationId);
    if (!application) return null;

    application.markAsRejected(feedback);
    return await application.save();
  }

  /**
   * Withdraw application
   */
  async withdraw(applicationId) {
    const application = await Application.findById(applicationId);
    if (!application) return null;

    application.withdraw();
    return await application.save();
  }

  /**
   * Delete application
   */
  async deleteById(id) {
    return await Application.findByIdAndDelete(id);
  }

  /**
   * Get applications with upcoming deadlines for calendar
   */
  async getForCalendar(userId, startDate, endDate) {
    const applications = await Application.find({
      user: userId,
      status: { $in: ['In Progress', 'Submitted'] },
    }).populate({
      path: 'scholarship',
      match: {
        deadline: { $gte: startDate, $lte: endDate },
      },
      select: 'title deadline amount',
    }).lean();

    return applications.filter(app => app.scholarship !== null);
  }

  /**
   * Update reminders
   */
  async updateReminders(applicationId, reminders) {
    return await Application.findByIdAndUpdate(
      applicationId,
      { $set: { reminders } },
      { new: true }
    ).populate('scholarship');
  }

  /**
   * Add next step
   */
  async addNextStep(applicationId, step) {
    return await Application.findByIdAndUpdate(
      applicationId,
      { $push: { nextSteps: step } },
      { new: true }
    ).populate('scholarship');
  }

  /**
   * Complete next step
   */
  async completeNextStep(applicationId, stepIndex) {
    const application = await Application.findById(applicationId);
    if (!application || !application.nextSteps[stepIndex]) return null;

    application.nextSteps[stepIndex].completed = true;
    return await application.save();
  }
}

module.exports = new ApplicationRepository();

