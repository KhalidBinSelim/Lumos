const applicationRepository = require('./application.repository');
const scholarshipRepository = require('../scholarship/scholarship.repository');
const { deleteFile } = require('../../config/cloudinary');

class ApplicationService {
  /**
   * Create a new application
   */
  async createApplication(userId, scholarshipId) {
    // Check if application already exists
    const exists = await applicationRepository.exists(userId, scholarshipId);
    if (exists) {
      throw new Error('You have already started an application for this scholarship');
    }

    // Get scholarship to copy requirements
    const scholarship = await scholarshipRepository.findById(scholarshipId);
    if (!scholarship) {
      throw new Error('Scholarship not found');
    }

    // Build requirements from scholarship
    const requirements = [];
    
    // Application form is always required
    requirements.push({
      label: 'Application form',
      status: 'missing',
    });

    // Essay
    if (scholarship.essayRequired) {
      requirements.push({
        label: `Essay (${scholarship.essayWordCount?.min || 500}-${scholarship.essayWordCount?.max || 750} words)`,
        status: 'missing',
        details: scholarship.essayPrompt,
      });
    }

    // Transcript
    if (scholarship.transcriptRequired) {
      requirements.push({
        label: 'Official Transcript',
        status: 'missing',
      });
    }

    // Letters of recommendation
    if (scholarship.lorRequired > 0) {
      requirements.push({
        label: `${scholarship.lorRequired} Letter(s) of Recommendation`,
        status: 'missing',
        details: `0/${scholarship.lorRequired} received`,
      });
    }

    // Portfolio
    if (scholarship.portfolioRequired) {
      requirements.push({
        label: 'Portfolio',
        status: 'missing',
      });
    }

    // Add any additional requirements from scholarship
    if (scholarship.requirements?.length > 0) {
      scholarship.requirements.forEach(req => {
        if (!requirements.some(r => r.label.toLowerCase().includes(req.toLowerCase()))) {
          requirements.push({
            label: req,
            status: 'missing',
          });
        }
      });
    }

    const applicationData = {
      user: userId,
      scholarship: scholarshipId,
      status: 'In Progress',
      requirements,
      essay: {
        prompt: scholarship.essayPrompt,
        wordLimit: {
          min: scholarship.essayWordCount?.min || 500,
          max: scholarship.essayWordCount?.max || 750,
        },
        drafts: [],
      },
      decisionExpectedBy: scholarship.awardNotification,
      timeline: [{
        action: 'Started',
        timestamp: new Date(),
        details: 'Application created',
      }],
    };

    const application = await applicationRepository.create(applicationData);

    // Increment application count on scholarship
    await scholarshipRepository.updateById(scholarshipId, {
      $inc: { applicationCount: 1 },
    });

    return await applicationRepository.findById(application._id);
  }

  /**
   * Get application by ID
   */
  async getApplicationById(applicationId, userId) {
    const application = await applicationRepository.findById(applicationId);
    
    if (!application) {
      throw new Error('Application not found');
    }

    // Verify ownership
    if (application.user.toString() !== userId.toString()) {
      throw new Error('Unauthorized');
    }

    return application;
  }

  /**
   * Get all applications for a user
   */
  async getUserApplications(userId, filters = {}, options = {}) {
    return await applicationRepository.findByUser(userId, filters, options);
  }

  /**
   * Get application statistics
   */
  async getApplicationStats(userId) {
    return await applicationRepository.getStatsByUser(userId);
  }

  /**
   * Get urgent applications
   */
  async getUrgentApplications(userId) {
    return await applicationRepository.getUrgentApplications(userId);
  }

  /**
   * Update application
   */
  async updateApplication(applicationId, userId, updateData) {
    const application = await this.getApplicationById(applicationId, userId);

    // Don't allow updating submitted/won/rejected applications
    if (['Submitted', 'Won', 'Rejected'].includes(application.status)) {
      throw new Error('Cannot modify a submitted or completed application');
    }

    const allowed = ['notes', 'reminders'];
    const filteredData = {};
    
    Object.keys(updateData).forEach(key => {
      if (allowed.includes(key)) {
        filteredData[key] = updateData[key];
      }
    });

    return await applicationRepository.updateById(applicationId, filteredData);
  }

  /**
   * Update requirement status
   */
  async updateRequirement(applicationId, userId, requirementId, status, details = null) {
    await this.getApplicationById(applicationId, userId);

    const validStatuses = ['completed', 'pending', 'missing', 'draft'];
    if (!validStatuses.includes(status)) {
      throw new Error('Invalid status');
    }

    return await applicationRepository.updateRequirement(
      applicationId,
      requirementId,
      status,
      details
    );
  }

  /**
   * Add requirement
   */
  async addRequirement(applicationId, userId, requirement) {
    await this.getApplicationById(applicationId, userId);

    return await applicationRepository.addRequirement(applicationId, {
      label: requirement.label,
      status: 'missing',
      details: requirement.details,
      dueDate: requirement.dueDate,
    });
  }

  /**
   * Remove requirement
   */
  async removeRequirement(applicationId, userId, requirementId) {
    await this.getApplicationById(applicationId, userId);

    return await applicationRepository.removeRequirement(applicationId, requirementId);
  }

  /**
   * Save essay draft
   */
  async saveEssayDraft(applicationId, userId, content) {
    await this.getApplicationById(applicationId, userId);

    const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

    return await applicationRepository.saveEssayDraft(applicationId, content, wordCount);
  }

  /**
   * Upload document to application
   */
  async uploadDocument(applicationId, userId, fileData, documentType, documentName) {
    await this.getApplicationById(applicationId, userId);

    const document = {
      name: documentName || fileData.originalname || 'Document',
      type: documentType || 'other',
      url: fileData.path || fileData.secure_url,
      publicId: fileData.filename || fileData.public_id,
    };

    return await applicationRepository.addDocument(applicationId, document);
  }

  /**
   * Delete document from application
   */
  async deleteDocument(applicationId, userId, documentId) {
    const application = await this.getApplicationById(applicationId, userId);

    const document = application.documents.id(documentId);
    if (document?.publicId) {
      try {
        await deleteFile(document.publicId);
      } catch (error) {
        console.error('Error deleting document from Cloudinary:', error);
      }
    }

    return await applicationRepository.removeDocument(applicationId, documentId);
  }

  /**
   * Submit application
   */
  async submitApplication(applicationId, userId, confirmationNumber = null) {
    const application = await this.getApplicationById(applicationId, userId);

    // Check if all required items are completed
    const missingItems = application.requirements.filter(
      r => r.status === 'missing'
    );

    if (missingItems.length > 0) {
      throw new Error(
        `Cannot submit. Missing items: ${missingItems.map(r => r.label).join(', ')}`
      );
    }

    return await applicationRepository.submit(applicationId, confirmationNumber);
  }

  /**
   * Mark as won
   */
  async markAsWon(applicationId, userId, awardDetails) {
    await this.getApplicationById(applicationId, userId);
    return await applicationRepository.markAsWon(applicationId, awardDetails);
  }

  /**
   * Mark as rejected
   */
  async markAsRejected(applicationId, userId, feedback = '') {
    await this.getApplicationById(applicationId, userId);
    return await applicationRepository.markAsRejected(applicationId, feedback);
  }

  /**
   * Withdraw application
   */
  async withdrawApplication(applicationId, userId) {
    await this.getApplicationById(applicationId, userId);
    return await applicationRepository.withdraw(applicationId);
  }

  /**
   * Delete application
   */
  async deleteApplication(applicationId, userId) {
    const application = await this.getApplicationById(applicationId, userId);

    // Delete associated documents from Cloudinary
    for (const doc of application.documents) {
      if (doc.publicId) {
        try {
          await deleteFile(doc.publicId);
        } catch (error) {
          console.error('Error deleting document:', error);
        }
      }
    }

    await applicationRepository.deleteById(applicationId);
    return { deleted: true };
  }

  /**
   * Get applications for calendar
   */
  async getForCalendar(userId, startDate, endDate) {
    return await applicationRepository.getForCalendar(
      userId,
      new Date(startDate),
      new Date(endDate)
    );
  }

  /**
   * Update reminders
   */
  async updateReminders(applicationId, userId, reminders) {
    await this.getApplicationById(applicationId, userId);
    return await applicationRepository.updateReminders(applicationId, reminders);
  }

  /**
   * Add next step (for submitted/won applications)
   */
  async addNextStep(applicationId, userId, step) {
    await this.getApplicationById(applicationId, userId);
    return await applicationRepository.addNextStep(applicationId, {
      step: step.step,
      dueDate: step.dueDate,
      completed: false,
    });
  }

  /**
   * Complete next step
   */
  async completeNextStep(applicationId, userId, stepIndex) {
    await this.getApplicationById(applicationId, userId);
    return await applicationRepository.completeNextStep(applicationId, stepIndex);
  }

  /**
   * Duplicate application (for reapplying)
   */
  async duplicateApplication(applicationId, userId, newScholarshipId) {
    const original = await this.getApplicationById(applicationId, userId);

    // Create new application with copied data
    const newApplication = await this.createApplication(userId, newScholarshipId);

    // Copy essay drafts if any
    if (original.essay?.drafts?.length > 0) {
      const latestDraft = original.essay.drafts[original.essay.drafts.length - 1];
      await this.saveEssayDraft(newApplication._id, userId, latestDraft.content);
    }

    return newApplication;
  }
}

module.exports = new ApplicationService();

