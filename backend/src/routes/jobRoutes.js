const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const authMiddleware = require('../middlewares/authMiddleware');

// Get all active jobs (public route for students)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 20, search, branch, ctc, location } = req.query;
    const query = { 
      status: 'active',
      applicationDeadline: { $gte: new Date() }
    };

    // Apply filters
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (branch && branch !== 'ALL') {
      query['eligibility.branches'] = { $in: [branch, 'ALL'] };
    }

    if (ctc) {
      const [min, max] = ctc.split('-').map(Number);
      query['package.ctc'] = { $gte: min * 100000 };
      if (max) query['package.ctc'].$lte = max * 100000;
    }

    if (location) {
      query['jobDetails.location'] = { $regex: location, $options: 'i' };
    }

    const jobs = await Job.find(query)
      .populate('companyId', 'companyInfo.name companyInfo.logo')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Job.countDocuments(query);

    res.json({
      jobs,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get job by ID
router.get('/:jobId', authMiddleware, async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId)
      .populate('companyId', 'companyInfo');

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;