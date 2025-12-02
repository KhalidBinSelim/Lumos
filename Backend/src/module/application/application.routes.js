const express = require('express');
const applicationController = require('./application.controller');
const { authenticate } = require('../../middleware/auth');
const { uploadDocument } = require('../../config/cloudinary');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// ==================== Application CRUD ====================

/**
 * @route   POST /api/applications
 * @desc    Create a new application
 * @access  Private
 */
router.post('/', applicationController.createApplication);

/**
 * @route   GET /api/applications
 * @desc    Get all applications for current user
 * @access  Private
 */
router.get('/', applicationController.getApplications);

/**
 * @route   GET /api/applications/stats
 * @desc    Get application statistics
 * @access  Private
 */
router.get('/stats', applicationController.getStats);

/**
 * @route   GET /api/applications/urgent
 * @desc    Get urgent applications (deadline within 7 days)
 * @access  Private
 */
router.get('/urgent', applicationController.getUrgentApplications);

/**
 * @route   GET /api/applications/calendar
 * @desc    Get applications for calendar view
 * @access  Private
 */
router.get('/calendar', applicationController.getForCalendar);

/**
 * @route   GET /api/applications/:id
 * @desc    Get application by ID
 * @access  Private
 */
router.get('/:id', applicationController.getApplicationById);

/**
 * @route   PUT /api/applications/:id
 * @desc    Update application
 * @access  Private
 */
router.put('/:id', applicationController.updateApplication);

/**
 * @route   DELETE /api/applications/:id
 * @desc    Delete application
 * @access  Private
 */
router.delete('/:id', applicationController.deleteApplication);

// ==================== Requirements ====================

/**
 * @route   POST /api/applications/:id/requirements
 * @desc    Add requirement
 * @access  Private
 */
router.post('/:id/requirements', applicationController.addRequirement);

/**
 * @route   PUT /api/applications/:id/requirements/:reqId
 * @desc    Update requirement status
 * @access  Private
 */
router.put('/:id/requirements/:reqId', applicationController.updateRequirement);

/**
 * @route   DELETE /api/applications/:id/requirements/:reqId
 * @desc    Remove requirement
 * @access  Private
 */
router.delete('/:id/requirements/:reqId', applicationController.removeRequirement);

// ==================== Essay ====================

/**
 * @route   PUT /api/applications/:id/essay
 * @desc    Save essay draft
 * @access  Private
 */
router.put('/:id/essay', applicationController.saveEssayDraft);

// ==================== Documents ====================

/**
 * @route   POST /api/applications/:id/documents
 * @desc    Upload document to application
 * @access  Private
 */
router.post(
  '/:id/documents',
  uploadDocument.single('document'),
  applicationController.uploadDocument
);

/**
 * @route   DELETE /api/applications/:id/documents/:docId
 * @desc    Delete document from application
 * @access  Private
 */
router.delete('/:id/documents/:docId', applicationController.deleteDocument);

// ==================== Status Changes ====================

/**
 * @route   POST /api/applications/:id/submit
 * @desc    Submit application
 * @access  Private
 */
router.post('/:id/submit', applicationController.submitApplication);

/**
 * @route   POST /api/applications/:id/won
 * @desc    Mark application as won
 * @access  Private
 */
router.post('/:id/won', applicationController.markAsWon);

/**
 * @route   POST /api/applications/:id/rejected
 * @desc    Mark application as rejected
 * @access  Private
 */
router.post('/:id/rejected', applicationController.markAsRejected);

/**
 * @route   POST /api/applications/:id/withdraw
 * @desc    Withdraw application
 * @access  Private
 */
router.post('/:id/withdraw', applicationController.withdrawApplication);

// ==================== Reminders & Next Steps ====================

/**
 * @route   PUT /api/applications/:id/reminders
 * @desc    Update reminders
 * @access  Private
 */
router.put('/:id/reminders', applicationController.updateReminders);

/**
 * @route   POST /api/applications/:id/next-steps
 * @desc    Add next step
 * @access  Private
 */
router.post('/:id/next-steps', applicationController.addNextStep);

/**
 * @route   PUT /api/applications/:id/next-steps/:index/complete
 * @desc    Complete next step
 * @access  Private
 */
router.put('/:id/next-steps/:index/complete', applicationController.completeNextStep);

// ==================== Misc ====================

/**
 * @route   POST /api/applications/:id/duplicate
 * @desc    Duplicate application for another scholarship
 * @access  Private
 */
router.post('/:id/duplicate', applicationController.duplicateApplication);

module.exports = router;

