const express = require('express');
const { body } = require('express-validator');
const userController = require('./user.controller');
const { authenticate } = require('../../middleware/auth');
const { uploadResume, uploadTranscript, uploadDocument } = require('../../config/cloudinary');

const router = express.Router();

// Validation rules
const registerValidation = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
  body('fullName')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Full name must be at least 2 characters'),
];

const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

// ==================== Public Routes ====================

/**
 * @route   POST /api/users/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', registerValidation, userController.register);

/**
 * @route   POST /api/users/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', loginValidation, userController.login);

// ==================== Protected Routes ====================

/**
 * @route   GET /api/users/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/profile', authenticate, userController.getProfile);

/**
 * @route   PUT /api/users/profile
 * @desc    Update full profile
 * @access  Private
 */
router.put('/profile', authenticate, userController.updateProfile);

/**
 * @route   PUT /api/users/profile/basic
 * @desc    Update basic info (Step 1)
 * @access  Private
 */
router.put('/profile/basic', authenticate, userController.updateBasicInfo);

/**
 * @route   PUT /api/users/profile/academic
 * @desc    Update academic info (Step 2)
 * @access  Private
 */
router.put('/profile/academic', authenticate, userController.updateAcademicInfo);

/**
 * @route   PUT /api/users/profile/activities
 * @desc    Update activities & interests (Step 3)
 * @access  Private
 */
router.put('/profile/activities', authenticate, userController.updateActivities);

/**
 * @route   PUT /api/users/profile/background
 * @desc    Update background info (Step 4)
 * @access  Private
 */
router.put('/profile/background', authenticate, userController.updateBackgroundInfo);

// ==================== Document Upload Routes ====================

/**
 * @route   POST /api/users/upload/resume
 * @desc    Upload resume
 * @access  Private
 */
router.post(
  '/upload/resume',
  authenticate,
  uploadResume.single('resume'),
  userController.uploadResume
);

/**
 * @route   POST /api/users/upload/transcript
 * @desc    Upload transcript
 * @access  Private
 */
router.post(
  '/upload/transcript',
  authenticate,
  uploadTranscript.single('transcript'),
  userController.uploadTranscript
);

/**
 * @route   POST /api/users/upload/document
 * @desc    Upload other document
 * @access  Private
 */
router.post(
  '/upload/document',
  authenticate,
  uploadDocument.single('document'),
  userController.uploadDocument
);

/**
 * @route   DELETE /api/users/documents/:documentId
 * @desc    Delete a document
 * @access  Private
 */
router.delete('/documents/:documentId', authenticate, userController.deleteDocument);

// ==================== Onboarding Routes ====================

/**
 * @route   POST /api/users/onboarding/complete
 * @desc    Mark onboarding as complete
 * @access  Private
 */
router.post('/onboarding/complete', authenticate, userController.completeOnboarding);

// ==================== Saved Scholarships Routes ====================

/**
 * @route   GET /api/users/scholarships/saved
 * @desc    Get saved scholarships
 * @access  Private
 */
router.get('/scholarships/saved', authenticate, userController.getSavedScholarships);

/**
 * @route   POST /api/users/scholarships/:scholarshipId/save
 * @desc    Save a scholarship
 * @access  Private
 */
router.post('/scholarships/:scholarshipId/save', authenticate, userController.saveScholarship);

/**
 * @route   DELETE /api/users/scholarships/:scholarshipId/save
 * @desc    Unsave a scholarship
 * @access  Private
 */
router.delete('/scholarships/:scholarshipId/save', authenticate, userController.unsaveScholarship);

module.exports = router;

