const mongoose = require('mongoose');

const scholarshipSchema = new mongoose.Schema({
    scholarshipId: {
        type: String,
        unique: true,
        required: true,
        index: true
    },

    // --- Basic Info ---
    name: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },

    // --- Organization ---
    organization: {
        name: { type: String, required: true },
        type: String,
        website: String,
        email: String,
        phone: String,
        logo: String, // URL
        founded: Number,
        verified: { type: Boolean, default: false },
        totalAwarded: String // Text string e.g., "$5M+"
    },

    // --- Award Details ---
    amount: { type: Number, min: 0 },
    currency: { type: String, default: 'USD' },
    amountType: {
        type: String,
        enum: ['fixed', 'range', 'variable'],
        default: 'fixed'
    },
    amountMin: Number,
    amountMax: Number,
    numberOfAwards: Number,
    renewable: { type: Boolean, default: false },
    renewableYears: Number,
    renewableConditions: String,

    // --- Deadlines ---
    applicationOpenDate: Date,
    applicationDeadline: {
        type: Date,
        index: true // Important for sorting/filtering
    },
    timezone: { type: String, default: 'UTC' },
    decisionDate: Date,
    disbursementDate: Date,

    // --- Competition Stats ---
    applicantsLastYear: Number,
    awardsGivenLastYear: Number,
    acceptanceRate: Number, // 0.0 to 1.0
    competitionLevel: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Very High']
    },

    // --- Eligibility ---
    eligibility: {
        educationLevel: [{
            type: String,
            enum: ['high_school', 'college', 'graduate', 'trade_school', 'other']
        }],
        grades: [String], // e.g., ['Freshman', 'Senior']
        majors: [String],
        minGPA: Number,
        citizenship: [String],
        location: {
            type: {
                type: String,
                enum: ['national', 'state', 'regional', 'city', 'international']
            },
            restrictions: [String] // e.g., list of allowed states
        },
        demographics: {
            gender: [String],
            ethnicity: [String],
            firstGeneration: { type: Boolean, default: false },
            militaryAffiliation: { type: Boolean, default: false },
            disabilities: { type: Boolean, default: false }
        },
        required: [String], // Specific hard requirements
        preferred: [String]
    },

    // --- Requirements ---
    requirements: {
        applicationForm: {
            required: { type: Boolean, default: true },
            url: String,
            estimatedTime: String
        },
        essays: [{
            count: Number,
            wordCountMin: Number,
            wordCountMax: Number,
            prompt: String,
            evaluationCriteria: mongoose.Schema.Types.Mixed // Flexible object
        }],
        transcript: {
            required: { type: Boolean, default: false },
            official: { type: Boolean, default: false }
        },
        recommendationLetters: {
            required: { type: Boolean, default: false },
            count: { type: Number, default: 0 },
            from: String // e.g., "Teacher or Employer"
        },
        resume: {
            required: { type: Boolean, default: false },
            maxPages: Number
        },
        testScores: {
            required: { type: Boolean, default: false },
            types: [String] // ['SAT', 'ACT']
        },
        optional: [String]
    },

    // --- Submission ---
    submissionMethod: {
        type: String,
        enum: ['online', 'mail', 'email']
    },
    submissionUrl: String,

    // --- Timeline (Display Strings) ---
    timeline: {
        applicationOpen: String,
        applicationDeadline: String,
        reviewPeriod: String,
        finalistsNotified: String,
        interviews: String,
        winnersAnnounced: String,
        disbursement: String
    },

    // --- Past Winners Data ---
    pastWinners: [{
        year: Number,
        stats: mongoose.Schema.Types.Mixed
    }],

    // --- Tags & Categories ---
    tags: { type: [String], index: true },
    categories: { type: [String], index: true },

    // --- Vector Embedding ---
    scholarshipEmbedding: {
        type: [Number],
        select: false // Performance: Exclude from normal queries
    },

    // --- Status & Metadata ---
    status: {
        type: String,
        enum: ['active', 'closed', 'draft', 'archived'],
        default: 'draft',
        index: true
    },
    verified: { type: Boolean, default: false },
    verifiedBy: String,
    verifiedAt: Date,
    sourceUrl: String,
    lastScraped: Date,
    views: { type: Number, default: 0 },
    applicationsCount: { type: Number, default: 0 }

}, {
    timestamps: true // Creates 'createdAt' and 'updatedAt'
});

module.exports = scholarshipSchema;