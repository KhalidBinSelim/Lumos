const mongoose = require('mongoose');

// Requirement item schema
const RequirementSchema = new mongoose.Schema({
  label: { type: String, required: true },
  status: {
    type: String,
    enum: ['completed', 'pending', 'missing', 'draft'],
    default: 'missing',
  },
  details: { type: String },
  dueDate: { type: Date },
  completedAt: { type: Date },
}, { _id: true });

// Essay draft schema
const EssayDraftSchema = new mongoose.Schema({
  content: { type: String },
  wordCount: { type: Number, default: 0 },
  version: { type: Number, default: 1 },
  lastUpdated: { type: Date, default: Date.now },
}, { _id: true });

// Uploaded document schema
const ApplicationDocumentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String }, // resume, transcript, essay, lor, other
  url: { type: String, required: true },
  publicId: { type: String },
  uploadedAt: { type: Date, default: Date.now },
}, { _id: true });

// Main Application Schema
const ApplicationSchema = new mongoose.Schema({
  // References
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  scholarship: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Scholarship',
    required: true,
    index: true,
  },

  // Status
  status: {
    type: String,
    enum: ['In Progress', 'Submitted', 'Won', 'Rejected', 'Withdrawn'],
    default: 'In Progress',
    index: true,
  },

  // Progress tracking
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },

  // Requirements checklist
  requirements: [RequirementSchema],

  // Essay
  essay: {
    prompt: { type: String },
    drafts: [EssayDraftSchema],
    currentDraft: { type: Number, default: 0 },
    wordLimit: {
      min: { type: Number },
      max: { type: Number },
    },
  },

  // Uploaded documents for this application
  documents: [ApplicationDocumentSchema],

  // Submission details
  submittedAt: { type: Date },
  confirmationNumber: { type: String },

  // Decision details
  decisionDate: { type: Date },
  decisionExpectedBy: { type: Date },

  // Won details
  awardDetails: {
    amount: { type: String },
    disbursement: { type: String },
    expectedDate: { type: String },
  },
  wonAt: { type: Date },

  // Rejection details
  rejectedAt: { type: Date },
  feedback: { type: String },

  // Next steps (for submitted/won)
  nextSteps: [{
    step: { type: String },
    completed: { type: Boolean, default: false },
    dueDate: { type: Date },
  }],

  // Notes
  notes: { type: String },

  // Reminders
  reminders: {
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: false },
    push: { type: Boolean, default: false },
    schedules: [{
      type: String,
      enum: ['twoWeeks', 'oneWeek', 'threeDays', 'oneDay'],
    }],
  },

  // Timeline tracking
  timeline: [{
    action: { type: String },
    timestamp: { type: Date, default: Date.now },
    details: { type: String },
  }],

  // Last activity
  lastActivityAt: { type: Date, default: Date.now },

}, { timestamps: true });

// Compound indexes
ApplicationSchema.index({ user: 1, status: 1 });
ApplicationSchema.index({ user: 1, scholarship: 1 }, { unique: true });
ApplicationSchema.index({ status: 1, 'scholarship': 1 });

// Pre-save middleware to update progress
ApplicationSchema.pre('save', function(next) {
  if (this.isModified('requirements')) {
    this.calculateProgress();
  }
  this.lastActivityAt = new Date();
  next();
});

// Method to calculate progress
ApplicationSchema.methods.calculateProgress = function() {
  if (!this.requirements || this.requirements.length === 0) {
    this.progress = 0;
    return;
  }

  const total = this.requirements.length;
  const completed = this.requirements.filter(
    r => r.status === 'completed'
  ).length;
  const draft = this.requirements.filter(
    r => r.status === 'draft'
  ).length;

  // Completed items count as 100%, draft as 50%
  this.progress = Math.round(((completed + draft * 0.5) / total) * 100);
};

// Method to add timeline event
ApplicationSchema.methods.addTimelineEvent = function(action, details = '') {
  this.timeline.push({
    action,
    timestamp: new Date(),
    details,
  });
};

// Method to submit application
ApplicationSchema.methods.submit = function(confirmationNumber) {
  this.status = 'Submitted';
  this.submittedAt = new Date();
  this.confirmationNumber = confirmationNumber || `APP-${Date.now()}`;
  this.progress = 100;
  this.addTimelineEvent('Submitted', `Confirmation: ${this.confirmationNumber}`);
};

// Method to mark as won
ApplicationSchema.methods.markAsWon = function(awardDetails) {
  this.status = 'Won';
  this.wonAt = new Date();
  this.decisionDate = new Date();
  if (awardDetails) {
    this.awardDetails = awardDetails;
  }
  this.addTimelineEvent('Won', 'Application successful!');
};

// Method to mark as rejected
ApplicationSchema.methods.markAsRejected = function(feedback = '') {
  this.status = 'Rejected';
  this.rejectedAt = new Date();
  this.decisionDate = new Date();
  this.feedback = feedback;
  this.addTimelineEvent('Rejected', feedback);
};

// Method to withdraw
ApplicationSchema.methods.withdraw = function() {
  this.status = 'Withdrawn';
  this.addTimelineEvent('Withdrawn', 'Application withdrawn by user');
};

// Virtual for deadline info (from populated scholarship)
ApplicationSchema.virtual('deadline').get(function() {
  if (this.populated('scholarship') && this.scholarship?.deadline) {
    return this.scholarship.deadline;
  }
  return null;
});

// Virtual for days until deadline
ApplicationSchema.virtual('daysUntilDeadline').get(function() {
  const deadline = this.deadline;
  if (!deadline) return null;
  
  const now = new Date();
  const diffTime = new Date(deadline) - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for urgency
ApplicationSchema.virtual('isUrgent').get(function() {
  const days = this.daysUntilDeadline;
  return days !== null && days <= 7 && this.status === 'In Progress';
});

// Ensure virtuals are included
ApplicationSchema.set('toJSON', { virtuals: true });
ApplicationSchema.set('toObject', { virtuals: true });

const Application = mongoose.model('Application', ApplicationSchema);

module.exports = Application;

