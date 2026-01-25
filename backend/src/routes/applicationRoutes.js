const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const InterviewRound = require('../models/InterviewRound');
const authMiddleware = require('../middlewares/authMiddleware');

// Get application by ID (for all roles)
router.get('/:applicationId', authMiddleware, async (req, res) => {
  try {
    const application = await Application.findById(req.params.applicationId)
      .populate('studentId')
      .populate('jobId')
      .populate('interviewRounds');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check authorization
    const isStudent = req.user.role === 'student' && 
                     application.studentId.userId.toString() === req.user.id;
    const isCompany = req.user.role === 'company'; // Additional company check needed
    const isAdmin = req.user.role === 'admin';

    if (!isStudent && !isCompany && !isAdmin) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update interview round status
router.put('/interviews/:interviewId/status', authMiddleware, async (req, res) => {
  try {
    const { status, feedback, score } = req.body;
    
    const interview = await InterviewRound.findById(req.params.interviewId)
      .populate({
        path: 'applicationId',
        populate: { path: 'jobId' }
      });

    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    // Authorization check for company
    if (req.user.role === 'company') {
      // Add company authorization logic here
    }

    interview.status = status;
    if (feedback) interview.feedback = feedback;
    if (score !== undefined) interview.score = score;
    interview.completedAt = new Date();

    await interview.save();

    // Update application status based on interview result
    const application = await Application.findById(interview.applicationId._id);
    if (status === 'passed') {
      // Check if this was the final round
      const totalRounds = await InterviewRound.countDocuments({
        applicationId: interview.applicationId._id
      });
      
      if (interview.round === totalRounds) {
        application.status = 'interview_completed';
      }
    } else if (status === 'failed') {
      application.status = 'rejected';
    }

    await application.save();

    res.json(interview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;