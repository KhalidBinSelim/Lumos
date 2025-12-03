const applicationRepository = require('./application.repository');

class ApplicationService {
  /**
   * Create a new application
   * @param {string} userId - User ID
   * @param {string} scholarshipId - Scholarship ID
   * @param {string} essayId - Optional Essay ID
   * @returns {Promise<Application>}
   */
  async createApplication(userId, scholarshipId, essayId = null) {
    // Check if application already exists
    const exists = await applicationRepository.exists(userId, scholarshipId);
    if (exists) {
      throw new Error('Application already exists for this scholarship');
    }

    const applicationData = {
      userId,
      scholarshipId,
      essayId,
      state: 'working',
    };

    return await applicationRepository.create(applicationData);
  }

  /**
   * Get application by ID
   * @param {string} applicationId - Application ID
   * @param {string} userId - User ID (for ownership verification)
   * @returns {Promise<Application>}
   */
  async getApplicationById(applicationId, userId) {
    const application = await applicationRepository.findById(applicationId, true);
    
    if (!application) {
      throw new Error('Application not found');
    }

    // Verify ownership
    if (application.userId.toString() !== userId.toString()) {
      throw new Error('Unauthorized');
    }

    return application;
  }

  /**
   * Get all applications for a user
   * @param {string} userId - User ID
   * @param {Object} options - Query options { state?, page?, limit? }
   * @returns {Promise<{ applications: Application[], total: number }>}
   */
  async getApplicationsByUserId(userId, options = {}) {
    return await applicationRepository.findByUserId(userId, {
      ...options,
      populate: true,
    });
  }

  /**
   * Get all applications for a scholarship
   * @param {string} scholarshipId - Scholarship ID
   * @param {Object} options - Query options { state?, page?, limit? }
   * @returns {Promise<{ applications: Application[], total: number }>}
   */
  async getApplicationsByScholarshipId(scholarshipId, options = {}) {
    return await applicationRepository.findByScholarshipId(scholarshipId, {
      ...options,
      populate: true,
    });
  }

  /**
   * Get application by user and scholarship
   * @param {string} userId - User ID
   * @param {string} scholarshipId - Scholarship ID
   * @returns {Promise<Application|null>}
   */
  async getByUserAndScholarship(userId, scholarshipId) {
    return await applicationRepository.findByUserAndScholarship(userId, scholarshipId);
  }

  /**
   * Check if user has application for scholarship
   * @param {string} userId - User ID
   * @param {string} scholarshipId - Scholarship ID
   * @returns {Promise<boolean>}
   */
  async hasApplication(userId, scholarshipId) {
    return await applicationRepository.exists(userId, scholarshipId);
  }

  /**
   * Update application state
   * @param {string} applicationId - Application ID
   * @param {string} userId - User ID (for ownership verification)
   * @param {string} state - New state ('working' or 'submitted')
   * @returns {Promise<Application>}
   */
  async updateState(applicationId, userId, state) {
    const application = await this.getApplicationById(applicationId, userId);

    // Validate state transition
    if (application.state === 'submitted' && state === 'working') {
      throw new Error('Cannot change submitted application back to working');
    }

    return await applicationRepository.updateState(applicationId, state);
  }

  /**
   * Submit application
   * @param {string} applicationId - Application ID
   * @param {string} userId - User ID (for ownership verification)
   * @returns {Promise<Application>}
   */
  async submitApplication(applicationId, userId) {
    return await this.updateState(applicationId, userId, 'submitted');
  }

  /**
   * Link essay to application
   * @param {string} applicationId - Application ID
   * @param {string} userId - User ID (for ownership verification)
   * @param {string} essayId - Essay ID
   * @returns {Promise<Application>}
   */
  async linkEssay(applicationId, userId, essayId) {
    await this.getApplicationById(applicationId, userId);
    return await applicationRepository.linkEssay(applicationId, essayId);
  }

  /**
   * Delete application
   * @param {string} applicationId - Application ID
   * @param {string} userId - User ID (for ownership verification)
   * @returns {Promise<{ deleted: boolean }>}
   */
  async deleteApplication(applicationId, userId) {
    await this.getApplicationById(applicationId, userId);
    await applicationRepository.deleteById(applicationId);
    return { deleted: true };
  }

  /**
   * Get application statistics for a user
   * @param {string} userId - User ID
   * @returns {Promise<Object>}
   */
  async getStats(userId) {
    return await applicationRepository.getStatsByUserId(userId);
  }
}

module.exports = new ApplicationService();
