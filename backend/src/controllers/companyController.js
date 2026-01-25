const Company = require('../models/Company');
const Job = require('../models/Job');
const Application = require('../models/Application');
const InterviewRound = require('../models/InterviewRound');
const EligibilityService = require('../services/eligibilityService');
const MatchingService = require('../services/matchingService');

class CompanyController {
  // Get company profile
  static async getProfile(req, res) {
    try {
      const company = await Company.findOne({ userId: req.user.id })
        .populate('userId', 'email');
      
      if (!company) {
        return res.status(404).json({ message: 'Company profile not found' });
      }

      res.json(company);
    } catch (error) {
      res.status(500).json({ message: error.message });
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
      res.status(500).json({ message: error.message });
    }
  }

  // Create a new job posting
  static async createJob(req, res) {
    try {
      const company = await Company.findOne({ userId: req.user.id });
      if (!company) {
        return res.status(404).json({ message: 'Company profile not found' });
      }

      const job = new Job({
        ...req.body,
        companyId: company._id,
        postedBy: req.user.id,
        status: 'active'
      });

      await job.save();
      res.status(201).json(job);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Get company jobs
  static async getJobs(req, res) {
    try {
      const company = await Company.findOne({ userId: req.user.id });
      const jobs = await Job.find({ companyId: company._id })
        .sort({ createdAt: -1 });

      res.json(jobs);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Update job
  static async updateJob(req, res) {
    try {
      const { jobId } = req.params;
      const company = await Company.findOne({ userId: req.user.id });
      
      const job = await Job.findOneAndUpdate(
        { _id: jobId, companyId: company._id },
        req.body,
        { new: true }
      );

      if (!job) {
        return res.status(404).json({ message: 'Job not found' });
      }

      res.json(job);
    } catch (error) {
      res.status(500).json({ message: error.message });
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
        return res.status(404).json({ message: 'Job not found' });
      }

      const applications = await Application.find({ jobId })
        .populate('studentId')
        .populate('interviewRounds')
        .sort({ appliedAt: -1 });

      res.json(applications);
    } catch (error) {
      res.status(500).json({ message: error.message });
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
      if (feedback) application.feedback = feedback;
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

  // Get company dashboard data
  static async getDashboardData(req, res) {
    try {
      const company = await Company.findOne({ userId: req.user.id });
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