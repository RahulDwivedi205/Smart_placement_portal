import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { 
  UserGroupIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CalendarIcon,
  StarIcon
} from '@heroicons/react/24/outline';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    jobId: '',
    status: '',
    search: ''
  });
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (jobs.length > 0) {
      fetchApplications();
    }
  }, [jobs, filters]);

  const fetchJobs = async () => {
    try {
      const response = await api.get('/company/jobs');
      setJobs(response.data || []);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
      setError('Failed to load jobs');
    }
  };

  const fetchApplications = async () => {
    try {
      setLoading(true);
      let allApplications = [];

      if (filters.jobId) {
        const response = await api.get(`/company/jobs/${filters.jobId}/applications`);
        allApplications = response.data || [];
      } else {
        // Fetch applications for all jobs
        const promises = jobs.map(job => 
          api.get(`/company/jobs/${job._id}/applications`).catch(() => ({ data: [] }))
        );
        const responses = await Promise.all(promises);
        allApplications = responses.flatMap(response => response.data || []);
      }

      // Apply filters
      let filteredApplications = allApplications;

      if (filters.status) {
        filteredApplications = filteredApplications.filter(app => app.status === filters.status);
      }

      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredApplications = filteredApplications.filter(app => 
          app.studentId?.personalInfo?.firstName?.toLowerCase().includes(searchLower) ||
          app.studentId?.personalInfo?.lastName?.toLowerCase().includes(searchLower) ||
          app.studentId?.personalInfo?.rollNumber?.toLowerCase().includes(searchLower)
        );
      }

      setApplications(filteredApplications);
      setError('');
    } catch (err) {
      console.error('Failed to fetch applications:', err);
      setError('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId, status, feedback = '') => {
    try {
      setActionLoading(true);
      const response = await api.put(`/company/applications/${applicationId}/status`, {
        status,
        feedback
      });

      if (response.data) {
        // Update the application in the list
        setApplications(prev => 
          prev.map(app => 
            app._id === applicationId 
              ? { ...app, status, feedback }
              : app
          )
        );
        setShowModal(false);
        setSelectedApplication(null);
      }
    } catch (err) {
      console.error('Failed to update application status:', err);
      setError('Failed to update application status');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'applied':
        return 'bg-blue-100 text-blue-800';
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800';
      case 'interview_scheduled':
        return 'bg-purple-100 text-purple-800';
      case 'interview_completed':
        return 'bg-indigo-100 text-indigo-800';
      case 'offer_extended':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'withdrawn':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'applied':
        return <ClockIcon className="h-4 w-4" />;
      case 'under_review':
        return <EyeIcon className="h-4 w-4" />;
      case 'interview_scheduled':
        return <CalendarIcon className="h-4 w-4" />;
      case 'offer_extended':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'rejected':
        return <XCircleIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  if (loading && applications.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 p-6">
      <div className="space-y-6">
        <div className="glass-card p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex items-center justify-center">
                <UserGroupIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Applications</h1>
                <p className="text-blue-100 mt-1">
                  Review and manage job applications
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="glass-card p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-blue-100 mb-2">
                Search Candidates
              </label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-300" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="glass-input w-full pl-10 pr-4 py-3"
                  placeholder="Search by name or roll number"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-blue-100 mb-2">
                Filter by Job
              </label>
              <select
                value={filters.jobId}
                onChange={(e) => setFilters(prev => ({ ...prev, jobId: e.target.value }))}
                className="glass-input w-full px-4 py-3"
              >
                <option value="">All Jobs</option>
                {jobs.map(job => (
                  <option key={job._id} value={job._id}>
                    {job.jobDetails?.title || 'Untitled Job'}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-blue-100 mb-2">
                Filter by Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="glass-input w-full px-4 py-3"
              >
                <option value="">All Status</option>
                <option value="applied">Applied</option>
                <option value="under_review">Under Review</option>
                <option value="interview_scheduled">Interview Scheduled</option>
                <option value="interview_completed">Interview Completed</option>
                <option value="offer_extended">Offer Extended</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={() => setFilters({ jobId: '', status: '', search: '' })}
                className="w-full px-4 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl font-medium hover:from-gray-600 hover:to-gray-700 transition-all duration-300"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="glass-card bg-red-500 bg-opacity-20 border-red-300 text-red-100 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <div className="glass-card">
          <div className="p-6">
            {applications.length === 0 ? (
              <div className="text-center py-12">
                <UserGroupIcon className="mx-auto h-16 w-16 text-blue-300 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  No applications found
                </h3>
                <p className="text-blue-200">
                  {filters.jobId || filters.status || filters.search 
                    ? 'Try adjusting your filters to see more applications.'
                    : 'Applications will appear here once students start applying to your jobs.'
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((application) => (
                  <div key={application._id} className="bg-white bg-opacity-10 rounded-xl p-6 backdrop-blur-sm border border-white border-opacity-20 hover:bg-opacity-20 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex items-center justify-center">
                          <UserGroupIcon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {application.studentId?.personalInfo?.firstName} {application.studentId?.personalInfo?.lastName}
                          </h3>
                          <p className="text-blue-200 text-sm">
                            {application.studentId?.personalInfo?.rollNumber} • {application.studentId?.personalInfo?.branch}
                          </p>
                          <p className="text-blue-300 text-sm">
                            Applied for: {jobs.find(job => job._id === application.jobId)?.jobDetails?.title || 'Unknown Job'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        {application.overallScore && (
                          <div className="flex items-center space-x-1 bg-green-500 bg-opacity-30 text-green-100 px-3 py-1 rounded-full">
                            <StarIcon className="h-4 w-4" />
                            <span className="text-sm font-medium">{application.overallScore}% Match</span>
                          </div>
                        )}
                        
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                          {getStatusIcon(application.status)}
                          <span className="ml-1">{application.status.replace('_', ' ').toUpperCase()}</span>
                        </div>
                        
                        <button
                          onClick={() => {
                            setSelectedApplication(application);
                            setShowModal(true);
                          }}
                          className="px-4 py-2 bg-blue-500 bg-opacity-30 text-blue-100 rounded-lg hover:bg-opacity-50 transition-all duration-200"
                        >
                          Review
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-200">
                      <div>
                        <span className="font-medium">CGPA:</span> {application.studentId?.academics?.cgpa || 'N/A'}
                      </div>
                      <div>
                        <span className="font-medium">Backlogs:</span> {application.studentId?.academics?.backlogs || 0}
                      </div>
                      <div>
                        <span className="font-medium">Applied:</span> {new Date(application.appliedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Application Review Modal */}
      {showModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="glass-card max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  Application Review
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedApplication(null);
                  }}
                  className="text-blue-200 hover:text-white"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Student Info */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Student Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-100">
                    <div>
                      <span className="font-medium">Name:</span> {selectedApplication.studentId?.personalInfo?.firstName} {selectedApplication.studentId?.personalInfo?.lastName}
                    </div>
                    <div>
                      <span className="font-medium">Roll Number:</span> {selectedApplication.studentId?.personalInfo?.rollNumber}
                    </div>
                    <div>
                      <span className="font-medium">Branch:</span> {selectedApplication.studentId?.personalInfo?.branch}
                    </div>
                    <div>
                      <span className="font-medium">Batch:</span> {selectedApplication.studentId?.personalInfo?.batch}
                    </div>
                    <div>
                      <span className="font-medium">CGPA:</span> {selectedApplication.studentId?.academics?.cgpa}
                    </div>
                    <div>
                      <span className="font-medium">Backlogs:</span> {selectedApplication.studentId?.academics?.backlogs || 0}
                    </div>
                  </div>
                </div>

                {/* Skills */}
                {selectedApplication.studentId?.skills && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Skills</h3>
                    <div className="space-y-2">
                      {Object.entries(selectedApplication.studentId.skills).map(([category, skills]) => (
                        skills && skills.length > 0 && (
                          <div key={category}>
                            <span className="font-medium text-blue-200 capitalize">{category}:</span>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {skills.map((skill, index) => (
                                <span key={index} className="px-2 py-1 bg-blue-500 bg-opacity-30 text-blue-100 rounded text-sm">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                )}

                {/* Cover Letter */}
                {selectedApplication.applicationData?.coverLetter && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Cover Letter</h3>
                    <div className="bg-white bg-opacity-10 rounded-lg p-4 text-blue-100">
                      {selectedApplication.applicationData.coverLetter}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Actions</h3>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => updateApplicationStatus(selectedApplication._id, 'under_review')}
                      disabled={actionLoading}
                      className="px-4 py-2 bg-yellow-500 bg-opacity-30 text-yellow-100 rounded-lg hover:bg-opacity-50 transition-all duration-200 disabled:opacity-50"
                    >
                      Mark Under Review
                    </button>
                    <button
                      onClick={() => updateApplicationStatus(selectedApplication._id, 'interview_scheduled')}
                      disabled={actionLoading}
                      className="px-4 py-2 bg-purple-500 bg-opacity-30 text-purple-100 rounded-lg hover:bg-opacity-50 transition-all duration-200 disabled:opacity-50"
                    >
                      Schedule Interview
                    </button>
                    <button
                      onClick={() => updateApplicationStatus(selectedApplication._id, 'offer_extended')}
                      disabled={actionLoading}
                      className="px-4 py-2 bg-green-500 bg-opacity-30 text-green-100 rounded-lg hover:bg-opacity-50 transition-all duration-200 disabled:opacity-50"
                    >
                      Extend Offer
                    </button>
                    <button
                      onClick={() => updateApplicationStatus(selectedApplication._id, 'rejected')}
                      disabled={actionLoading}
                      className="px-4 py-2 bg-red-500 bg-opacity-30 text-red-100 rounded-lg hover:bg-opacity-50 transition-all duration-200 disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applications;