const mongoose = require('mongoose');

const studentProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  personalInfo: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    rollNumber: { type: String, required: true, unique: true },
    branch: { 
      type: String, 
      required: true,
      enum: ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL', 'OTHER']
    },
    batch: { type: Number, required: true },
    currentSemester: { type: Number, required: true }
  },
  academics: {
    cgpa: { type: Number, required: true, min: 0, max: 10 },
    tenthMarks: { type: Number, required: true },
    twelfthMarks: { type: Number, required: true },
    backlogs: { type: Number, default: 0 },
    achievements: [String]
  },
  skills: {
    technical: [String],
    programming: [String],
    frameworks: [String],
    databases: [String],
    tools: [String]
  },
  projects: [{
    title: String,
    description: String,
    technologies: [String],
    githubLink: String,
    liveLink: String,
    duration: String
  }],
  experience: [{
    company: String,
    role: String,
    duration: String,
    description: String,
    type: { type: String, enum: ['internship', 'fulltime', 'parttime'] }
  }],
  resume: {
    filename: String,
    path: String,
    uploadedAt: Date
  },
  placementReadinessScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  isPlaced: {
    type: Boolean,
    default: false
  },
  placedCompany: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  },
  package: Number,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

studentProfileSchema.index({ 'personalInfo.rollNumber': 1 });
studentProfileSchema.index({ 'personalInfo.branch': 1, 'personalInfo.batch': 1 });
studentProfileSchema.index({ 'academics.cgpa': -1 });
studentProfileSchema.index({ placementReadinessScore: -1 });

studentProfileSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('StudentProfile', studentProfileSchema);