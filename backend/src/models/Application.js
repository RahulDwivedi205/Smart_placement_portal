const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StudentProfile',
    required: true
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  applicationData: {
    coverLetter: String,
    additionalDocuments: [{
      filename: String,
      path: String,
      type: String
    }],
    answers: [{
      question: String,
      answer: String
    }]
  },
  eligibilityScore: {
    type: Number,
    min: 0,
    max: 100
  },
  skillMatchScore: {
    type: Number,
    min: 0,
    max: 100
  },
  overallScore: {
    type: Number,
    min: 0,
    max: 100
  },
  status: {
    type: String,
    enum: [
      'applied', 
      'under_review', 
      'shortlisted', 
      'interview_scheduled',
      'interview_completed',
      'selected', 
      'rejected', 
      'withdrawn'
    ],
    default: 'applied'
  },
  currentRound: {
    type: Number,
    default: 0
  },
  feedback: [{
    round: Number,
    interviewer: String,
    comments: String,
    rating: { type: Number, min: 1, max: 5 },
    date: { type: Date, default: Date.now }
  }],
  timeline: [{
    status: String,
    date: { type: Date, default: Date.now },
    notes: String
  }],
  appliedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Compound indexes for efficient queries
applicationSchema.index({ studentId: 1, jobId: 1 }, { unique: true });
applicationSchema.index({ jobId: 1, status: 1 });
applicationSchema.index({ companyId: 1, status: 1 });
applicationSchema.index({ overallScore: -1 });
applicationSchema.index({ appliedAt: -1 });

applicationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Add to timeline when status changes
  if (this.isModified('status')) {
    this.timeline.push({
      status: this.status,
      date: new Date(),
      notes: `Status changed to ${this.status}`
    });
  }
  
  next();
});

module.exports = mongoose.model('Application', applicationSchema);