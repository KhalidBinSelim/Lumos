const scholarshipService = require('./scholarship.service');

class ScholarshipController {
  /**
   * GET /api/scholarships
   * Get all scholarships with filters
   */
  async getScholarships(req, res) {
    try {
      const filters = {
        search: req.query.search,
        amountRanges: req.query.amount ? req.query.amount.split(',') : null,
        minAmount: req.query.minAmount,
        maxAmount: req.query.maxAmount,
        deadline: req.query.deadline,
        categories: req.query.categories ? req.query.categories.split(',') : null,
        demographics: req.query.demographics ? req.query.demographics.split(',') : null,
        eligibility: req.query.eligibility ? req.query.eligibility.split(',') : null,
        location: req.query.location,
        noEssay: req.query.noEssay === 'true',
        featured: req.query.featured === 'true',
        highMatch: req.query.highMatch === 'true',
      };

      const options = {
        page: req.query.page || 1,
        limit: req.query.limit || 10,
        sortBy: req.query.sortBy || 'deadline',
        sortOrder: req.query.sortOrder || 'asc',
      };

      const userId = req.user?.id || null;
      const result = await scholarshipService.getScholarships(filters, options, userId);

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
   * GET /api/scholarships/search
   * Search scholarships
   */
  async searchScholarships(req, res) {
    try {
      const { q, page, limit } = req.query;

      if (!q) {
        return res.status(400).json({
          success: false,
          message: 'Search query is required',
        });
      }

      const options = { page: page || 1, limit: limit || 10 };
      const userId = req.user?.id || null;
      const result = await scholarshipService.searchScholarships(q, options, userId);

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
   * GET /api/scholarships/recommended
   * Get recommended scholarships for user
   */
  async getRecommendedScholarships(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const scholarships = await scholarshipService.getRecommendedScholarships(
        req.user.id,
        limit
      );

      res.status(200).json({
        success: true,
        data: scholarships,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * GET /api/scholarships/featured
   * Get featured scholarships
   */
  async getFeaturedScholarships(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 5;
      const userId = req.user?.id || null;
      const scholarships = await scholarshipService.getFeaturedScholarships(userId, limit);

      res.status(200).json({
        success: true,
        data: scholarships,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * GET /api/scholarships/deadlines
   * Get upcoming deadlines
   */
  async getUpcomingDeadlines(req, res) {
    try {
      const days = parseInt(req.query.days) || 30;
      const limit = parseInt(req.query.limit) || 10;
      const userId = req.user?.id || null;
      
      const scholarships = await scholarshipService.getUpcomingDeadlines(userId, days, limit);

      res.status(200).json({
        success: true,
        data: scholarships,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * GET /api/scholarships/filters
   * Get filter options
   */
  async getFilterOptions(req, res) {
    try {
      const options = await scholarshipService.getFilterOptions();

      res.status(200).json({
        success: true,
        data: options,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * GET /api/scholarships/:id
   * Get scholarship by ID
   */
  async getScholarshipById(req, res) {
    try {
      const userId = req.user?.id || null;
      const scholarship = await scholarshipService.getScholarshipById(
        req.params.id,
        userId
      );

      res.status(200).json({
        success: true,
        data: scholarship,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * POST /api/scholarships/:id/save
   * Save a scholarship
   */
  async saveScholarship(req, res) {
    try {
      const result = await scholarshipService.saveScholarship(
        req.user.id,
        req.params.id
      );

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
   * DELETE /api/scholarships/:id/save
   * Unsave a scholarship
   */
  async unsaveScholarship(req, res) {
    try {
      const result = await scholarshipService.unsaveScholarship(
        req.user.id,
        req.params.id
      );

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
   * GET /api/scholarships/saved
   * Get saved scholarships
   */
  async getSavedScholarships(req, res) {
    try {
      const scholarships = await scholarshipService.getSavedScholarships(req.user.id);

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

  /**
   * POST /api/scholarships
   * Create scholarship (admin)
   */
  async createScholarship(req, res) {
    try {
      const scholarship = await scholarshipService.createScholarship(req.body);

      res.status(201).json({
        success: true,
        message: 'Scholarship created successfully',
        data: scholarship,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * PUT /api/scholarships/:id
   * Update scholarship (admin)
   */
  async updateScholarship(req, res) {
    try {
      const scholarship = await scholarshipService.updateScholarship(
        req.params.id,
        req.body
      );

      res.status(200).json({
        success: true,
        message: 'Scholarship updated successfully',
        data: scholarship,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * DELETE /api/scholarships/:id
   * Delete scholarship (admin)
   */
  async deleteScholarship(req, res) {
    try {
      await scholarshipService.deleteScholarship(req.params.id);

      res.status(200).json({
        success: true,
        message: 'Scholarship deleted successfully',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new ScholarshipController();

