const mongoose = require('mongoose');

/**
 * Essay Schema
 * Stores essay writing content linked to an application
 */
const EssaySchema = new mongoose.Schema({
  // Application reference
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: true,
    index: true,
  },

  // Essay text content
  text: {
    type: String,
    default: '',
  },

  // Last edited timestamp
  lastEditedAt: {
    type: Date,
    default: Date.now,
  },

}, { timestamps: true });

// Index for efficient queries
EssaySchema.index({ applicationId: 1 });

// Pre-save middleware to update lastEditedAt when text is modified
EssaySchema.pre('save', function(next) {
  if (this.isModified('text')) {
    this.lastEditedAt = new Date();
  }
  next();
});

// Virtual for word count
EssaySchema.virtual('wordCount').get(function() {
  if (!this.text) return 0;
  return this.text.trim().split(/\s+/).filter(Boolean).length;
});

// Ensure virtuals are included in JSON
EssaySchema.set('toJSON', { virtuals: true });
EssaySchema.set('toObject', { virtuals: true });

const Essay = mongoose.model('Essay', EssaySchema);

module.exports = Essay;

