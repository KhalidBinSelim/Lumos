const applicationService = require('./application.service');

class ApplicationController {
  /**
   * POST /api/applications
   * Create a new application
   */
  async create(req, res) {
    try {
      const { scholarshipId, essayId } = req.body;

      if (!scholarshipId) {
        return res.status(400).json({
          success: false,
          message: 'Scholarship ID is required',
        });
      }

      const application = await applicationService.createApplication(
        req.user.id,
        scholarshipId,
        essayId
      );

      res.status(201).json({
        success: true,
        message: 'Application created successfully',
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
  async getByUser(req, res) {
    try {
      const options = {
        state: req.query.state,
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 20,
      };

      const result = await applicationService.getApplicationsByUserId(
        req.user.id,
        options
      );

      res.status(200).json({
        success: true,
        data: result.applications,
        pagination: {
          total: result.total,
          page: options.page,
          limit: options.limit,
          pages: Math.ceil(result.total / options.limit),
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * GET /api/applications/scholarship/:scholarshipId
   * Get all applications for a scholarship
   */
  async getByScholarship(req, res) {
    try {
      const { scholarshipId } = req.params;
      const options = {
        state: req.query.state,
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 20,
      };

      const result = await applicationService.getApplicationsByScholarshipId(
        scholarshipId,
        options
      );

      res.status(200).json({
        success: true,
        data: result.applications,
        pagination: {
          total: result.total,
          page: options.page,
          limit: options.limit,
          pages: Math.ceil(result.total / options.limit),
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * GET /api/applications/check/:scholarshipId
   * Check if user has application for scholarship
   */
  async checkExists(req, res) {
    try {
      const { scholarshipId } = req.params;
      
      const application = await applicationService.getByUserAndScholarship(
        req.user.id,
        scholarshipId
      );

      res.status(200).json({
        success: true,
        data: {
          exists: !!application,
          application: application || null,
        },
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
   * Get application statistics for current user
   */
  async getStats(req, res) {
    try {
      const stats = await applicationService.getStats(req.user.id);

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
   * GET /api/applications/:id
   * Get application by ID
   */
  async getById(req, res) {
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
      const status = error.message === 'Unauthorized' ? 403 : 
                     error.message === 'Application not found' ? 404 : 400;
      res.status(status).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * PUT /api/applications/:id/state
   * Update application state
   */
  async updateState(req, res) {
    try {
      const { state } = req.body;

      if (!state || !['working', 'submitted'].includes(state)) {
        return res.status(400).json({
          success: false,
          message: 'Valid state (working or submitted) is required',
        });
      }

      const application = await applicationService.updateState(
        req.params.id,
        req.user.id,
        state
      );

      res.status(200).json({
        success: true,
        message: `Application ${state === 'submitted' ? 'submitted' : 'updated'} successfully`,
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
  async submit(req, res) {
    try {
      const application = await applicationService.submitApplication(
        req.params.id,
        req.user.id
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
   * PUT /api/applications/:id/essay
   * Link essay to application
   */
  async linkEssay(req, res) {
    try {
      const { essayId } = req.body;

      if (!essayId) {
        return res.status(400).json({
          success: false,
          message: 'Essay ID is required',
        });
      }

      const application = await applicationService.linkEssay(
        req.params.id,
        req.user.id,
        essayId
      );

      res.status(200).json({
        success: true,
        message: 'Essay linked successfully',
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
  async delete(req, res) {
    try {
      await applicationService.deleteApplication(req.params.id, req.user.id);

      res.status(200).json({
        success: true,
        message: 'Application deleted successfully',
      });
    } catch (error) {
      const status = error.message === 'Unauthorized' ? 403 : 
                     error.message === 'Application not found' ? 404 : 400;
      res.status(status).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new ApplicationController();
