const userRepository = require('./user.repository');
const { generateToken } = require('../../utils/auth');
const { 
  deleteFromCloudinary, 
  extractPublicId, 
  getResourceType 
} = require('../utils/cloudinaryHelper');
const { v4: uuidv4 } = require('uuid');

class UserService {
  /**
   * Register new user with email/password
   */
  async register(userData) {
    const { email, password, firstName, lastName } = userData;

    // Check if email exists
    const exists = await userRepository.emailExists(email);
    if (exists) {
      throw new Error('User already exists with this email');
    }

    // Create user
    const user = await userRepository.create({
      email,
      passwordHash: password, // Will be hashed by pre-save hook
      firstName,
      lastName,
      onboardingStep: 0,
      profileComplete: false
    });

    // Generate token
    const token = generateToken(user._id);

    return {
      success: true,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profileComplete: user.profileComplete
      },
      token
    };
  }

  /**
   * Login user with email/password
   */
  async login(email, password) {
    // Find user with password
    const user = await userRepository.findByEmailWithPassword(email);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    // Update last login
    await userRepository.updateLastLogin(user._id);

    // Generate token
    const token = generateToken(user._id);

    return {
      success: true,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profileComplete: user.profileComplete
      },
      token
    };
  }

  /**
   * OAuth login/register (Google)
   */
  async oauthLogin(oauthData) {
    const { authId, email, firstName, lastName, profilePhoto } = oauthData;

    // Check if user exists by authId or email
    let user = await userRepository.findByAuthId(authId);
    
    if (!user) {
      user = await userRepository.findByEmail(email);
    }

    let isNewUser = false;

    if (!user) {
      // Create new user
      user = await userRepository.create({
        authId,
        email,
        firstName,
        lastName,
        profilePhoto,
        onboardingStep: 0,
        profileComplete: false
      });
      isNewUser = true;
    } else {
      // Update authId if not set
      if (!user.authId && authId) {
        user = await userRepository.updateById(user._id, { authId });
      }
      // Update last login
      await userRepository.updateLastLogin(user._id);
    }

    // Generate token
    const token = generateToken(user._id);

    return {
      success: true,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profileComplete: user.profileComplete
      },
      token,
      isNewUser
    };
  }

  /**
   * Get user profile by ID
   */
  async getUserProfile(userId) {
    const user = await userRepository.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    return {
      success: true,
      user: user.toObject()
    };
  }

  /**
   * Update user profile
   */
  async updateProfile(userId, updateData) {
    // Remove sensitive fields
    delete updateData.passwordHash;
    delete updateData.authId;
    delete updateData.email;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    const user = await userRepository.updateById(userId, updateData);
    
    if (!user) {
      throw new Error('User not found');
    }

    // Check profile completion
    const profileComplete = user.checkProfileCompletion();
    if (profileComplete !== user.profileComplete) {
      await userRepository.updateById(userId, { profileComplete });
    }

    return {
      success: true,
      user: user.toObject(),
      message: 'Profile updated successfully'
    };
  }

  /**
   * Update onboarding step
   */
  async updateOnboardingStep(userId, step, stepData) {
    const user = await userRepository.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    let updateData = { onboardingStep: step };

    // Map step data to user fields
    if (step === 1) {
      // Basic Info
      updateData = {
        ...updateData,
        firstName: stepData.firstName,
        lastName: stepData.lastName,
        dateOfBirth: stepData.dateOfBirth,
        country: stepData.country,
        state: stepData.state,
        city: stepData.city,
        phone: stepData.phone
      };
    } else if (step === 2) {
      // Academic Info
      updateData.academic = { ...user.academic, ...stepData };
    } else if (step === 3) {
      // Interests & Activities
      updateData.interests = stepData.interests || [];
      updateData.activities = stepData.activities || [];
      updateData.awards = stepData.awards || [];
      updateData.workExperience = stepData.workExperience || [];
    } else if (step === 4) {
      // Demographics
      updateData.demographics = { ...user.demographics, ...stepData };
    } else if (step === 5) {
      // Documents (handled separately via file upload)
      updateData.profileComplete = true;
    }

    const updatedUser = await userRepository.updateById(userId, updateData);

    return {
      success: true,
      user: updatedUser.toObject(),
      nextStep: step < 5 ? step + 1 : null,
      profileComplete: updatedUser.profileComplete
    };
  }

  /**
   * Update profile photo
   */
  async updateProfilePhoto(userId, file) {
    const user = await userRepository.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    // Delete old photo from Cloudinary if exists
    if (user.profilePhoto) {
      const oldPublicId = extractPublicId(user.profilePhoto);
      if (oldPublicId) {
        await deleteFromCloudinary(oldPublicId, 'image').catch(err => {
          console.error('Error deleting old photo:', err);
        });
      }
    }

    // Update with new photo URL
    const updatedUser = await userRepository.updateById(userId, {
      profilePhoto: file.path // Cloudinary URL
    });

    return {
      success: true,
      user: updatedUser.toObject(),
      photoUrl: file.path,
      message: 'Profile photo updated successfully'
    };
  }

  /**
   * Remove profile photo
   */
  async removeProfilePhoto(userId) {
    const user = await userRepository.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    // Delete from Cloudinary
    if (user.profilePhoto) {
      const publicId = extractPublicId(user.profilePhoto);
      if (publicId) {
        await deleteFromCloudinary(publicId, 'image').catch(err => {
          console.error('Error deleting photo:', err);
        });
      }
    }

    // Remove from database
    await userRepository.updateById(userId, { profilePhoto: null });

    return {
      success: true,
      message: 'Profile photo removed successfully'
    };
  }

  /**
   * Add document (resume, transcript, etc.)
   */
  async addDocument(userId, docType, file, metadata = {}) {
    const user = await userRepository.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    const docId = uuidv4();
    const docData = {
      id: docId,
      filename: file.originalname,
      url: file.path, // Cloudinary URL
      uploadedAt: new Date()
    };

    let updateData = {};

    if (docType === 'resume') {
      // Delete old resume from Cloudinary
      if (user.documents?.resume?.url) {
        const oldPublicId = extractPublicId(user.documents.resume.url);
        const resourceType = getResourceType(user.documents.resume.url);
        if (oldPublicId) {
          await deleteFromCloudinary(oldPublicId, resourceType).catch(err => {
            console.error('Error deleting old resume:', err);
          });
        }
      }
      
      updateData['documents.resume'] = docData;
      
    } else if (docType === 'transcript') {
      // Delete old transcript from Cloudinary
      if (user.documents?.transcript?.url) {
        const oldPublicId = extractPublicId(user.documents.transcript.url);
        const resourceType = getResourceType(user.documents.transcript.url);
        if (oldPublicId) {
          await deleteFromCloudinary(oldPublicId, resourceType).catch(err => {
            console.error('Error deleting old transcript:', err);
          });
        }
      }
      
      updateData['documents.transcript'] = docData;
      
    } else if (docType === 'other') {
      docData.type = metadata.type || 'general';
      const otherDocs = user.documents?.other || [];
      otherDocs.push(docData);
      updateData['documents.other'] = otherDocs;
    }

    const updatedUser = await userRepository.updateById(userId, updateData);

    return {
      success: true,
      document: docData,
      user: updatedUser.toObject(),
      message: 'Document uploaded successfully'
    };
  }

  /**
   * Delete document
   */
  async deleteDocument(userId, docType, docId = null) {
    const user = await userRepository.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    let updateData = {};

    if (docType === 'resume' && user.documents?.resume?.url) {
      const publicId = extractPublicId(user.documents.resume.url);
      const resourceType = getResourceType(user.documents.resume.url);
      if (publicId) {
        await deleteFromCloudinary(publicId, resourceType).catch(err => {
          console.error('Error deleting resume:', err);
        });
      }
      updateData['documents.resume'] = null;
      
    } else if (docType === 'transcript' && user.documents?.transcript?.url) {
      const publicId = extractPublicId(user.documents.transcript.url);
      const resourceType = getResourceType(user.documents.transcript.url);
      if (publicId) {
        await deleteFromCloudinary(publicId, resourceType).catch(err => {
          console.error('Error deleting transcript:', err);
        });
      }
      updateData['documents.transcript'] = null;
      
    } else if (docType === 'other' && docId) {
      const doc = user.documents?.other?.find(d => d.id === docId);
      if (doc?.url) {
        const publicId = extractPublicId(doc.url);
        const resourceType = getResourceType(doc.url);
        if (publicId) {
          await deleteFromCloudinary(publicId, resourceType).catch(err => {
            console.error('Error deleting document:', err);
          });
        }
        const otherDocs = user.documents.other.filter(d => d.id !== docId);
        updateData['documents.other'] = otherDocs;
      }
    }

    await userRepository.updateById(userId, updateData);

    return {
      success: true,
      message: 'Document deleted successfully'
    };
  }

  /**
   * Update password
   */
  async updatePassword(userId, currentPassword, newPassword) {
    const user = await userRepository.findByIdWithPassword(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    if (!user.passwordHash) {
      throw new Error('OAuth users cannot change password');
    }

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      throw new Error('Current password is incorrect');
    }

    // Update password
    user.passwordHash = newPassword; // Will be hashed by pre-save hook
    await user.save();

    return {
      success: true,
      message: 'Password updated successfully'
    };
  }

  /**
   * Update preferences
   */
  async updatePreferences(userId, preferences) {
    const user = await userRepository.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    const updatedPreferences = { ...user.preferences, ...preferences };
    const updatedUser = await userRepository.updateById(userId, {
      preferences: updatedPreferences
    });

    return {
      success: true,
      preferences: updatedUser.preferences,
      message: 'Preferences updated successfully'
    };
  }

  /**
   * Delete user account (soft delete)
   */
  async deleteAccount(userId, password = null) {
    const user = await userRepository.findByIdWithPassword(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    // Verify password for non-OAuth users
    if (user.passwordHash && password) {
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        throw new Error('Password is incorrect');
      }
    }

    // Soft delete - schedule for deletion in 30 days
    const deletedUser = await userRepository.softDelete(userId);

    // TODO: Schedule cleanup of user data (applications, essays, etc.)
    // TODO: Send confirmation email

    return {
      success: true,
      message: 'Account deletion scheduled. You can cancel within 30 days by logging in.',
      deletionDate: deletedUser.deletionScheduled
    };
  }
}

module.exports = new UserService();