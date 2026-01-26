const StudentProfile = require('../models/StudentProfile');
const Job = require('../models/Job');
const Application = require('../models/Application');
const EligibilityService = require('../services/eligibilityService');
const MatchingService = require('../services/matchingService');
const PRSService = require('../services/prsService');

class StudentController {
  // Helper function to ensure student profile exists
  static async ensureStudentProfile(userId) {
    let student = await StudentProfile.findOne({ userId });
    
    if (!student) {
      student = new StudentProfile({
        userId,
        personalInfo: {
          firstName: 'Student',
          lastName: 'User',
          rollNumber: 'TEMP001',
          branch: 'CSE',
          batch: 2024,
          phone: '0000000000',
          currentSemester: 1
        },
        academics: {
          cgpa: 0,
          backlogs: 0,
          tenthMarks: 0,
          twelfthMarks: 0
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
  static async getProfile(req, res) {
    try {
      const profile = await StudentProfile.findOne({ userId: req.user.id })
        .populate('userId', 'email');
      
      if (!profile) {
        return res.status(404).json({ 
          success: false,
          message: 'Profile not found' 
        });
      }

      res.json({
        success: true,
        data: profile
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: error.message 
      });
    }
  }

  // Update student profile
  static async updateProfile(req, res) {
    try {
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

      res.json({
        success: true,
        data: profile
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: error.message 
      });
    }
  }

  // Get eligible jobs for student
  static async getEligibleJobs(req, res) {
    try {
      await StudentController.ensureStudentProfile(req.user.id);
      const jobs = await EligibilityService.getEligibleJobs(req.user.id);
      res.json({
        success: true,
        data: jobs
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: error.message 
      });
    }
  }

  // Apply for a job
  static async applyForJob(req, res) {
    try {
      const { jobId } = req.params;
      const { coverLetter } = req.body;

      // Check if already applied
      const existingApplication = await Application.findOne({
        studentId: req.user.id,
        jobId
      });

      if (existingApplication) {
        return res.status(400).json({ 
          success: false,
          message: 'Already applied for this job' 
        });
      }

      // Check eligibility
      const job = await Job.findById(jobId);
      const student = await StudentProfile.findOne({ userId: req.user.id });
      
      if (!EligibilityService.isEligible(student, job)) {
        return res.status(400).json({ 
          success: false,
          message: 'Not eligible for this job' 
        });
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
      res.status(201).json({
        success: true,
        data: application
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: error.message 
      });
    }
  }

  // Get student applications
  static async getApplications(req, res) {
    try {
      const applications = await Application.find({ studentId: req.user.id })
        .populate('jobId')
        .sort({ appliedAt: -1 });

      res.json({
        success: true,
        data: applications
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: error.message 
      });
    }
  }

  // Get student dashboard data
  static async getDashboardData(req, res) {
    try {
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

      res.json({
        success: true,
        data: {
          stats,
          recentApplications,
          profile: student
        }
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: error.message 
      });
    }
  }

  // Get placement readiness score
  static async getPRS(req, res) {
    try {
      const result = await PRSService.calculatePRS(req.user.id);
      const breakdown = await PRSService.getPRSBreakdown(req.user.id);
      
      res.json({ 
        success: true,
        score: result.score, 
        breakdown: result.breakdown || breakdown 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: error.message 
      });
    }
  }
}

module.exports = StudentController;