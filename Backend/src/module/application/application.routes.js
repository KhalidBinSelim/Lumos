const express = require('express');
const applicationController = require('./application.controller');
const { authenticate } = require('../../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/applications
 * @desc    Create a new application
 * @body    { scholarshipId: string, essayId?: string }
 * @access  Private
 */
router.post('/', applicationController.create);

/**
 * @route   GET /api/applications
 * @desc    Get all applications for current user
 * @query   state (optional): 'working' | 'submitted'
 * @query   page (optional): number
 * @query   limit (optional): number
 * @access  Private
 */
router.get('/', applicationController.getByUser);

/**
 * @route   GET /api/applications/stats
 * @desc    Get application statistics for current user
 * @access  Private
 */
router.get('/stats', applicationController.getStats);

/**
 * @route   GET /api/applications/scholarship/:scholarshipId
 * @desc    Get all applications for a scholarship
 * @query   state (optional): 'working' | 'submitted'
 * @query   page (optional): number
 * @query   limit (optional): number
 * @access  Private
 */
router.get('/scholarship/:scholarshipId', applicationController.getByScholarship);

/**
 * @route   GET /api/applications/check/:scholarshipId
 * @desc    Check if current user has application for scholarship
 * @access  Private
 */
router.get('/check/:scholarshipId', applicationController.checkExists);

/**
 * @route   GET /api/applications/:id
 * @desc    Get application by ID
 * @access  Private
 */
router.get('/:id', applicationController.getById);

/**
 * @route   PUT /api/applications/:id/state
 * @desc    Update application state
 * @body    { state: 'working' | 'submitted' }
 * @access  Private
 */
router.put('/:id/state', applicationController.updateState);

/**
 * @route   POST /api/applications/:id/submit
 * @desc    Submit application (shortcut for state update)
 * @access  Private
 */
router.post('/:id/submit', applicationController.submit);

/**
 * @route   PUT /api/applications/:id/essay
 * @desc    Link essay to application
 * @body    { essayId: string }
 * @access  Private
 */
router.put('/:id/essay', applicationController.linkEssay);

/**
 * @route   DELETE /api/applications/:id
 * @desc    Delete application
 * @access  Private
 */
router.delete('/:id', applicationController.delete);

module.exports = router;
