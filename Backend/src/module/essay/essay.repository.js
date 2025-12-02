const Essay = require('./essay.model');

class EssayRepository {
  /**
   * Create a new essay
   * @param {Object} essayData - { applicationId, text? }
   * @returns {Promise<Essay>}
   */
  async create(essayData) {
    const essay = new Essay(essayData);
    return await essay.save();
  }

  /**
   * Find essay by ID
   * @param {string} id - Essay ID
   * @param {boolean} populate - Whether to populate application reference
   * @returns {Promise<Essay|null>}
   */
  async findById(id, populate = false) {
    const query = Essay.findById(id);
    if (populate) {
      query.populate('applicationId');
    }
    return await query.exec();
  }

  /**
   * Find essay by application ID
   * @param {string} applicationId - Application ID
   * @returns {Promise<Essay|null>}
   */
  async findByApplicationId(applicationId) {
    return await Essay.findOne({ applicationId });
  }

  /**
   * Check if essay exists for application
   * @param {string} applicationId - Application ID
   * @returns {Promise<boolean>}
   */
  async existsForApplication(applicationId) {
    const essay = await Essay.findOne({ applicationId }).select('_id');
    return !!essay;
  }

  /**
   * Update essay by ID
   * @param {string} id - Essay ID
   * @param {Object} updateData - Fields to update
   * @returns {Promise<Essay|null>}
   */
  async updateById(id, updateData) {
    // Set lastEditedAt if text is being updated
    if (updateData.text !== undefined) {
      updateData.lastEditedAt = new Date();
    }
    return await Essay.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
  }

  /**
   * Update essay text
   * @param {string} id - Essay ID
   * @param {string} text - New essay text
   * @returns {Promise<Essay|null>}
   */
  async updateText(id, text) {
    return await this.updateById(id, { text });
  }

  /**
   * Update essay by application ID
   * @param {string} applicationId - Application ID
   * @param {Object} updateData - Fields to update
   * @returns {Promise<Essay|null>}
   */
  async updateByApplicationId(applicationId, updateData) {
    if (updateData.text !== undefined) {
      updateData.lastEditedAt = new Date();
    }
    return await Essay.findOneAndUpdate(
      { applicationId },
      { $set: updateData },
      { new: true, runValidators: true }
    );
  }

  /**
   * Delete essay by ID
   * @param {string} id - Essay ID
   * @returns {Promise<Essay|null>}
   */
  async deleteById(id) {
    return await Essay.findByIdAndDelete(id);
  }

  /**
   * Delete essay by application ID
   * @param {string} applicationId - Application ID
   * @returns {Promise<{ deletedCount: number }>}
   */
  async deleteByApplicationId(applicationId) {
    return await Essay.deleteOne({ applicationId });
  }
}

module.exports = new EssayRepository();

