const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  companyInfo: {
    name: { type: String, required: true },
    industry: { type: String, required: true },
    size: { 
      type: String, 
      enum: ['startup', 'small', 'medium', 'large', 'enterprise'],
      required: true 
    },
    website: String,
    description: String,
    headquarters: String,
    founded: Number
  },
  hrDetails: {
    name: { type: String, required: true },
    designation: String,
    phone: { type: String, required: true },
    alternateEmail: String
  },
  companyStats: {
    totalHires: { type: Number, default: 0 },
    averagePackage: Number,
    successRate: { type: Number, default: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 }
  },
  preferences: {
    preferredBranches: [String],
    minimumCGPA: { type: Number, default: 6.0 },
    allowBacklogs: { type: Boolean, default: false },
    maxBacklogs: { type: Number, default: 0 }
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verifiedAt: Date,
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
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

companySchema.index({ 'companyInfo.name': 1 });
companySchema.index({ 'companyInfo.industry': 1 });
companySchema.index({ isVerified: 1 });

companySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Company', companySchema);