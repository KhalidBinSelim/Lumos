const applicationService = require('./application.service');

class ApplicationController {
  /**
   * POST /api/applications
   * Create a new application
   */
  async createApplication(req, res) {
    try {
      const { scholarshipId } = req.body;

      if (!scholarshipId) {
        return res.status(400).json({
          success: false,
          message: 'Scholarship ID is required',
        });
      }

      const application = await applicationService.createApplication(
        req.user.id,
        scholarshipId
      );

      res.status(201).json({
        success: true,
        message: 'Application started successfully',
        data: application,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * GET /api/applications
   * Get all applications for current user
   */
  async getApplications(req, res) {
    try {
      const filters = {
        status: req.query.status,
        search: req.query.search,
      };

      const options = {
        page: req.query.page || 1,
        limit: req.query.limit || 20,
        sortBy: req.query.sortBy || 'lastActivityAt',
        sortOrder: req.query.sortOrder || 'desc',
      };

      const result = await applicationService.getUserApplications(
        req.user.id,
        filters,
        options
      );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * GET /api/applications/stats
   * Get application statistics
   */
  async getStats(req, res) {
    try {
      const stats = await applicationService.getApplicationStats(req.user.id);

      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * GET /api/applications/urgent
   * Get urgent applications
   */
  async getUrgentApplications(req, res) {
    try {
      const applications = await applicationService.getUrgentApplications(req.user.id);

      res.status(200).json({
        success: true,
        data: applications,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * GET /api/applications/calendar
   * Get applications for calendar view
   */
  async getForCalendar(req, res) {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: 'Start date and end date are required',
        });
      }

      const applications = await applicationService.getForCalendar(
        req.user.id,
        startDate,
        endDate
      );

      res.status(200).json({
        success: true,
        data: applications,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * GET /api/applications/:id
   * Get application by ID
   */
  async getApplicationById(req, res) {
    try {
      const application = await applicationService.getApplicationById(
        req.params.id,
        req.user.id
      );

      res.status(200).json({
        success: true,
        data: application,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * PUT /api/applications/:id
   * Update application
   */
  async updateApplication(req, res) {
    try {
      const application = await applicationService.updateApplication(
        req.params.id,
        req.user.id,
        req.body
      );

      res.status(200).json({
        success: true,
        message: 'Application updated successfully',
        data: application,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * PUT /api/applications/:id/requirements/:reqId
   * Update requirement status
   */
  async updateRequirement(req, res) {
    try {
      const { status, details } = req.body;

      const application = await applicationService.updateRequirement(
        req.params.id,
        req.user.id,
        req.params.reqId,
        status,
        details
      );

      res.status(200).json({
        success: true,
        message: 'Requirement updated successfully',
        data: application,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * POST /api/applications/:id/requirements
   * Add requirement
   */
  async addRequirement(req, res) {
    try {
      const application = await applicationService.addRequirement(
        req.params.id,
        req.user.id,
        req.body
      );

      res.status(201).json({
        success: true,
        message: 'Requirement added successfully',
        data: application,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * DELETE /api/applications/:id/requirements/:reqId
   * Remove requirement
   */
  async removeRequirement(req, res) {
    try {
      const application = await applicationService.removeRequirement(
        req.params.id,
        req.user.id,
        req.params.reqId
      );

      res.status(200).json({
        success: true,
        message: 'Requirement removed successfully',
        data: application,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * PUT /api/applications/:id/essay
   * Save essay draft
   */
  async saveEssayDraft(req, res) {
    try {
      const { content } = req.body;

      if (!content) {
        return res.status(400).json({
          success: false,
          message: 'Essay content is required',
        });
      }

      const application = await applicationService.saveEssayDraft(
        req.params.id,
        req.user.id,
        content
      );

      res.status(200).json({
        success: true,
        message: 'Essay draft saved successfully',
        data: application,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * POST /api/applications/:id/documents
   * Upload document to application
   */
  async uploadDocument(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No file uploaded',
        });
      }

      const { type, name } = req.body;

      const application = await applicationService.uploadDocument(
        req.params.id,
        req.user.id,
        req.file,
        type,
        name
      );

      res.status(200).json({
        success: true,
        message: 'Document uploaded successfully',
        data: application,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * DELETE /api/applications/:id/documents/:docId
   * Delete document from application
   */
  async deleteDocument(req, res) {
    try {
      const application = await applicationService.deleteDocument(
        req.params.id,
        req.user.id,
        req.params.docId
      );

      res.status(200).json({
        success: true,
        message: 'Document deleted successfully',
        data: application,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * POST /api/applications/:id/submit
   * Submit application
   */
  async submitApplication(req, res) {
    try {
      const { confirmationNumber } = req.body;

      const application = await applicationService.submitApplication(
        req.params.id,
        req.user.id,
        confirmationNumber
      );

      res.status(200).json({
        success: true,
        message: 'Application submitted successfully',
        data: application,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * POST /api/applications/:id/won
   * Mark application as won
   */
  async markAsWon(req, res) {
    try {
      const application = await applicationService.markAsWon(
        req.params.id,
        req.user.id,
        req.body.awardDetails
      );

      res.status(200).json({
        success: true,
        message: 'Congratulations! Application marked as won',
        data: application,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * POST /api/applications/:id/rejected
   * Mark application as rejected
   */
  async markAsRejected(req, res) {
    try {
      const application = await applicationService.markAsRejected(
        req.params.id,
        req.user.id,
        req.body.feedback
      );

      res.status(200).json({
        success: true,
        message: 'Application marked as rejected',
        data: application,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * POST /api/applications/:id/withdraw
   * Withdraw application
   */
  async withdrawApplication(req, res) {
    try {
      const application = await applicationService.withdrawApplication(
        req.params.id,
        req.user.id
      );

      res.status(200).json({
        success: true,
        message: 'Application withdrawn',
        data: application,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * DELETE /api/applications/:id
   * Delete application
   */
  async deleteApplication(req, res) {
    try {
      await applicationService.deleteApplication(req.params.id, req.user.id);

      res.status(200).json({
        success: true,
        message: 'Application deleted successfully',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * PUT /api/applications/:id/reminders
   * Update reminders
   */
  async updateReminders(req, res) {
    try {
      const application = await applicationService.updateReminders(
        req.params.id,
        req.user.id,
        req.body
      );

      res.status(200).json({
        success: true,
        message: 'Reminders updated successfully',
        data: application,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * POST /api/applications/:id/next-steps
   * Add next step
   */
  async addNextStep(req, res) {
    try {
      const application = await applicationService.addNextStep(
        req.params.id,
        req.user.id,
        req.body
      );

      res.status(201).json({
        success: true,
        message: 'Next step added successfully',
        data: application,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * PUT /api/applications/:id/next-steps/:index/complete
   * Complete next step
   */
  async completeNextStep(req, res) {
    try {
      const application = await applicationService.completeNextStep(
        req.params.id,
        req.user.id,
        parseInt(req.params.index)
      );

      res.status(200).json({
        success: true,
        message: 'Step marked as complete',
        data: application,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * POST /api/applications/:id/duplicate
   * Duplicate application
   */
  async duplicateApplication(req, res) {
    try {
      const { scholarshipId } = req.body;

      if (!scholarshipId) {
        return res.status(400).json({
          success: false,
          message: 'Target scholarship ID is required',
        });
      }

      const application = await applicationService.duplicateApplication(
        req.params.id,
        req.user.id,
        scholarshipId
      );

      res.status(201).json({
        success: true,
        message: 'Application duplicated successfully',
        data: application,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new ApplicationController();

