const User = require('./user.model');

class UserRepository {
  /**
   * Create a new user
   */
  async create(userData) {
    const user = new User(userData);
    return await user.save();
  }

  /**
   * Find user by ID
   */
  async findById(id, includePassword = false) {
    const query = User.findById(id);
    if (includePassword) {
      query.select('+password');
    }
    return await query.exec();
  }

  /**
   * Find user by email
   */
  async findByEmail(email, includePassword = false) {
    const query = User.findOne({ email: email.toLowerCase() });
    if (includePassword) {
      query.select('+password');
    }
    return await query.exec();
  }

  /**
   * Check if email exists
   */
  async emailExists(email) {
    const user = await User.findOne({ email: email.toLowerCase() }).select('_id');
    return !!user;
  }

  /**
   * Update user by ID
   */
  async updateById(id, updateData) {
    return await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
  }

  /**
   * Update user profile (step-by-step onboarding)
   */
  async updateProfile(id, profileData) {
    const user = await User.findByIdAndUpdate(
      id,
      { $set: profileData },
      { new: true, runValidators: true }
    );
    
    if (user) {
      user.calculateProfileCompleteness();
      await user.save();
    }
    
    return user;
  }

  /**
   * Update last login timestamp
   */
  async updateLastLogin(id) {
    return await User.findByIdAndUpdate(
      id,
      { lastLogin: new Date() },
      { new: true }
    );
  }

  /**
   * Add document to user
   */
  async addDocument(userId, document) {
    return await User.findByIdAndUpdate(
      userId,
      { $push: { documents: document } },
      { new: true }
    );
  }

  /**
   * Remove document from user
   */
  async removeDocument(userId, documentId) {
    return await User.findByIdAndUpdate(
      userId,
      { $pull: { documents: { _id: documentId } } },
      { new: true }
    );
  }

  /**
   * Update resume
   */
  async updateResume(userId, resumeData) {
    return await User.findByIdAndUpdate(
      userId,
      { 
        resume: {
          ...resumeData,
          uploadedAt: new Date()
        }
      },
      { new: true }
    );
  }

  /**
   * Update transcript
   */
  async updateTranscript(userId, transcriptData) {
    return await User.findByIdAndUpdate(
      userId,
      { 
        transcript: {
          ...transcriptData,
          uploadedAt: new Date()
        }
      },
      { new: true }
    );
  }

  /**
   * Save scholarship to user's saved list
   */
  async saveScholarship(userId, scholarshipId) {
    return await User.findByIdAndUpdate(
      userId,
      { $addToSet: { savedScholarships: scholarshipId } },
      { new: true }
    );
  }

  /**
   * Remove scholarship from saved list
   */
  async unsaveScholarship(userId, scholarshipId) {
    return await User.findByIdAndUpdate(
      userId,
      { $pull: { savedScholarships: scholarshipId } },
      { new: true }
    );
  }

  /**
   * Get saved scholarships with population
   */
  async getSavedScholarships(userId) {
    const user = await User.findById(userId)
      .populate('savedScholarships')
      .select('savedScholarships');
    return user?.savedScholarships || [];
  }

  /**
   * Check if scholarship is saved
   */
  async isScholarshipSaved(userId, scholarshipId) {
    const user = await User.findOne({
      _id: userId,
      savedScholarships: scholarshipId
    }).select('_id');
    return !!user;
  }

  /**
   * Delete user by ID
   */
  async deleteById(id) {
    return await User.findByIdAndDelete(id);
  }

  /**
   * Update password
   */
  async updatePassword(id, newPassword) {
    const user = await User.findById(id).select('+password');
    if (!user) return null;
    
    user.password = newPassword;
    return await user.save();
  }

  /**
   * Mark onboarding as completed
   */
  async completeOnboarding(userId) {
    const user = await User.findById(userId);
    if (user) {
      user.onboardingCompleted = true;
      user.calculateProfileCompleteness();
      await user.save();
    }
    return user;
  }
}

module.exports = new UserRepository();

