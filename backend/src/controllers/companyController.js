const Company = require('../models/Company');
const Job = require('../models/Job');
const Application = require('../models/Application');
const InterviewRound = require('../models/InterviewRound');
const EligibilityService = require('../services/eligibilityService');
const MatchingService = require('../services/matchingService');

class CompanyController {
  // Helper function to ensure company profile exists
  static async ensureCompanyProfile(userId) {
    let company = await Company.findOne({ userId });
    
    if (!company) {
      company = new Company({
        userId,
        companyInfo: {
          name: 'Your Company Name',
          industry: 'Technology',
          size: 'medium'
        },
        hrDetails: {
          name: 'HR Manager',
          phone: '0000000000'
        }
      });
      await company.save();
    }
    
    return company;
  }

  // Get company profile
  static async getProfile(req, res) {
    try {
      let company = await Company.findOne({ userId: req.user.id })
        .populate('userId', 'email');
      
      // If no company profile exists, create a basic one
      if (!company) {
        company = await CompanyController.ensureCompanyProfile(req.user.id);
        company = await Company.findById(company._id).populate('userId', 'email');
      }

      res.json(company);
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: error.message 
      });
    }
  }

  // Update company profile
  static async updateProfile(req, res) {
    try {
      const company = await Company.findOneAndUpdate(
        { userId: req.user.id },
        req.body,
        { new: true, upsert: true }
      );

      res.json(company);
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: error.message 
      });
    }
  }

  // Create a new job posting
  static async createJob(req, res) {
    try {
      const company = await CompanyController.ensureCompanyProfile(req.user.id);

      const job = new Job({
        ...req.body,
        companyId: company._id,
        postedBy: req.user.id,
        status: req.body.status || 'active'
      });

      await job.save();
      res.status(201).json({
        success: true,
        data: job
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: error.message 
      });
    }
  }

  // Get company jobs
  static async getJobs(req, res) {
    try {
      const company = await CompanyController.ensureCompanyProfile(req.user.id);
      
      const jobs = await Job.find({ companyId: company._id })
        .sort({ createdAt: -1 });

      res.json(jobs);
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: error.message 
      });
    }
  }

  // Get single job
  static async getJob(req, res) {
    try {
      const { jobId } = req.params;
      const company = await CompanyController.ensureCompanyProfile(req.user.id);
      
      const job = await Job.findOne({ _id: jobId, companyId: company._id });
      if (!job) {
        return res.status(404).json({ 
          success: false,
          message: 'Job not found' 
        });
      }

      res.json(job);
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: error.message 
      });
    }
  }

  // Update job
  static async updateJob(req, res) {
    try {
      const { jobId } = req.params;
      const company = await CompanyController.ensureCompanyProfile(req.user.id);
      
      const job = await Job.findOneAndUpdate(
        { _id: jobId, companyId: company._id },
        req.body,
        { new: true }
      );

      if (!job) {
        return res.status(404).json({ 
          success: false,
          message: 'Job not found' 
        });
      }

      res.json({
        success: true,
        data: job
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: error.message 
      });
    }
  }

  // Delete job
  static async deleteJob(req, res) {
    try {
      const { jobId } = req.params;
      const company = await CompanyController.ensureCompanyProfile(req.user.id);
      
      const job = await Job.findOneAndDelete({ _id: jobId, companyId: company._id });
      if (!job) {
        return res.status(404).json({ 
          success: false,
          message: 'Job not found' 
        });
      }

      res.json({
        success: true,
        message: 'Job deleted successfully'
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: error.message 
      });
    }
  }

  // Get applications for a job
  static async getJobApplications(req, res) {
    try {
      const { jobId } = req.params;
      const company = await Company.findOne({ userId: req.user.id });
      
      // Verify job belongs to company
      const job = await Job.findOne({ _id: jobId, companyId: company._id });
      if (!job) {
        return res.status(404).json({ 
          success: false,
          message: 'Job not found' 
        });
      }

      const applications = await Application.find({ jobId })
        .populate({
          path: 'studentId',
          populate: {
            path: 'userId',
            select: 'email'
          }
        })
        .sort({ appliedAt: -1 });

      res.json(applications);
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: error.message 
      });
    }
  }

  // Get eligible students for a job
  static async getEligibleStudents(req, res) {
    try {
      const { jobId } = req.params;
      const company = await Company.findOne({ userId: req.user.id });
      
      // Verify job belongs to company
      const job = await Job.findOne({ _id: jobId, companyId: company._id });
      if (!job) {
        return res.status(404).json({ message: 'Job not found' });
      }

      const eligibleStudents = await EligibilityService.getEligibleStudents(jobId);
      res.json(eligibleStudents);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Update application status
  static async updateApplicationStatus(req, res) {
    try {
      const { applicationId } = req.params;
      const { status, feedback } = req.body;

      const application = await Application.findById(applicationId)
        .populate('jobId');

      if (!application) {
        return res.status(404).json({ message: 'Application not found' });
      }

      // Verify job belongs to company
      const company = await Company.findOne({ userId: req.user.id });
      if (application.jobId.companyId.toString() !== company._id.toString()) {
        return res.status(403).json({ message: 'Unauthorized' });
      }

      application.status = status;
      
      // Handle feedback properly - add to feedback array if provided
      if (feedback) {
        application.feedback.push({
          round: application.currentRound || 1,
          interviewer: 'HR',
          comments: feedback,
          date: new Date()
        });
      }
      
      await application.save();

      res.json(application);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Schedule interview
  static async scheduleInterview(req, res) {
    try {
      const { applicationId } = req.params;
      const { round, scheduledAt, interviewType, meetingLink, instructions } = req.body;

      const application = await Application.findById(applicationId)
        .populate('jobId');

      if (!application) {
        return res.status(404).json({ message: 'Application not found' });
      }

      // Verify job belongs to company
      const company = await Company.findOne({ userId: req.user.id });
      if (application.jobId.companyId.toString() !== company._id.toString()) {
        return res.status(403).json({ message: 'Unauthorized' });
      }

      const interviewRound = new InterviewRound({
        applicationId,
        round,
        scheduledAt: new Date(scheduledAt),
        interviewType,
        meetingLink,
        instructions,
        status: 'scheduled'
      });

      await interviewRound.save();

      // Update application status
      application.status = 'interview_scheduled';
      application.interviewRounds.push(interviewRound._id);
      await application.save();

      res.status(201).json(interviewRound);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Delete application (company can remove applications)
  static async deleteApplication(req, res) {
    try {
      const { applicationId } = req.params;

      const application = await Application.findById(applicationId)
        .populate('jobId');

      if (!application) {
        return res.status(404).json({ 
          success: false,
          message: 'Application not found' 
        });
      }

      // Verify job belongs to company
      const company = await Company.findOne({ userId: req.user.id });
      if (application.jobId.companyId.toString() !== company._id.toString()) {
        return res.status(403).json({ 
          success: false,
          message: 'Unauthorized' 
        });
      }

      await Application.findByIdAndDelete(applicationId);

      res.json({
        success: true,
        message: 'Application deleted successfully'
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: error.message 
      });
    }
  }

  // Get company dashboard data
  static async getDashboardData(req, res) {
    try {
      const company = await CompanyController.ensureCompanyProfile(req.user.id);
      
      const jobs = await Job.find({ companyId: company._id });
      const jobIds = jobs.map(job => job._id);
      const applications = await Application.find({ jobId: { $in: jobIds } });

      const stats = {
        totalJobs: jobs.length,
        activeJobs: jobs.filter(job => job.status === 'active').length,
        totalApplications: applications.length,
        pendingApplications: applications.filter(app => app.status === 'applied').length,
        interviewsScheduled: applications.filter(app => app.status === 'interview_scheduled').length,
        offersExtended: applications.filter(app => app.status === 'offer_extended').length
      };

      const recentApplications = applications
        .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt))
        .slice(0, 10);

      const jobStats = jobs.map(job => ({
        jobTitle: job.jobDetails?.title,
        applications: applications.filter(app => app.jobId.toString() === job._id.toString()).length,
        status: job.status
      }));

      res.json({
        success: true,
        data: {
          stats,
          recentApplications,
          jobStats,
          company
        }
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: error.message 
      });
    }
  }
}

module.exports = CompanyController;