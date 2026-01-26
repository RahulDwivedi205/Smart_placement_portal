const express = require('express');
const router = express.Router();
const CompanyController = require('../controllers/companyController');
const authMiddleware = require('../middlewares/authMiddleware');
const { roleMiddleware } = require('../middlewares/roleMiddleware');

router.use(authMiddleware);
router.use(roleMiddleware('company'));

router.get('/profile', CompanyController.getProfile);
router.put('/profile', CompanyController.updateProfile);
router.post('/jobs', CompanyController.createJob);
router.get('/jobs', CompanyController.getJobs);
router.get('/jobs/:jobId', CompanyController.getJob);
router.put('/jobs/:jobId', CompanyController.updateJob);
router.delete('/jobs/:jobId', CompanyController.deleteJob);
router.get('/jobs/:jobId/applications', CompanyController.getJobApplications);
router.get('/jobs/:jobId/eligible-students', CompanyController.getEligibleStudents);
router.put('/applications/:applicationId/status', CompanyController.updateApplicationStatus);
router.delete('/applications/:applicationId', CompanyController.deleteApplication);
router.post('/applications/:applicationId/interview', CompanyController.scheduleInterview);
router.get('/dashboard', CompanyController.getDashboardData);

module.exports = router;