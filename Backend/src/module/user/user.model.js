const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Sub-schemas for nested objects
const ActivitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String },
  years: { type: String },
  hoursPerWeek: { type: String },
  description: { type: String },
}, { _id: true });

const AwardSchema = new mongoose.Schema({
  title: { type: String, required: true },
}, { _id: true });

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  organization: { type: String },
  duration: { type: String },
  description: { type: String },
}, { _id: true });

const DocumentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  publicId: { type: String }, // Cloudinary public ID for deletion
  type: { type: String, enum: ['resume', 'transcript', 'other'], default: 'other' },
  uploadedAt: { type: Date, default: Date.now },
}, { _id: true });

// Main User Schema
const UserSchema = new mongoose.Schema({
  // Authentication
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false, // Don't return password by default
  },
  
  // Step 1: Basic Information
  firstName: { type: String, trim: true },
  lastName: { type: String, trim: true },
  dateOfBirth: {
    month: { type: String },
    day: { type: String },
    year: { type: String },
  },
  country: { type: String },
  state: { type: String },
  city: { type: String },
  phone: { type: String },

  // Step 2: Academic Information
  educationLevel: {
    type: String,
    enum: ['High School', 'College Student', 'Graduate Student', 'Other', ''],
    default: '',
  },
  schoolName: { type: String },
  gradeYear: { type: String },
  graduationYear: { type: String },
  gpa: { type: String },
  gpaScale: {
    type: String,
    enum: ['4.0', '5.0', '100', 'Other'],
    default: '4.0',
  },
  major: { type: String },
  minor: { type: String },
  sat: { type: String },
  ielts: { type: String },
  classRank: { type: String },
  classSize: { type: String },

  // Step 3: Activities & Interests
  interests: [{ type: String }],
  activities: [ActivitySchema],
  awards: [AwardSchema],
  jobs: [JobSchema],

  // Step 4: Background Information
  gender: { type: String },
  ethnicities: [{ type: String }],
  ethnicityOther: { type: String },
  firstGen: {
    type: String,
    enum: ['Yes', 'No', 'Prefer not to say', ''],
    default: '',
  },
  citizenship: {
    type: String,
    enum: ['U.S. Citizen', 'Permanent Resident', 'International Student', 'DACA Recipient', 'Other', ''],
    default: '',
  },
  citizenshipOther: { type: String },
  incomeRange: { type: String },
  military: {
    veteran: { type: Boolean, default: false },
    active: { type: Boolean, default: false },
    parentVeteran: { type: Boolean, default: false },
    parentActive: { type: Boolean, default: false },
    none: { type: Boolean, default: true },
  },
  disability: {
    type: String,
    enum: ['Yes', 'No', 'Prefer not to say', ''],
    default: '',
  },
  disabilityDetails: { type: String },

  // Step 5: Documents
  documents: [DocumentSchema],
  resume: {
    url: { type: String },
    publicId: { type: String },
    uploadedAt: { type: Date },
  },
  transcript: {
    url: { type: String },
    publicId: { type: String },
    uploadedAt: { type: Date },
  },

  // Saved Scholarships
  savedScholarships: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Scholarship',
  }],

  // Profile completion tracking
  onboardingCompleted: { type: Boolean, default: false },
  profileCompleteness: { type: Number, default: 0 }, // Percentage 0-100

  // Avatar
  avatar: { type: String },

  // Timestamps
  lastLogin: { type: Date },
  
}, { timestamps: true });

// Index for faster queries (email already indexed by unique: true)
UserSchema.index({ 'savedScholarships': 1 });

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to calculate profile completeness
UserSchema.methods.calculateProfileCompleteness = function() {
  let score = 0;
  const weights = {
    basicInfo: 20,      // firstName, lastName, DOB, location
    academics: 25,      // education, school, GPA, major
    activities: 20,     // interests, activities
    background: 15,     // demographics
    documents: 20,      // resume, transcript
  };

  // Basic Info (20%)
  if (this.firstName && this.lastName) score += 5;
  if (this.dateOfBirth?.year) score += 5;
  if (this.country && this.state && this.city) score += 10;

  // Academics (25%)
  if (this.educationLevel) score += 5;
  if (this.schoolName) score += 5;
  if (this.gpa) score += 5;
  if (this.major) score += 5;
  if (this.graduationYear) score += 5;

  // Activities (20%)
  if (this.interests?.length >= 3) score += 10;
  if (this.activities?.length >= 1) score += 10;

  // Background (15%)
  if (this.gender) score += 5;
  if (this.citizenship) score += 5;
  if (this.firstGen) score += 5;

  // Documents (20%)
  if (this.resume?.url) score += 15;
  if (this.transcript?.url) score += 5;

  this.profileCompleteness = Math.min(score, 100);
  return this.profileCompleteness;
};

// Virtual for full name
UserSchema.virtual('fullName').get(function() {
  if (this.firstName && this.lastName) {
    return `${this.firstName} ${this.lastName}`;
  }
  return this.firstName || this.lastName || '';
});

// Ensure virtuals are included in JSON
UserSchema.set('toJSON', { virtuals: true });
UserSchema.set('toObject', { virtuals: true });

const User = mongoose.model('User', UserSchema);

module.exports = User;

