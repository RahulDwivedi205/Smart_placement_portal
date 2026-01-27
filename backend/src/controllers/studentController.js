const StudentProfile = require('../models/StudentProfile');
const Job = require('../models/Job');
const Application = require('../models/Application');
const EligibilityService = require('../services/eligibilityService');
const MatchingService = require('../services/matchingService');
const PRSService = require('../services/prsService');
const ResponseHandler = require('../utils/responseHandler');
const asyncHandler = require('../utils/asyncHandler');
const { SUCCESS_MESSAGES, ERROR_MESSAGES } = require('../config/constants');

class StudentController {
  // Helper function to ensure student profile exists
  static async ensureStudentProfile(userId) {
    let student = await StudentProfile.findOne({ userId });
    
    if (!student) {
      // Generate unique roll number using timestamp
      const uniqueRollNumber = `TEMP${Date.now().toString().slice(-6)}`;
      
      student = new StudentProfile({
        userId,
        personalInfo: {
          firstName: 'Student',
          lastName: 'User',
          rollNumber: uniqueRollNumber,
          branch: 'CSE',
          batch: 2024,
          phone: '0000000000',
          currentSemester: 1
        },
        academics: {
          cgpa: 8.0,
          backlogs: 0,
          tenthMarks: 85.0,
          twelfthMarks: 88.0
        },
        skills: {
          technical: [],
          programming: [],
          frameworks: [],
          tools: []
        },
        experience: [],
        projects: [],
        achievements: []
      });
      await student.save();
    }
    
    return student;
  }

  // Get student profile
  static getProfile = asyncHandler(async (req, res) => {
    const profile = await StudentProfile.findOne({ userId: req.user.id })
      .populate('userId', 'email');
    
    if (!profile) {
      return ResponseHandler.notFound(res, 'Profile not found');
    }

    return ResponseHandler.success(res, profile, 'Profile retrieved successfully');
  });

  // Update student profile
  static updateProfile = asyncHandler(async (req, res) => {
    // Check if roll number is being updated and if it already exists
    if (req.body.personalInfo?.rollNumber) {
      const existingProfile = await StudentProfile.findOne({
        'personalInfo.rollNumber': req.body.personalInfo.rollNumber,
        userId: { $ne: req.user.id }
      });
      
      if (existingProfile) {
        return ResponseHandler.conflict(res, 'Roll number already exists. Please use a different roll number.');
      }
    }

    const profile = await StudentProfile.findOneAndUpdate(
      { userId: req.user.id },
      req.body,
      { new: true, upsert: true }
    );

    // Recalculate PRS after profile update
    const prsResult = await PRSService.calculatePRS(req.user.id);
    
    // Update the profile with the new PRS score
    await StudentProfile.findOneAndUpdate(
      { userId: req.user.id },
      { placementReadinessScore: prsResult.score }
    );

    return ResponseHandler.updated(res, profile, SUCCESS_MESSAGES.PROFILE_UPDATED);
  });

  // Get eligible jobs for student
  static getEligibleJobs = asyncHandler(async (req, res) => {
    await StudentController.ensureStudentProfile(req.user.id);
    const jobs = await EligibilityService.getEligibleJobs(req.user.id);
    return ResponseHandler.success(res, jobs, 'Eligible jobs retrieved successfully');
  });

  // Apply for a job
  static applyForJob = asyncHandler(async (req, res) => {
    const { jobId } = req.params;
    const { coverLetter } = req.body;

    // Check if already applied
    const existingApplication = await Application.findOne({
      studentId: req.user.id,
      jobId
    });

    if (existingApplication) {
      return ResponseHandler.conflict(res, 'Already applied for this job');
    }

    // Check eligibility
    const job = await Job.findById(jobId);
    const student = await StudentProfile.findOne({ userId: req.user.id });
    
    if (!EligibilityService.isEligible(student, job)) {
      return ResponseHandler.forbidden(res, 'Not eligible for this job');
    }

    // Calculate matching score
    const matchingResult = await MatchingService.calculateMatchingScore(student, job);
    const matchingScore = matchingResult.overallScore;

    const application = new Application({
      studentId: req.user.id,
      jobId,
      companyId: job.companyId,
      applicationData: {
        coverLetter
      },
      overallScore: matchingScore,
      status: 'applied',
      appliedAt: new Date()
    });

    await application.save();
    return ResponseHandler.created(res, application, 'Application submitted successfully');
  });

  // Get student applications
  static getApplications = asyncHandler(async (req, res) => {
    const applications = await Application.find({ studentId: req.user.id })
      .populate('jobId')
      .sort({ appliedAt: -1 });

    return ResponseHandler.success(res, applications, 'Applications retrieved successfully');
  });

  // Get student dashboard data
  static getDashboardData = asyncHandler(async (req, res) => {
    const student = await StudentController.ensureStudentProfile(req.user.id);
    const applications = await Application.find({ studentId: req.user.id });
    const eligibleJobs = await EligibilityService.getEligibleJobs(req.user.id);

    const stats = {
      totalApplications: applications.length,
      pendingApplications: applications.filter(app => app.status === 'applied').length,
      interviewsScheduled: applications.filter(app => app.status === 'interview_scheduled').length,
      offersReceived: applications.filter(app => app.status === 'offer_received').length,
      eligibleJobs: eligibleJobs.length,
      placementReadinessScore: student?.placementReadinessScore || 0
    };

    const recentApplications = applications
      .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt))
      .slice(0, 5);

    const dashboardData = {
      stats,
      recentApplications,
      profile: student
    };

    return ResponseHandler.success(res, dashboardData, 'Dashboard data retrieved successfully');
  });

  // Get placement readiness score
  static getPRS = asyncHandler(async (req, res) => {
    const result = await PRSService.calculatePRS(req.user.id);
    const breakdown = await PRSService.getPRSBreakdown(req.user.id);
    
    const prsData = { 
      score: result.score, 
      breakdown: result.breakdown || breakdown 
    };

    return ResponseHandler.success(res, prsData, 'PRS calculated successfully');
  });
}

module.exports = StudentController;