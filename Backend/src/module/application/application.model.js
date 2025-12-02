const mongoose = require('mongoose');

/**
 * Application Schema
 * Links a user to a scholarship with their essay and tracks application state
 */
const ApplicationSchema = new mongoose.Schema({
  // User reference
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },

  // Scholarship reference
  scholarshipId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Scholarship',
    required: true,
    index: true,
  },

  // Essay reference (optional - linked when essay is created)
  essayId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Essay',
    default: null,
  },

  // Application state
  state: {
    type: String,
    enum: ['working', 'submitted'],
    default: 'working',
    index: true,
  },

  // Submission timestamp
  submittedAt: {
    type: Date,
    default: null,
  },

}, { timestamps: true });

// Compound indexes for efficient queries
ApplicationSchema.index({ userId: 1, scholarshipId: 1 }, { unique: true });
ApplicationSchema.index({ userId: 1, state: 1 });

// Pre-save middleware to set submittedAt when state changes to submitted
ApplicationSchema.pre('save', function(next) {
  if (this.isModified('state') && this.state === 'submitted' && !this.submittedAt) {
    this.submittedAt = new Date();
  }
  next();
});

const Application = mongoose.model('Application', ApplicationSchema);

module.exports = Application;
