const jwt = require('jsonwebtoken');
const userRepository = require('./user.repository');
const { deleteFile, getPublicIdFromUrl } = require('../../config/cloudinary');

class UserService {
  /**
   * Generate JWT token
   */
  generateToken(userId) {
    return jwt.sign(
      { id: userId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
  }

  /**
   * Register a new user
   */
  async register(userData) {
    const { email, password, fullName } = userData;

    // Check if email already exists
    const emailExists = await userRepository.emailExists(email);
    if (emailExists) {
      throw new Error('Email already registered');
    }

    // Parse fullName into firstName and lastName
    let firstName = '', lastName = '';
    if (fullName) {
      const nameParts = fullName.trim().split(' ');
      firstName = nameParts[0] || '';
      lastName = nameParts.slice(1).join(' ') || '';
    }

    // Create user
    const user = await userRepository.create({
      email,
      password,
      firstName,
      lastName,
    });

    // Generate token
    const token = this.generateToken(user._id);

    return {
      user: this.sanitizeUser(user),
      token,
    };
  }

  /**
   * Login user
   */
  async login(email, password) {
    // Find user with password
    const user = await userRepository.findByEmail(email, true);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    // Update last login
    await userRepository.updateLastLogin(user._id);

    // Generate token
    const token = this.generateToken(user._id);

    return {
      user: this.sanitizeUser(user),
      token,
    };
  }

  /**
   * Get user profile
   */
  async getProfile(userId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return this.sanitizeUser(user);
  }

  /**
   * Update user profile (basic info - Step 1)
   */
  async updateBasicInfo(userId, data) {
    const { firstName, lastName, dateOfBirth, country, state, city, phone } = data;
    
    const user = await userRepository.updateProfile(userId, {
      firstName,
      lastName,
      dateOfBirth,
      country,
      state,
      city,
      phone,
    });

    if (!user) {
      throw new Error('User not found');
    }

    return this.sanitizeUser(user);
  }

  /**
   * Update academic info (Step 2)
   */
  async updateAcademicInfo(userId, data) {
    const {
      educationLevel,
      schoolName,
      gradeYear,
      graduationYear,
      gpa,
      gpaScale,
      major,
      minor,
      sat,
      ielts,
      classRank,
      classSize,
    } = data;

    const user = await userRepository.updateProfile(userId, {
      educationLevel,
      schoolName,
      gradeYear,
      graduationYear,
      gpa,
      gpaScale,
      major,
      minor,
      sat,
      ielts,
      classRank,
      classSize,
    });

    if (!user) {
      throw new Error('User not found');
    }

    return this.sanitizeUser(user);
  }

  /**
   * Update activities & interests (Step 3)
   */
  async updateActivities(userId, data) {
    const { interests, activities, awards, jobs } = data;

    const user = await userRepository.updateProfile(userId, {
      interests,
      activities,
      awards,
      jobs,
    });

    if (!user) {
      throw new Error('User not found');
    }

    return this.sanitizeUser(user);
  }

  /**
   * Update background info (Step 4)
   */
  async updateBackgroundInfo(userId, data) {
    const {
      gender,
      ethnicities,
      ethnicityOther,
      firstGen,
      citizenship,
      citizenshipOther,
      incomeRange,
      military,
      disability,
      disabilityDetails,
    } = data;

    const user = await userRepository.updateProfile(userId, {
      gender,
      ethnicities,
      ethnicityOther,
      firstGen,
      citizenship,
      citizenshipOther,
      incomeRange,
      military,
      disability,
      disabilityDetails,
    });

    if (!user) {
      throw new Error('User not found');
    }

    return this.sanitizeUser(user);
  }

  /**
   * Upload resume
   */
  async uploadResume(userId, fileData) {
    // Get existing resume to delete old file
    const user = await userRepository.findById(userId);
    if (user?.resume?.publicId) {
      try {
        await deleteFile(user.resume.publicId);
      } catch (error) {
        console.error('Error deleting old resume:', error);
      }
    }

    const updatedUser = await userRepository.updateResume(userId, {
      url: fileData.path || fileData.secure_url,
      publicId: fileData.filename || fileData.public_id,
    });

    if (!updatedUser) {
      throw new Error('User not found');
    }

    return this.sanitizeUser(updatedUser);
  }

  /**
   * Upload transcript
   */
  async uploadTranscript(userId, fileData) {
    // Get existing transcript to delete old file
    const user = await userRepository.findById(userId);
    if (user?.transcript?.publicId) {
      try {
        await deleteFile(user.transcript.publicId);
      } catch (error) {
        console.error('Error deleting old transcript:', error);
      }
    }

    const updatedUser = await userRepository.updateTranscript(userId, {
      url: fileData.path || fileData.secure_url,
      publicId: fileData.filename || fileData.public_id,
    });

    if (!updatedUser) {
      throw new Error('User not found');
    }

    return this.sanitizeUser(updatedUser);
  }

  /**
   * Upload other document
   */
  async uploadDocument(userId, fileData, documentName) {
    const document = {
      name: documentName || fileData.originalname || 'Document',
      url: fileData.path || fileData.secure_url,
      publicId: fileData.filename || fileData.public_id,
      type: 'other',
    };

    const user = await userRepository.addDocument(userId, document);
    if (!user) {
      throw new Error('User not found');
    }

    return this.sanitizeUser(user);
  }

  /**
   * Delete document
   */
  async deleteDocument(userId, documentId) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const document = user.documents.id(documentId);
    if (document?.publicId) {
      try {
        await deleteFile(document.publicId);
      } catch (error) {
        console.error('Error deleting document from Cloudinary:', error);
      }
    }

    const updatedUser = await userRepository.removeDocument(userId, documentId);
    return this.sanitizeUser(updatedUser);
  }

  /**
   * Complete onboarding
   */
  async completeOnboarding(userId) {
    const user = await userRepository.completeOnboarding(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return this.sanitizeUser(user);
  }

  /**
   * Save scholarship
   */
  async saveScholarship(userId, scholarshipId) {
    const user = await userRepository.saveScholarship(userId, scholarshipId);
    if (!user) {
      throw new Error('User not found');
    }
    return { saved: true };
  }

  /**
   * Unsave scholarship
   */
  async unsaveScholarship(userId, scholarshipId) {
    const user = await userRepository.unsaveScholarship(userId, scholarshipId);
    if (!user) {
      throw new Error('User not found');
    }
    return { saved: false };
  }

  /**
   * Get saved scholarships
   */
  async getSavedScholarships(userId) {
    return await userRepository.getSavedScholarships(userId);
  }

  /**
   * Check if scholarship is saved
   */
  async isScholarshipSaved(userId, scholarshipId) {
    return await userRepository.isScholarshipSaved(userId, scholarshipId);
  }

  /**
   * Update full profile (all at once)
   */
  async updateFullProfile(userId, profileData) {
    const user = await userRepository.updateProfile(userId, profileData);
    if (!user) {
      throw new Error('User not found');
    }
    return this.sanitizeUser(user);
  }

  /**
   * Remove sensitive fields from user object
   */
  sanitizeUser(user) {
    const userObj = user.toObject ? user.toObject() : { ...user };
    delete userObj.password;
    delete userObj.__v;
    return userObj;
  }
}

module.exports = new UserService();

