const express = require('express');
const essayController = require('./essay.controller');
const { authenticate } = require('../../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/essays
 * @desc    Create a new essay
 * @body    { applicationId: string, text?: string }
 * @access  Private
 */
router.post('/', essayController.create);

/**
 * @route   GET /api/essays/application/:applicationId
 * @desc    Get essay by application ID
 * @access  Private
 */
router.get('/application/:applicationId', essayController.getByApplicationId);

/**
 * @route   GET /api/essays/:id
 * @desc    Get essay by ID
 * @access  Private
 */
router.get('/:id', essayController.getById);

/**
 * @route   PUT /api/essays/:id
 * @desc    Update essay text
 * @body    { text: string }
 * @access  Private
 */
router.put('/:id', essayController.update);

/**
 * @route   DELETE /api/essays/:id
 * @desc    Delete essay
 * @access  Private
 */
router.delete('/:id', essayController.delete);

module.exports = router;

