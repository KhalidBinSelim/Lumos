const userService = require('./user.service');
const { validationResult } = require('express-validator');

class UserController {
  /**
   * POST /api/users/register
   * Register a new user
   */
  async register(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false, 
          errors: errors.array() 
        });
      }

      const { email, password, fullName } = req.body;
      const result = await userService.register({ email, password, fullName });

      res.status(201).json({
        success: true,
        message: 'Registration successful',
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * POST /api/users/login
   * Login user
   */
  async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false, 
          errors: errors.array() 
        });
      }

      const { email, password } = req.body;
      const result = await userService.login(email, password);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result,
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * GET /api/users/profile
   * Get current user profile
   */
  async getProfile(req, res) {
    try {
      const user = await userService.getProfile(req.user.id);

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * PUT /api/users/profile
   * Update full profile
   */
  async updateProfile(req, res) {
    try {
      const user = await userService.updateFullProfile(req.user.id, req.body);

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: user,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * PUT /api/users/profile/basic
   * Update basic info (Step 1)
   */
  async updateBasicInfo(req, res) {
    try {
      const user = await userService.updateBasicInfo(req.user.id, req.body);

      res.status(200).json({
        success: true,
        message: 'Basic info updated successfully',
        data: user,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * PUT /api/users/profile/academic
   * Update academic info (Step 2)
   */
  async updateAcademicInfo(req, res) {
    try {
      const user = await userService.updateAcademicInfo(req.user.id, req.body);

      res.status(200).json({
        success: true,
        message: 'Academic info updated successfully',
        data: user,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * PUT /api/users/profile/activities
   * Update activities & interests (Step 3)
   */
  async updateActivities(req, res) {
    try {
      const user = await userService.updateActivities(req.user.id, req.body);

      res.status(200).json({
        success: true,
        message: 'Activities updated successfully',
        data: user,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * PUT /api/users/profile/background
   * Update background info (Step 4)
   */
  async updateBackgroundInfo(req, res) {
    try {
      const user = await userService.updateBackgroundInfo(req.user.id, req.body);

      res.status(200).json({
        success: true,
        message: 'Background info updated successfully',
        data: user,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * POST /api/users/upload/resume
   * Upload resume
   */
  async uploadResume(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded',
        });
      }

      const user = await userService.uploadResume(req.user.id, req.file);

      res.status(200).json({
        success: true,
        message: 'Resume uploaded successfully',
        data: user,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * POST /api/users/upload/transcript
   * Upload transcript
   */
  async uploadTranscript(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded',
        });
      }

      const user = await userService.uploadTranscript(req.user.id, req.file);

      res.status(200).json({
        success: true,
        message: 'Transcript uploaded successfully',
        data: user,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * POST /api/users/upload/document
   * Upload other document
   */
  async uploadDocument(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded',
        });
      }

      const documentName = req.body.name || req.file.originalname;
      const user = await userService.uploadDocument(req.user.id, req.file, documentName);

      res.status(200).json({
        success: true,
        message: 'Document uploaded successfully',
        data: user,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * DELETE /api/users/documents/:documentId
   * Delete a document
   */
  async deleteDocument(req, res) {
    try {
      const user = await userService.deleteDocument(req.user.id, req.params.documentId);

      res.status(200).json({
        success: true,
        message: 'Document deleted successfully',
        data: user,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * POST /api/users/onboarding/complete
   * Mark onboarding as complete
   */
  async completeOnboarding(req, res) {
    try {
      const user = await userService.completeOnboarding(req.user.id);

      res.status(200).json({
        success: true,
        message: 'Onboarding completed successfully',
        data: user,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * POST /api/users/scholarships/:scholarshipId/save
   * Save a scholarship
   */
  async saveScholarship(req, res) {
    try {
      const result = await userService.saveScholarship(req.user.id, req.params.scholarshipId);

      res.status(200).json({
        success: true,
        message: 'Scholarship saved',
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * DELETE /api/users/scholarships/:scholarshipId/save
   * Unsave a scholarship
   */
  async unsaveScholarship(req, res) {
    try {
      const result = await userService.unsaveScholarship(req.user.id, req.params.scholarshipId);

      res.status(200).json({
        success: true,
        message: 'Scholarship removed from saved',
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * GET /api/users/scholarships/saved
   * Get saved scholarships
   */
  async getSavedScholarships(req, res) {
    try {
      const scholarships = await userService.getSavedScholarships(req.user.id);

      res.status(200).json({
        success: true,
        data: scholarships,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new UserController();

