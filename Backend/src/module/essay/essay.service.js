const essayRepository = require('./essay.repository');
const applicationRepository = require('../application/application.repository');

class EssayService {
  /**
   * Create a new essay for an application
   * @param {string} applicationId - Application ID
   * @param {string} userId - User ID (for ownership verification)
   * @param {string} text - Initial essay text
   * @returns {Promise<Essay>}
   */
  async createEssay(applicationId, userId, text = '') {
    // Verify application exists and belongs to user
    const application = await applicationRepository.findById(applicationId);
    if (!application) {
      throw new Error('Application not found');
    }
    if (application.userId.toString() !== userId.toString()) {
      throw new Error('Unauthorized');
    }

    // Check if essay already exists for this application
    const exists = await essayRepository.existsForApplication(applicationId);
    if (exists) {
      throw new Error('Essay already exists for this application');
    }

    // Create essay
    const essay = await essayRepository.create({ applicationId, text });

    // Link essay to application
    await applicationRepository.linkEssay(applicationId, essay._id);

    return essay;
  }

  /**
   * Get essay by ID
   * @param {string} essayId - Essay ID
   * @param {string} userId - User ID (for ownership verification)
   * @returns {Promise<Essay>}
   */
  async getEssayById(essayId, userId) {
    const essay = await essayRepository.findById(essayId, true);
    
    if (!essay) {
      throw new Error('Essay not found');
    }

    // Verify ownership through application
    if (essay.applicationId?.userId?.toString() !== userId.toString()) {
      throw new Error('Unauthorized');
    }

    return essay;
  }

  /**
   * Get essay by application ID
   * @param {string} applicationId - Application ID
   * @param {string} userId - User ID (for ownership verification)
   * @returns {Promise<Essay|null>}
   */
  async getEssayByApplicationId(applicationId, userId) {
    // Verify application ownership
    const application = await applicationRepository.findById(applicationId);
    if (!application) {
      throw new Error('Application not found');
    }
    if (application.userId.toString() !== userId.toString()) {
      throw new Error('Unauthorized');
    }

    return await essayRepository.findByApplicationId(applicationId);
  }

  /**
   * Update essay text
   * @param {string} essayId - Essay ID
   * @param {string} userId - User ID (for ownership verification)
   * @param {string} text - New essay text
   * @returns {Promise<Essay>}
   */
  async updateEssayText(essayId, userId, text) {
    const essay = await essayRepository.findById(essayId, true);
    
    if (!essay) {
      throw new Error('Essay not found');
    }

    // Verify ownership through application
    const application = await applicationRepository.findById(essay.applicationId);
    if (!application || application.userId.toString() !== userId.toString()) {
      throw new Error('Unauthorized');
    }

    return await essayRepository.updateText(essayId, text);
  }

  /**
   * Delete essay
   * @param {string} essayId - Essay ID
   * @param {string} userId - User ID (for ownership verification)
   * @returns {Promise<{ deleted: boolean }>}
   */
  async deleteEssay(essayId, userId) {
    const essay = await essayRepository.findById(essayId, true);
    
    if (!essay) {
      throw new Error('Essay not found');
    }

    // Verify ownership through application
    const application = await applicationRepository.findById(essay.applicationId);
    if (!application || application.userId.toString() !== userId.toString()) {
      throw new Error('Unauthorized');
    }

    // Remove essay reference from application
    await applicationRepository.linkEssay(essay.applicationId, null);

    // Delete essay
    await essayRepository.deleteById(essayId);
    
    return { deleted: true };
  }
}

module.exports = new EssayService();

