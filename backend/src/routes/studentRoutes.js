const express = require('express');
const router = express.Router();
const StudentController = require('../controllers/studentController');
const authMiddleware = require('../middlewares/authMiddleware');
const { roleMiddleware } = require('../middlewares/roleMiddleware');

router.use(authMiddleware);
router.use(roleMiddleware('student'));

router.get('/profile', StudentController.getProfile);
router.put('/profile', StudentController.updateProfile);
router.get('/jobs/eligible', StudentController.getEligibleJobs);
router.post('/jobs/:jobId/apply', StudentController.applyForJob);
router.get('/applications', StudentController.getApplications);
router.get('/dashboard', StudentController.getDashboardData);
router.get('/prs', StudentController.getPRS);

module.exports = router;