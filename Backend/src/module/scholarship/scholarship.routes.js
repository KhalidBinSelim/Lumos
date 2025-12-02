const express = require('express');
const { body, validationResult } = require('express-validator');
const scholarshipController = require('./scholarship.controller');
const { authenticate, optionalAuth } = require('../../middleware/auth');

const router = express.Router();

// Validation middleware
const validateScholarship = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ min: 3, max: 200 })
        .withMessage('Title must be between 3 and 200 characters'),
    body('org')
        .trim()
        .notEmpty()
        .withMessage('Organization name is required')
        .isLength({ min: 2, max: 200 })
        .withMessage('Organization name must be between 2 and 200 characters'),
    body('amount')
        .isNumeric()
        .withMessage('Amount must be a number')
        .isFloat({ min: 0 })
        .withMessage('Amount must be greater than or equal to 0'),
    body('deadline')
        .notEmpty()
        .withMessage('Deadline is required')
        .isISO8601()
        .withMessage('Deadline must be a valid date'),
    body('categories')
        .optional()
        .isArray()
        .withMessage('Categories must be an array'),
    body('demographics')
        .optional()
        .isArray()
        .withMessage('Demographics must be an array'),
    body('eligibilityLevel')
        .optional()
        .isArray()
        .withMessage('Eligibility level must be an array'),
    body('minGPA')
        .optional()
        .isFloat({ min: 0, max: 5 })
        .withMessage('GPA must be between 0 and 5'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: errors.array(),
            });
        }
        next();
    },
];

// ==================== Public Routes (with optional auth for match scores) ====================

/**
 * @route   GET /api/scholarships
 * @desc    Get all scholarships with filters
 * @access  Public (optional auth for match scores)
 */
router.get('/', optionalAuth, scholarshipController.getScholarships);

/**
 * @route   GET /api/scholarships/search
 * @desc    Search scholarships
 * @access  Public (optional auth for match scores)
 */
router.get('/search', optionalAuth, scholarshipController.searchScholarships);

/**
 * @route   GET /api/scholarships/featured
 * @desc    Get featured scholarships
 * @access  Public (optional auth for match scores)
 */
router.get('/featured', optionalAuth, scholarshipController.getFeaturedScholarships);

/**
 * @route   GET /api/scholarships/deadlines
 * @desc    Get upcoming deadlines
 * @access  Public (optional auth for match scores)
 */
router.get('/deadlines', optionalAuth, scholarshipController.getUpcomingDeadlines);

/**
 * @route   GET /api/scholarships/filters
 * @desc    Get filter options
 * @access  Public
 */
router.get('/filters', scholarshipController.getFilterOptions);

// ==================== Protected Routes ====================

/**
 * @route   GET /api/scholarships/recommended
 * @desc    Get recommended scholarships for user
 * @access  Private
 */
router.get('/recommended', authenticate, scholarshipController.getRecommendedScholarships);

/**
 * @route   GET /api/scholarships/saved
 * @desc    Get saved scholarships
 * @access  Private
 */
router.get('/saved', authenticate, scholarshipController.getSavedScholarships);

// ==================== Admin Routes ====================

/**
 * @route   POST /api/scholarships
 * @desc    Create scholarship
 * @access  Private (Admin)
 */
router.post('/', authenticate, validateScholarship, scholarshipController.createScholarship);

// ==================== Parameterized Routes (must come after specific routes) ====================

/**
 * @route   GET /api/scholarships/:id
 * @desc    Get scholarship by ID
 * @access  Public (optional auth for match score)
 */
router.get('/:id', optionalAuth, scholarshipController.getScholarshipById);

/**
 * @route   POST /api/scholarships/:id/save
 * @desc    Save a scholarship
 * @access  Private
 */
router.post('/:id/save', authenticate, scholarshipController.saveScholarship);

/**
 * @route   DELETE /api/scholarships/:id/save
 * @desc    Unsave a scholarship
 * @access  Private
 */
router.delete('/:id/save', authenticate, scholarshipController.unsaveScholarship);

/**
 * @route   PUT /api/scholarships/:id
 * @desc    Update scholarship
 * @access  Private (Admin)
 */
router.put('/:id', authenticate, scholarshipController.updateScholarship);

/**
 * @route   DELETE /api/scholarships/:id
 * @desc    Delete scholarship
 * @access  Private (Admin)
 */
router.delete('/:id', authenticate, scholarshipController.deleteScholarship);

module.exports = router;

