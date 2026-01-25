const mongoose = require('mongoose');

const interviewRoundSchema = new mongoose.Schema({
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: true
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StudentProfile',
    required: true
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  roundDetails: {
    roundNumber: { type: Number, required: true },
    roundName: { type: String, required: true },
    type: { 
      type: String, 
      enum: ['aptitude', 'technical', 'hr', 'group_discussion', 'coding'],
      required: true 
    },
    description: String,
    duration: Number, // in minutes
    maxMarks: Number
  },
  schedule: {
    date: Date,
    time: String,
    venue: String,
    meetingLink: String,
    instructions: String
  },
  result: {
    status: {
      type: String,
      enum: ['scheduled', 'in_progress', 'completed', 'no_show', 'cancelled'],
      default: 'scheduled'
    },
    score: Number,
    percentage: Number,
    feedback: String,
    interviewer: String,
    interviewerEmail: String,
    notes: String,
    qualified: { type: Boolean, default: false }
  },
  notifications: {
    emailSent: { type: Boolean, default: false },
    reminderSent: { type: Boolean, default: false },
    resultNotified: { type: Boolean, default: false }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for efficient queries
interviewRoundSchema.index({ applicationId: 1, 'roundDetails.roundNumber': 1 });
interviewRoundSchema.index({ jobId: 1, 'schedule.date': 1 });
interviewRoundSchema.index({ studentId: 1, 'result.status': 1 });
interviewRoundSchema.index({ companyId: 1, 'schedule.date': 1 });

interviewRoundSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('InterviewRound', interviewRoundSchema);