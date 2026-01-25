const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');
const { roleMiddleware } = require('../middlewares/roleMiddleware');

router.use(authMiddleware);
router.use(roleMiddleware('admin'));

router.get('/dashboard', AdminController.getDashboardData);
router.get('/students', AdminController.getStudents);
router.get('/companies', AdminController.getCompanies);
router.put('/companies/:companyId/status', AdminController.updateCompanyStatus);
router.get('/jobs', AdminController.getJobs);
router.get('/analytics', AdminController.getPlacementAnalytics);

module.exports = router;