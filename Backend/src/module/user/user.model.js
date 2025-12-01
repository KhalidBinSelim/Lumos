const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Auth
  authId: { type: String, unique: true, sparse: true }, // Google OAuth ID
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: String,
  
  // Basic Info
  firstName: String,
  lastName: String,
  dateOfBirth: Date,
  phone: String,
  profilePhoto: String,
  
  // Location
  country: String,
  state: String,
  city: String,
  zipCode: String,
  
  // Academic
  academic: {
    educationLevel: String,
    schoolName: String,
    schoolId: String,
    grade: String,
    graduationYear: Number,
    major: String,
    minor: String,
    gpa: Number,
    gpaScale: Number,
    satScore: Number,
    actScore: Number,
    classRank: Number,
    totalStudents: Number
  },
  
  // Interests & Activities
  interests: [String],
  activities: [{
    id: String,
    name: String,
    role: String,
    startDate: Date,
    endDate: Date,
    hoursPerWeek: Number,
    totalHours: Number,
    description: String
  }],
  awards: [String],
  workExperience: [{
    id: String,
    company: String,
    position: String,
    startDate: Date,
    endDate: Date,
    description: String
  }],
  
  // Demographics
  demographics: {
    gender: String,
    ethnicity: [String],
    firstGeneration: Boolean,
    citizenship: String,
    familyIncome: String,
    militaryAffiliation: [String],
    disabilities: String
  },
  
  // Documents
  documents: {
    resume: {
      id: String,
      filename: String,
      url: String,
      uploadedAt: Date
    },
    transcript: {
      id: String,
      filename: String,
      url: String,
      uploadedAt: Date
    },
    other: [{
      id: String,
      type: String,
      filename: String,
      url: String,
      uploadedAt: Date
    }]
  },
  
  // Profile Status
  profileComplete: { type: Boolean, default: false },
  onboardingStep: { type: Number, default: 0 },
  
  // Preferences
  preferences: {
    theme: { type: String, default: 'light' },
    emailNotifications: { type: Boolean, default: true },
    smsNotifications: { type: Boolean, default: false },
    defaultWritingStyle: { type: String, default: 'conversational' }
  },
  
  // Vector Embedding (for AI matching)
  profileEmbedding: [Number],
  
  // Metadata
  lastLogin: Date
}, {
  timestamps: true // createdAt, updatedAt
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('passwordHash')) return next();
  if (this.passwordHash) {
    this.passwordHash = await bcrypt.hash(this.passwordHash, 10);
  }
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.passwordHash) return false;
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Method to check profile completion
userSchema.methods.checkProfileCompletion = function() {
  const requiredFields = [
    this.firstName,
    this.lastName,
    this.email,
    this.academic?.educationLevel,
    this.academic?.schoolName,
    this.academic?.major
  ];
  return requiredFields.every(field => field !== undefined && field !== null);
};

module.exports = mongoose.model('User', userSchema);