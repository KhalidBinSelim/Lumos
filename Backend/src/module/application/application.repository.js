const Application = require('./application.model');

class ApplicationRepository {
  /**
   * Create a new application
   * @param {Object} applicationData - { userId, scholarshipId, essayId?, state? }
   * @returns {Promise<Application>}
   */
  async create(applicationData) {
    const application = new Application(applicationData);
    return await application.save();
  }

  /**
   * Find application by ID
   * @param {string} id - Application ID
   * @param {boolean} populate - Whether to populate references
   * @returns {Promise<Application|null>}
   */
  async findById(id, populate = false) {
    const query = Application.findById(id);
    if (populate) {
      query.populate('userId', 'name email')
           .populate('scholarshipId')
           .populate('essayId');
    }
    return await query.exec();
  }

  /**
   * Find all applications by user ID
   * @param {string} userId - User ID
   * @param {Object} options - { state?, populate?, page?, limit? }
   * @returns {Promise<{ applications: Application[], total: number }>}
   */
  async findByUserId(userId, options = {}) {
    const { state, populate = false, page = 1, limit = 20 } = options;
    
    const query = { userId };
    if (state) {
      query.state = state;
    }

    const skip = (page - 1) * limit;

    let applicationsQuery = Application.find(query)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    if (populate) {
      applicationsQuery = applicationsQuery
        .populate('scholarshipId')
        .populate('essayId');
    }

    const [applications, total] = await Promise.all([
      applicationsQuery.exec(),
      Application.countDocuments(query),
    ]);

    return { applications, total };
  }

  /**
   * Find all applications by scholarship ID
   * @param {string} scholarshipId - Scholarship ID
   * @param {Object} options - { state?, populate?, page?, limit? }
   * @returns {Promise<{ applications: Application[], total: number }>}
   */
  async findByScholarshipId(scholarshipId, options = {}) {
    const { state, populate = false, page = 1, limit = 20 } = options;
    
    const query = { scholarshipId };
    if (state) {
      query.state = state;
    }

    const skip = (page - 1) * limit;

    let applicationsQuery = Application.find(query)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    if (populate) {
      applicationsQuery = applicationsQuery
        .populate('userId', 'name email')
        .populate('essayId');
    }

    const [applications, total] = await Promise.all([
      applicationsQuery.exec(),
      Application.countDocuments(query),
    ]);

    return { applications, total };
  }

  /**
   * Find application by user ID and scholarship ID
   * @param {string} userId - User ID
   * @param {string} scholarshipId - Scholarship ID
   * @returns {Promise<Application|null>}
   */
  async findByUserAndScholarship(userId, scholarshipId) {
    return await Application.findOne({ userId, scholarshipId })
      .populate('scholarshipId')
      .populate('essayId');
  }

  /**
   * Check if application exists for user and scholarship
   * @param {string} userId - User ID
   * @param {string} scholarshipId - Scholarship ID
   * @returns {Promise<boolean>}
   */
  async exists(userId, scholarshipId) {
    const app = await Application.findOne({ userId, scholarshipId }).select('_id');
    return !!app;
  }

  /**
   * Update application by ID
   * @param {string} id - Application ID
   * @param {Object} updateData - Fields to update
   * @returns {Promise<Application|null>}
   */
  async updateById(id, updateData) {
    return await Application.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('scholarshipId').populate('essayId');
  }

  /**
   * Update application state
   * @param {string} id - Application ID
   * @param {string} state - New state ('working' or 'submitted')
   * @returns {Promise<Application|null>}
   */
  async updateState(id, state) {
    const updateData = { state };
    if (state === 'submitted') {
      updateData.submittedAt = new Date();
    }
    return await this.updateById(id, updateData);
  }

  /**
   * Link essay to application
   * @param {string} id - Application ID
   * @param {string} essayId - Essay ID
   * @returns {Promise<Application|null>}
   */
  async linkEssay(id, essayId) {
    return await this.updateById(id, { essayId });
  }

  /**
   * Delete application by ID
   * @param {string} id - Application ID
   * @returns {Promise<Application|null>}
   */
  async deleteById(id) {
    return await Application.findByIdAndDelete(id);
  }

  /**
   * Delete all applications for a user
   * @param {string} userId - User ID
   * @returns {Promise<{ deletedCount: number }>}
   */
  async deleteByUserId(userId) {
    return await Application.deleteMany({ userId });
  }

  /**
   * Get application statistics for a user
   * @param {string} userId - User ID
   * @returns {Promise<Object>}
   */
  async getStatsByUserId(userId) {
    const stats = await Application.aggregate([
      { $match: { userId: new (require('mongoose').Types.ObjectId)(userId) } },
      {
        $group: {
          _id: '$state',
          count: { $sum: 1 },
        },
      },
    ]);

    const result = {
      total: 0,
      working: 0,
      submitted: 0,
    };

    stats.forEach(stat => {
      result.total += stat.count;
      if (stat._id === 'working') result.working = stat.count;
      if (stat._id === 'submitted') result.submitted = stat.count;
    });

    return result;
  }
}

module.exports = new ApplicationRepository();
