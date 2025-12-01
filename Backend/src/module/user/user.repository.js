const User = require('./user.model');

class UserRepository {
  /**
   * Create new user
   */
  async create(userData) {
    const user = new User(userData);
    return await user.save();
  }

  /**
   * Find user by ID
   */
  async findById(userId) {
    return await User.findById(userId).select('-passwordHash');
  }

  /**
   * Find user by ID (including password hash for login)
   */
  async findByIdWithPassword(userId) {
    return await User.findById(userId);
  }

  /**
   * Find user by email
   */
  async findByEmail(email) {
    return await User.findOne({ email: email.toLowerCase() });
  }

  /**
   * Find user by email (including password hash)
   */
  async findByEmailWithPassword(email) {
    return await User.findOne({ email: email.toLowerCase() });
  }

  /**
   * Find user by OAuth ID
   */
  async findByAuthId(authId) {
    return await User.findOne({ authId });
  }

  /**
   * Update user by ID
   */
  async updateById(userId, updateData) {
    return await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-passwordHash');
  }

  /**
   * Delete user by ID (soft delete)
   */
  async softDelete(userId) {
    return await User.findByIdAndUpdate(
      userId,
      { 
        deletionScheduled: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      },
      { new: true }
    );
  }

  /**
   * Hard delete user by ID
   */
  async deleteById(userId) {
    return await User.findByIdAndDelete(userId);
  }

  /**
   * Check if email exists
   */
  async emailExists(email) {
    const count = await User.countDocuments({ email: email.toLowerCase() });
    return count > 0;
  }

  /**
   * Update last login
   */
  async updateLastLogin(userId) {
    return await User.findByIdAndUpdate(userId, { lastLogin: new Date() });
  }
}

module.exports = new UserRepository();