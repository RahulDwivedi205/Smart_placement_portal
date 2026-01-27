// Application constants
const USER_ROLES = {
  STUDENT: 'student',
  COMPANY: 'company',
  ADMIN: 'admin'
};

const APPLICATION_STATUS = {
  APPLIED: 'applied',
  UNDER_REVIEW: 'under_review',
  SHORTLISTED: 'shortlisted',
  INTERVIEW_SCHEDULED: 'interview_scheduled',
  INTERVIEW_COMPLETED: 'interview_completed',
  SELECTED: 'selected',
  REJECTED: 'rejected',
  WITHDRAWN: 'withdrawn',
  OFFER_EXTENDED: 'offer_extended',
  OFFER_ACCEPTED: 'offer_accepted',
  OFFER_DECLINED: 'offer_declined'
};

const JOB_STATUS = {
  ACTIVE: 'active',
  CLOSED: 'closed',
  DRAFT: 'draft',
  PAUSED: 'paused'
};

const COMPANY_SIZES = {
  STARTUP: 'startup',
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
  ENTERPRISE: 'enterprise'
};

const BRANCHES = {
  CSE: 'CSE',
  IT: 'IT',
  ECE: 'ECE',
  EEE: 'EEE',
  MECH: 'MECH',
  CIVIL: 'CIVIL',
  CHEM: 'CHEM',
  BIO: 'BIO'
};

const JOB_TYPES = {
  FULLTIME: 'fulltime',
  INTERNSHIP: 'internship',
  CONTRACT: 'contract',
  PARTTIME: 'parttime'
};

const WORK_MODES = {
  ONSITE: 'onsite',
  REMOTE: 'remote',
  HYBRID: 'hybrid'
};

const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100
};

const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 6,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[0-9]{10}$/,
  CGPA_MIN: 0,
  CGPA_MAX: 10,
  PERCENTAGE_MIN: 0,
  PERCENTAGE_MAX: 100
};

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500
};

const ERROR_MESSAGES = {
  VALIDATION_ERROR: 'Validation failed',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  NOT_FOUND: 'Resource not found',
  CONFLICT: 'Resource conflict',
  INTERNAL_ERROR: 'Internal server error',
  INVALID_CREDENTIALS: 'Invalid credentials',
  USER_EXISTS: 'User already exists',
  USER_NOT_FOUND: 'User not found',
  INVALID_TOKEN: 'Invalid or expired token'
};

const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful',
  REGISTER_SUCCESS: 'Registration successful',
  PROFILE_UPDATED: 'Profile updated successfully',
  RESOURCE_CREATED: 'Resource created successfully',
  RESOURCE_UPDATED: 'Resource updated successfully',
  RESOURCE_DELETED: 'Resource deleted successfully'
};

module.exports = {
  USER_ROLES,
  APPLICATION_STATUS,
  JOB_STATUS,
  COMPANY_SIZES,
  BRANCHES,
  JOB_TYPES,
  WORK_MODES,
  PAGINATION,
  VALIDATION_RULES,
  HTTP_STATUS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES
};