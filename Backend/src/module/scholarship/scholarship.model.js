const mongoose = require('mongoose');

// Timeline item schema
const TimelineItemSchema = new mongoose.Schema({
  date: { type: String, required: true },
  label: { type: String, required: true },
}, { _id: false });

// Competition analysis schema
const CompetitionSchema = new mongoose.Schema({
  acceptanceRate: { type: String },
  similarProfile: [{ type: String }],
  percentile: { type: Number },
}, { _id: false });

// Organization info schema
const OrgInfoSchema = new mongoose.Schema({
  type: { type: String },
  founded: { type: String },
  totalAwarded: { type: String },
  contact: { type: String },
  phone: { type: String },
}, { _id: false });

// Main Scholarship Schema
const ScholarshipSchema = new mongoose.Schema({
  // Basic Info
  title: {
    type: String,
    required: [true, 'Scholarship title is required'],
    trim: true,
  },
  org: {
    type: String,
    required: [true, 'Organization name is required'],
    trim: true,
  },
  website: { type: String },
  description: { type: String },

  // Financial Details
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: 0,
  },
  amountDisplay: { type: String },
  renewable: { type: Boolean, default: false },
  renewalDetails: { type: String },

  // Dates
  deadline: {
    type: Date,
    required: [true, 'Deadline is required'],
  },
  applicationOpens: { type: Date },
  awardNotification: { type: Date },
  disbursementDate: { type: Date },

  // Location/Eligibility
  region: { type: String, default: 'National' },
  location: {
    type: String,
    enum: ['National', 'State', 'Local', 'International'],
    default: 'National',
  },

  // Categories & Tags
  tags: [{ type: String }],
  categories: [{
    type: String,
    enum: ['STEM', 'Business', 'Arts', 'Service', 'Sports', 'Leadership', 'Academic', 'Need-Based', 'Merit-Based', 'Other'],
  }],

  // Demographics
  demographics: [{
    type: String,
    enum: ['Women', 'First-Gen', 'Minority', 'LGBTQ+', 'Veterans', 'Disabled', 'International', 'Low-Income', 'Other'],
  }],

  // Eligibility Criteria
  eligibility: [{ type: String }],
  eligibilityLevel: [{
    type: String,
    enum: ['High School', 'College', 'Graduate', 'All'],
  }],
  minGPA: { type: Number },
  citizenshipRequired: [{
    type: String,
    enum: ['U.S. Citizen', 'Permanent Resident', 'International', 'DACA', 'Any'],
  }],
  majorsRequired: [{ type: String }],

  // Requirements
  requirements: [{ type: String }],
  essayRequired: { type: Boolean, default: true },
  essayPrompt: { type: String },
  essayWordCount: {
    min: { type: Number },
    max: { type: Number },
  },
  essayCriteria: [{ type: String }],
  transcriptRequired: { type: Boolean, default: false },
  lorRequired: { type: Number, default: 0 },
  portfolioRequired: { type: Boolean, default: false },

  // Award Details
  awardDetails: [{ type: String }],
  awardsPerYear: { type: Number },
  applicantsPerYear: { type: Number },

  // Timeline
  timeline: [TimelineItemSchema],

  // Competition Analysis
  competition: CompetitionSchema,

  // Organization Info
  orgInfo: OrgInfoSchema,

  // Notes for matching
  notes: {
    whyFit: [{ type: String }],
    improve: [{ type: String }],
  },

  // Status
  featured: { type: Boolean, default: false },
  verified: { type: Boolean, default: false },
  active: { type: Boolean, default: true },

  // Stats
  viewCount: { type: Number, default: 0 },
  saveCount: { type: Number, default: 0 },
  applicationCount: { type: Number, default: 0 },

}, { timestamps: true });

// Indexes for efficient querying
ScholarshipSchema.index({ title: 'text', org: 'text', description: 'text' });
ScholarshipSchema.index({ amount: 1 });
ScholarshipSchema.index({ deadline: 1 });
ScholarshipSchema.index({ categories: 1 });
ScholarshipSchema.index({ demographics: 1 });
ScholarshipSchema.index({ eligibilityLevel: 1 });
ScholarshipSchema.index({ active: 1, deadline: 1 });
ScholarshipSchema.index({ featured: 1 });

// Virtual for days until deadline
ScholarshipSchema.virtual('daysUntilDeadline').get(function () {
  if (!this.deadline) return null;
  const now = new Date();
  const deadline = new Date(this.deadline);
  const diffTime = deadline - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Virtual for deadline status
ScholarshipSchema.virtual('deadlineStatus').get(function () {
  const days = this.daysUntilDeadline;
  if (days === null) return 'unknown';
  if (days < 0) return 'expired';
  if (days <= 7) return 'urgent';
  if (days <= 14) return 'soon';
  if (days <= 30) return 'upcoming';
  return 'later';
});

// Method to calculate match score for a user
ScholarshipSchema.methods.calculateMatchScore = function (userProfile) {
  if (!userProfile) return 50;

  let score = 0;
  let maxScore = 0;

  // GPA Match (20 points)
  maxScore += 20;
  if (this.minGPA && userProfile.gpa) {
    const userGpa = parseFloat(userProfile.gpa);
    if (userGpa >= this.minGPA) {
      score += 20;
    } else if (userGpa >= this.minGPA - 0.3) {
      score += 10;
    }
  } else if (!this.minGPA) {
    score += 20;
  }

  // Major Match (20 points)
  maxScore += 20;
  if (this.majorsRequired && this.majorsRequired.length > 0 && userProfile.major) {
    const userMajor = userProfile.major.toLowerCase();
    const matchesMajor = this.majorsRequired.some(m =>
      userMajor.includes(m.toLowerCase()) || m.toLowerCase().includes(userMajor)
    );
    if (matchesMajor) score += 20;
  } else if (!this.majorsRequired || this.majorsRequired.length === 0) {
    score += 20;
  }

  // Education Level Match (15 points)
  maxScore += 15;
  if (this.eligibilityLevel && this.eligibilityLevel.length > 0 && userProfile.educationLevel) {
    if (this.eligibilityLevel.includes('All') ||
      this.eligibilityLevel.includes(userProfile.educationLevel)) {
      score += 15;
    }
  } else {
    score += 15;
  }

  // Citizenship Match (15 points)
  maxScore += 15;
  if (this.citizenshipRequired && this.citizenshipRequired.length > 0 && userProfile.citizenship) {
    if (this.citizenshipRequired.includes('Any') ||
      this.citizenshipRequired.includes(userProfile.citizenship)) {
      score += 15;
    }
  } else {
    score += 15;
  }

  // Demographics Match (15 points)
  maxScore += 15;
  if (this.demographics && this.demographics.length > 0) {
    let demographicMatch = false;
    if (userProfile.firstGen === 'Yes' && this.demographics.includes('First-Gen')) {
      demographicMatch = true;
    }
    if (userProfile.gender === 'Female' && this.demographics.includes('Women')) {
      demographicMatch = true;
    }
    if (demographicMatch) score += 15;
  } else {
    score += 15;
  }

  // Interests/Categories Match (15 points)
  maxScore += 15;
  if (this.categories && this.categories.length > 0 && userProfile.interests && userProfile.interests.length > 0) {
    const categoryMap = {
      'Computer Science': 'STEM',
      'Data Science': 'STEM',
      'AI/ML': 'STEM',
      'Robotics': 'STEM',
      'Mathematics': 'STEM',
      'Physics': 'STEM',
      'Chemistry': 'STEM',
      'Biology': 'STEM',
      'Business': 'Business',
      'Entrepreneurship': 'Business',
      'Art & Design': 'Arts',
      'Music': 'Arts',
      'Writing': 'Arts',
      'Volunteering': 'Service',
      'Community Service': 'Service',
      'Sports': 'Sports',
      'Debate': 'Leadership',
    };

    const userCategories = userProfile.interests.map(i => categoryMap[i]).filter(Boolean);
    const hasMatch = this.categories.some(c => userCategories.includes(c));
    if (hasMatch) score += 15;
  } else {
    score += 15;
  }

  return maxScore > 0 ? Math.round((score / maxScore) * 100) : 50;
};

// Ensure virtuals are included
ScholarshipSchema.set('toJSON', { virtuals: true });
ScholarshipSchema.set('toObject', { virtuals: true });

const Scholarship = mongoose.model('Scholarship', ScholarshipSchema);

module.exports = Scholarship;

