import api from '../api/axios';
import { API_ENDPOINTS } from '../constants';

// Base API service class
class BaseApiService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async get(endpoint = '', params = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await api.get(url, { params });
    return response.data;
  }

  async post(endpoint = '', data = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await api.post(url, data);
    return response.data;
  }

  async put(endpoint = '', data = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await api.put(url, data);
    return response.data;
  }

  async patch(endpoint = '', data = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await api.patch(url, data);
    return response.data;
  }

  async delete(endpoint = '') {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await api.delete(url);
    return response.data;
  }
}

// Authentication Service
class AuthService extends BaseApiService {
  constructor() {
    super('');
  }

  async login(credentials) {
    return this.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
  }

  async register(userData) {
    return this.post(API_ENDPOINTS.AUTH.REGISTER, userData);
  }

  async getProfile() {
    return this.get(API_ENDPOINTS.AUTH.PROFILE);
  }

  async logout() {
    return this.post(API_ENDPOINTS.AUTH.LOGOUT);
  }

  async changePassword(passwordData) {
    return this.put(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, passwordData);
  }
}

// Student Service
class StudentService extends BaseApiService {
  constructor() {
    super('');
  }

  async getDashboard() {
    return this.get(API_ENDPOINTS.STUDENT.DASHBOARD);
  }

  async getProfile() {
    return this.get(API_ENDPOINTS.STUDENT.PROFILE);
  }

  async updateProfile(profileData) {
    return this.put(API_ENDPOINTS.STUDENT.PROFILE, profileData);
  }

  async getEligibleJobs(filters = {}) {
    return this.get(API_ENDPOINTS.STUDENT.JOBS, filters);
  }

  async applyForJob(jobId, applicationData) {
    return this.post(API_ENDPOINTS.STUDENT.APPLY(jobId), applicationData);
  }

  async getApplications() {
    return this.get(API_ENDPOINTS.STUDENT.APPLICATIONS);
  }

  async getPRS() {
    return this.get(API_ENDPOINTS.STUDENT.PRS);
  }
}

// Company Service
class CompanyService extends BaseApiService {
  constructor() {
    super('');
  }

  async getDashboard() {
    return this.get(API_ENDPOINTS.COMPANY.DASHBOARD);
  }

  async getProfile() {
    return this.get(API_ENDPOINTS.COMPANY.PROFILE);
  }

  async updateProfile(profileData) {
    return this.put(API_ENDPOINTS.COMPANY.PROFILE, profileData);
  }

  async getJobs() {
    return this.get(API_ENDPOINTS.COMPANY.JOBS);
  }

  async getJob(jobId) {
    return this.get(API_ENDPOINTS.COMPANY.JOB(jobId));
  }

  async createJob(jobData) {
    return this.post(API_ENDPOINTS.COMPANY.JOBS, jobData);
  }

  async updateJob(jobId, jobData) {
    return this.put(API_ENDPOINTS.COMPANY.JOB(jobId), jobData);
  }

  async deleteJob(jobId) {
    return this.delete(API_ENDPOINTS.COMPANY.JOB(jobId));
  }

  async getJobApplications(jobId) {
    return this.get(API_ENDPOINTS.COMPANY.APPLICATIONS(jobId));
  }

  async updateApplicationStatus(applicationId, statusData) {
    return this.put(API_ENDPOINTS.COMPANY.UPDATE_APPLICATION(applicationId), statusData);
  }

  async deleteApplication(applicationId) {
    return this.delete(API_ENDPOINTS.COMPANY.DELETE_APPLICATION(applicationId));
  }
}

// Admin Service
class AdminService extends BaseApiService {
  constructor() {
    super('');
  }

  async getDashboard() {
    return this.get(API_ENDPOINTS.ADMIN.DASHBOARD);
  }

  async getCompanies(filters = {}) {
    return this.get(API_ENDPOINTS.ADMIN.COMPANIES, filters);
  }

  async getApplications(filters = {}) {
    return this.get(API_ENDPOINTS.ADMIN.APPLICATIONS, filters);
  }

  async getStudents(filters = {}) {
    return this.get(API_ENDPOINTS.ADMIN.STUDENTS, filters);
  }

  async getAnalytics() {
    return this.get(API_ENDPOINTS.ADMIN.ANALYTICS);
  }
}

// Export service instances
export const authService = new AuthService();
export const studentService = new StudentService();
export const companyService = new CompanyService();
export const adminService = new AdminService();

// Export services object for easy access
export const apiServices = {
  auth: authService,
  student: studentService,
  company: companyService,
  admin: adminService
};