const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  jobDetails: {
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { 
      type: String, 
      enum: ['fulltime', 'internship', 'parttime'],
      required: true 
    },
    location: { type: String, required: true },
    workMode: {
      type: String,
      enum: ['onsite', 'remote', 'hybrid'],
      default: 'onsite'
    },
    duration: String // For internships
  },
  package: {
    ctc: { type: Number, required: true },
    baseSalary: Number,
    stipend: Number, // For internships
    currency: { type: String, default: 'INR' }
  },
  eligibility: {
    branches: [String],
    minimumCGPA: { type: Number, required: true },
    allowBacklogs: { type: Boolean, default: false },
    maxBacklogs: { type: Number, default: 0 },
    batch: [Number],
    requiredSkills: [String]
  },
  requirements: {
    experience: String,
    education: String,
    additionalRequirements: [String]
  },
  applicationDeadline: {
    type: Date,
    required: true
  },
  interviewProcess: [{
    round: { type: String, required: true },
    type: { 
      type: String, 
      enum: ['aptitude', 'technical', 'hr', 'group_discussion', 'coding'],
      required: true 
    },
    description: String,
    duration: Number // in minutes
  }],
  status: {
    type: String,
    enum: ['draft', 'active', 'closed', 'cancelled'],
    default: 'draft'
  },
  stats: {
    totalApplications: { type: Number, default: 0 },
    shortlisted: { type: Number, default: 0 },
    selected: { type: Number, default: 0 },
    rejected: { type: Number, default: 0 }
  },
  postedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for better query performance
jobSchema.index({ companyId: 1, status: 1 });
jobSchema.index({ 'eligibility.branches': 1, status: 1 });
jobSchema.index({ 'eligibility.minimumCGPA': 1 });
jobSchema.index({ applicationDeadline: 1 });
jobSchema.index({ postedAt: -1 });

jobSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Job', jobSchema);