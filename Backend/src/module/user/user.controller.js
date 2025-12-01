const express = require('express');
const router = express.Router();
const userService = require('../services/user.service');

class UserController {
  /**
   * Register new user
   * POST /api/users/register
   */
  async register(req, res) {
    try {
      const { email, password, firstName, lastName } = req.body;

      // Validate input
      if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({
          success: false,
          error: 'All fields are required'
        });
      }

      const result = await userService.register({
        email,
        password,
        firstName,
        lastName
      });

      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Login user
   * POST /api/users/login
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: 'Email and password are required'
        });
      }

      const result = await userService.login(email, password);

      res.status(200).json(result);
    } catch (error) {
      res.status(401).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * OAuth login (Google)
   * POST /api/users/oauth/google
   */
  async oauthLogin(req, res) {
    try {
      const { authId, email, firstName, lastName, profilePhoto } = req.body;

      // Validate input
      if (!authId || !email || !firstName || !lastName) {
        return res.status(400).json({
          success: false,
          error: 'OAuth data is incomplete'
        });
      }

      const result = await userService.oauthLogin({
        authId,
        email,
        firstName,
        lastName,
        profilePhoto
      });

      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Get user profile
   * GET /api/users/profile
   */
  async getProfile(req, res) {
    try {
      const userId = req.user.userId; // From auth middleware

      const result = await userService.getUserProfile(userId);

      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Update user profile
   * PUT /api/users/profile
   */
  async updateProfile(req, res) {
    try {
      const userId = req.user.userId;
      const updateData = req.body;

      const result = await userService.updateProfile(userId, updateData);

      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Update onboarding step
   * POST /api/users/onboarding
   */
  async updateOnboarding(req, res) {
    try {
      const userId = req.user.userId;
      const { step, data } = req.body;

      // Validate input
      if (!step || !data) {
        return res.status(400).json({
          success: false,
          error: 'Step and data are required'
        });
      }

      if (step < 1 || step > 5) {
        return res.status(400).json({
          success: false,
          error: 'Step must be between 1 and 5'
        });
      }

      const result = await userService.updateOnboardingStep(userId, step, data);

      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Upload profile photo
   * POST /api/users/profile-photo
   */
  async uploadProfilePhoto(req, res) {
    try {
      const userId = req.user.userId;

      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No file uploaded'
        });
      }

      const result = await userService.updateProfilePhoto(userId, req.file);

      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Remove profile photo
   * DELETE /api/users/profile-photo
   */
  async removeProfilePhoto(req, res) {
    try {
      const userId = req.user.userId;

      const result = await userService.removeProfilePhoto(userId);

      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Upload document
   * POST /api/users/documents
   */
  async uploadDocument(req, res) {
    try {
      const userId = req.user.userId;
      const { docType, type, description } = req.body;

      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No file uploaded'
        });
      }

      if (!['resume', 'transcript', 'other'].includes(docType)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid document type. Must be resume, transcript, or other'
        });
      }

      const result = await userService.addDocument(
        userId,
        docType,
        req.file,
        { type, description }
      );

      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Delete document
   * DELETE /api/users/documents/:docType/:docId?
   */
  async deleteDocument(req, res) {
    try {
      const userId = req.user.userId;
      const { docType, docId } = req.params;

      if (!['resume', 'transcript', 'other'].includes(docType)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid document type'
        });
      }

      if (docType === 'other' && !docId) {
        return res.status(400).json({
          success: false,
          error: 'Document ID is required for other documents'
        });
      }

      const result = await userService.deleteDocument(userId, docType, docId);

      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Change password
   * PUT /api/users/password
   */
  async changePassword(req, res) {
    try {
      const userId = req.user.userId;
      const { currentPassword, newPassword } = req.body;

      // Validate input
      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          error: 'Current password and new password are required'
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          error: 'New password must be at least 6 characters'
        });
      }

      const result = await userService.updatePassword(
        userId,
        currentPassword,
        newPassword
      );

      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Update preferences
   * PUT /api/users/preferences
   */
  async updatePreferences(req, res) {
    try {
      const userId = req.user.userId;
      const preferences = req.body;

      const result = await userService.updatePreferences(userId, preferences);

      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  /**
   * Delete account
   * DELETE /api/users/account
   */
  async deleteAccount(req, res) {
    try {
      const userId = req.user.userId;
      const { password } = req.body;

      const result = await userService.deleteAccount(userId, password);

      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new UserController();