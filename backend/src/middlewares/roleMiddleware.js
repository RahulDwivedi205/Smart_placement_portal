const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${allowedRoles.join(' or ')}`
      });
    }

    next();
  };
};

// Specific role middlewares for convenience
const studentOnly = roleMiddleware('student');
const companyOnly = roleMiddleware('company');
const adminOnly = roleMiddleware('admin');
const adminOrCompany = roleMiddleware('admin', 'company');
const allRoles = roleMiddleware('student', 'company', 'admin');

module.exports = {
  roleMiddleware,
  studentOnly,
  companyOnly,
  adminOnly,
  adminOrCompany,
  allRoles
};