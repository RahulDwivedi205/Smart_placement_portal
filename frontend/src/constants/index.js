// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/auth/profile',
    LOGOUT: '/auth/logout',
    CHANGE_PASSWORD: '/auth/change-password'
  },
  STUDENT: {
    DASHBOARD: '/student/dashboard',
    PROFILE: '/student/profile',
    JOBS: '/student/jobs/eligible',
    APPLICATIONS: '/student/applications',
    APPLY: (jobId) => `/student/jobs/${jobId}/apply`,
    PRS: '/student/prs'
  },
  COMPANY: {
    DASHBOARD: '/company/dashboard',
    PROFILE: '/company/profile',
    JOBS: '/company/jobs',
    JOB: (jobId) => `/company/jobs/${jobId}`,
    APPLICATIONS: (jobId) => `/company/jobs/${jobId}/applications`,
    UPDATE_APPLICATION: (applicationId) => `/company/applications/${applicationId}/status`,
    DELETE_APPLICATION: (applicationId) => `/company/applications/${applicationId}`
  },
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    COMPANIES: '/admin/companies',
    APPLICATIONS: '/admin/applications',
    STUDENTS: '/admin/students',
    ANALYTICS: '/admin/analytics'
  }
};

// Application Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  STUDENT: {
    DASHBOARD: '/student',
    PROFILE: '/student/profile',
    JOBS: '/student/jobs',
    APPLICATIONS: '/student/applications'
  },
  COMPANY: {
    DASHBOARD: '/company',
    PROFILE: '/company/profile',
    JOBS: '/company/jobs',
    JOB_NEW: '/company/jobs/new',
    JOB_EDIT: (jobId) => `/company/jobs/${jobId}/edit`,
    APPLICATIONS: '/company/applications'
  },
  ADMIN: {
    DASHBOARD: '/admin',
    COMPANIES: '/admin/companies',
    APPLICATIONS: '/admin/applications',
    PLACEMENT_PROCESS: '/admin/placement-process'
  }
};

// User Roles
export const USER_ROLES = {
  STUDENT: 'student',
  COMPANY: 'company',
  ADMIN: 'admin'
};

// Application Status
export const APPLICATION_STATUS = {
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

// Job Status
export const JOB_STATUS = {
  ACTIVE: 'active',
  CLOSED: 'closed',
  DRAFT: 'draft',
  PAUSED: 'paused'
};

// Company Sizes
export const COMPANY_SIZES = {
  STARTUP: 'startup',
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
  ENTERPRISE: 'enterprise'
};

// Academic Branches
export const BRANCHES = {
  CSE: 'CSE',
  IT: 'IT',
  ECE: 'ECE',
  EEE: 'EEE',
  MECH: 'MECH',
  CIVIL: 'CIVIL',
  CHEM: 'CHEM',
  BIO: 'BIO'
};

// Job Types
export const JOB_TYPES = {
  FULLTIME: 'fulltime',
  INTERNSHIP: 'internship',
  CONTRACT: 'contract',
  PARTTIME: 'parttime'
};

// Work Modes
export const WORK_MODES = {
  ONSITE: 'onsite',
  REMOTE: 'remote',
  HYBRID: 'hybrid'
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language'
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  NOT_FOUND: 'The requested resource was not found.',
  GENERIC_ERROR: 'Something went wrong. Please try again.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  REGISTER_SUCCESS: 'Registration successful!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  APPLICATION_SUBMITTED: 'Application submitted successfully!',
  JOB_CREATED: 'Job posted successfully!',
  JOB_UPDATED: 'Job updated successfully!',
  JOB_DELETED: 'Job deleted successfully!'
};

// Validation Rules
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 6,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[0-9]{10}$/,
  CGPA_MIN: 0,
  CGPA_MAX: 10,
  PERCENTAGE_MIN: 0,
  PERCENTAGE_MAX: 100
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100
};

// Theme Colors
export const THEME = {
  PRIMARY: 'blue',
  SECONDARY: 'gray',
  SUCCESS: 'green',
  WARNING: 'yellow',
  ERROR: 'red',
  INFO: 'blue'
};