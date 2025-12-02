const essayService = require('./essay.service');

class EssayController {
  /**
   * POST /api/essays
   * Create a new essay
   */
  async create(req, res) {
    try {
      const { applicationId, text } = req.body;

      if (!applicationId) {
        return res.status(400).json({
          success: false,
          message: 'Application ID is required',
        });
      }

      const essay = await essayService.createEssay(
        applicationId,
        req.user.id,
        text || ''
      );

      res.status(201).json({
        success: true,
        message: 'Essay created successfully',
        data: essay,
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
   * GET /api/essays/:id
   * Get essay by ID
   */
  async getById(req, res) {
    try {
      const essay = await essayService.getEssayById(
        req.params.id,
        req.user.id
      );

      res.status(200).json({
        success: true,
        data: essay,
      });
    } catch (error) {
      const status = error.message === 'Unauthorized' ? 403 : 
                     error.message === 'Essay not found' ? 404 : 400;
      res.status(status).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * GET /api/essays/application/:applicationId
   * Get essay by application ID
   */
  async getByApplicationId(req, res) {
    try {
      const essay = await essayService.getEssayByApplicationId(
        req.params.applicationId,
        req.user.id
      );

      res.status(200).json({
        success: true,
        data: essay,
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
   * PUT /api/essays/:id
   * Update essay text
   */
  async update(req, res) {
    try {
      const { text } = req.body;

      if (text === undefined) {
        return res.status(400).json({
          success: false,
          message: 'Text is required',
        });
      }

      const essay = await essayService.updateEssayText(
        req.params.id,
        req.user.id,
        text
      );

      res.status(200).json({
        success: true,
        message: 'Essay updated successfully',
        data: essay,
      });
    } catch (error) {
      const status = error.message === 'Unauthorized' ? 403 : 
                     error.message === 'Essay not found' ? 404 : 400;
      res.status(status).json({
        success: false,
        message: error.message,
      });
    }
  }

  /**
   * DELETE /api/essays/:id
   * Delete essay
   */
  async delete(req, res) {
    try {
      await essayService.deleteEssay(req.params.id, req.user.id);

      res.status(200).json({
        success: true,
        message: 'Essay deleted successfully',
      });
    } catch (error) {
      const status = error.message === 'Unauthorized' ? 403 : 
                     error.message === 'Essay not found' ? 404 : 400;
      res.status(status).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new EssayController();

