const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const Company = require('../models/Company');
const Job = require('../models/Job');
const Application = require('../models/Application');
const InterviewRound = require('../models/InterviewRound');

class AdminController {
  // Get admin dashboard analytics
  static async getDashboardData(req, res) {
    try {
      // Basic counts
      const totalStudents = await StudentProfile.countDocuments();
      const totalCompanies = await Company.countDocuments();
      const totalJobs = await Job.countDocuments();
      const totalApplications = await Application.countDocuments();

      // Placement statistics
      const placedStudents = await Application.countDocuments({ 
        status: 'offer_accepted' 
      });
      const placementPercentage = totalStudents > 0 ? 
        ((placedStudents / totalStudents) * 100).toFixed(2) : 0;

      // Recent activity
      const recentApplications = await Application.find()
        .populate('studentId', 'personalInfo.name')
        .populate('jobId', 'title')
        .sort({ appliedAt: -1 })
        .limit(10);

      const recentJobs = await Job.find()
        .populate('companyId', 'companyInfo.name')
        .sort({ createdAt: -1 })
        .limit(5);

      // Branch-wise placement data
      const placedStudentIds = await Application.find({ 
        status: 'offer_accepted' 
      }).distinct('studentId');

      const branchStats = await StudentProfile.aggregate([
        {
          $group: {
            _id: '$personalInfo.branch',
            total: { $sum: 1 },
            placed: {
              $sum: {
                $cond: [
                  { $in: ['$userId', placedStudentIds] },
                  1,
                  0
                ]
              }
            }
          }
        },
        {
          $project: {
            branch: '$_id',
            total: 1,
            placed: 1,
            percentage: {
              $multiply: [
                { $divide: ['$placed', '$total'] },
                100
              ]
            }
          }
        }
      ]);

      // Company-wise hiring stats
      const companyStats = await Job.aggregate([
        {
          $lookup: {
            from: 'applications',
            localField: '_id',
            foreignField: 'jobId',
            as: 'applications'
          }
        },
        {
          $lookup: {
            from: 'companies',
            localField: 'companyId',
            foreignField: '_id',
            as: 'company'
          }
        },
        {
          $unwind: '$company'
        },
        {
          $group: {
            _id: '$companyId',
            companyName: { $first: '$company.companyInfo.name' },
            totalJobs: { $sum: 1 },
            totalApplications: { $sum: { $size: '$applications' } },
            hired: {
              $sum: {
                $size: {
                  $filter: {
                    input: '$applications',
                    cond: { $eq: ['$$this.status', 'offer_accepted'] }
                  }
                }
              }
            }
          }
        },
        { $sort: { hired: -1 } },
        { $limit: 10 }
      ]);

      // Monthly application trends
      const monthlyTrends = await Application.aggregate([
        {
          $group: {
            _id: {
              year: { $year: '$appliedAt' },
              month: { $month: '$appliedAt' }
            },
            applications: { $sum: 1 },
            offers: {
              $sum: {
                $cond: [
                  { $eq: ['$status', 'offer_extended'] },
                  1,
                  0
                ]
              }
            }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
        { $limit: 12 }
      ]);

      res.json({
        success: true,
        data: {
          overview: {
            totalStudents,
            totalCompanies,
            totalJobs,
            totalApplications,
            placedStudents,
            placementPercentage
          },
          recentActivity: {
            applications: recentApplications,
            jobs: recentJobs
          },
          analytics: {
            branchStats,
            companyStats,
            monthlyTrends
          }
        }
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: error.message 
      });
    }
  }

  // Helper method to get placed student IDs
  static async getPlacedStudentIds() {
    const placedApplications = await Application.find({ 
      status: 'offer_accepted' 
    }).distinct('studentId');
    return placedApplications;
  }

  // Get all students with filters
  static async getStudents(req, res) {
    try {
      const { page = 1, limit = 20, branch, batch, search } = req.query;
      const query = {};

      if (branch) query['personalInfo.branch'] = branch;
      if (batch) query['personalInfo.batch'] = batch;
      if (search) {
        query['$or'] = [
          { 'personalInfo.name': { $regex: search, $options: 'i' } },
          { 'personalInfo.rollNumber': { $regex: search, $options: 'i' } }
        ];
      }

      const students = await StudentProfile.find(query)
        .populate('userId', 'email')
        .sort({ 'personalInfo.name': 1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await StudentProfile.countDocuments(query);

      res.json({
        students,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Get all companies
  static async getCompanies(req, res) {
    try {
      const { page = 1, limit = 20, search } = req.query;
      const query = {};

      if (search) {
        query['companyInfo.name'] = { $regex: search, $options: 'i' };
      }

      const companies = await Company.find(query)
        .populate('userId', 'email')
        .sort({ 'companyInfo.name': 1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Company.countDocuments(query);

      res.json({
        companies,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Get all jobs with filters
  static async getJobs(req, res) {
    try {
      const { page = 1, limit = 20, status, company, search } = req.query;
      const query = {};

      if (status) query.status = status;
      if (search) {
        query['$or'] = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }

      let jobs = Job.find(query)
        .populate('companyId', 'companyInfo.name')
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      if (company) {
        jobs = jobs.populate({
          path: 'companyId',
          match: { 'companyInfo.name': { $regex: company, $options: 'i' } }
        });
      }

      const jobResults = await jobs;
      const total = await Job.countDocuments(query);

      res.json({
        jobs: jobResults,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Approve/reject company
  static async updateCompanyStatus(req, res) {
    try {
      const { companyId } = req.params;
      const { status } = req.body;

      const company = await Company.findByIdAndUpdate(
        companyId,
        { 'companyInfo.verificationStatus': status },
        { new: true }
      );

      if (!company) {
        return res.status(404).json({ message: 'Company not found' });
      }

      res.json(company);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Get placement analytics
  static async getPlacementAnalytics(req, res) {
    try {
      // Skill-wise hiring trends
      const skillTrends = await Job.aggregate([
        { $unwind: '$eligibility.requiredSkills' },
        {
          $group: {
            _id: '$eligibility.requiredSkills',
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 20 }
      ]);

      // Salary distribution
      const salaryDistribution = await Job.aggregate([
        {
          $group: {
            _id: {
              $switch: {
                branches: [
                  { case: { $lt: ['$package.ctc', 500000] }, then: '0-5 LPA' },
                  { case: { $lt: ['$package.ctc', 1000000] }, then: '5-10 LPA' },
                  { case: { $lt: ['$package.ctc', 1500000] }, then: '10-15 LPA' },
                  { case: { $lt: ['$package.ctc', 2000000] }, then: '15-20 LPA' }
                ],
                default: '20+ LPA'
              }
            },
            count: { $sum: 1 }
          }
        }
      ]);

      // Interview success rates
      const interviewStats = await InterviewRound.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]);

      res.json({
        skillTrends,
        salaryDistribution,
        interviewStats
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = AdminController;