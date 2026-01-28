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

// Gamification System
export const GAMIFICATION = {
  LEVELS: {
    1: { name: 'Placement Rookie', xpRequired: 0, color: 'gray' },
    2: { name: 'Skill Builder', xpRequired: 100, color: 'blue' },
    3: { name: 'Interview Warrior', xpRequired: 300, color: 'green' },
    4: { name: 'Career Champion', xpRequired: 600, color: 'purple' },
    5: { name: 'Placement Master', xpRequired: 1000, color: 'gold' },
    6: { name: 'Industry Legend', xpRequired: 1500, color: 'red' }
  },
  
  BADGES: {
    PROFILE_COMPLETE: { name: 'Profile Master', icon: '👤', xp: 50, description: 'Complete your profile 100%' },
    FIRST_APPLICATION: { name: 'First Step', icon: '🚀', xp: 25, description: 'Submit your first job application' },
    INTERVIEW_ACE: { name: 'Interview Ace', icon: '🎯', xp: 75, description: 'Get selected for an interview' },
    SKILL_COLLECTOR: { name: 'Skill Collector', icon: '⚡', xp: 30, description: 'Add 10+ skills to your profile' },
    NETWORKING_PRO: { name: 'Networking Pro', icon: '🤝', xp: 40, description: 'Connect with 5+ companies' },
    QUICK_APPLIER: { name: 'Speed Demon', icon: '💨', xp: 35, description: 'Apply to 5 jobs in one day' },
    PERSISTENT: { name: 'Never Give Up', icon: '💪', xp: 60, description: 'Apply to 20+ jobs' },
    OFFER_RECEIVER: { name: 'Offer Magnet', icon: '🎁', xp: 100, description: 'Receive your first job offer' },
    PLACEMENT_HERO: { name: 'Placement Hero', icon: '🏆', xp: 200, description: 'Successfully get placed!' }
  },
  
  ACHIEVEMENTS: {
    DAILY_LOGIN: { name: 'Daily Warrior', icon: '📅', xp: 5, description: 'Login daily for 7 days' },
    PROFILE_VIEWS: { name: 'Popular Profile', icon: '👀', xp: 20, description: 'Get 50+ profile views' },
    COMPANY_FAVORITE: { name: 'Company Favorite', icon: '⭐', xp: 45, description: 'Get shortlisted by 3+ companies' },
    SKILL_MASTER: { name: 'Skill Master', icon: '🧠', xp: 80, description: 'Master 5+ technical skills' }
  },
  
  QUESTS: {
    WEEKLY_APPLICATIONS: { name: 'Weekly Hustle', target: 3, reward: 25, icon: '📝' },
    PROFILE_OPTIMIZATION: { name: 'Profile Polish', target: 100, reward: 50, icon: '✨' },
    SKILL_BUILDING: { name: 'Skill Sprint', target: 5, reward: 30, icon: '🎓' },
    NETWORKING_CHALLENGE: { name: 'Network Ninja', target: 10, reward: 40, icon: '🌐' }
  }
};