import { useState, useEffect } from 'react';
import api from '../../api/axios';
import BackButton from '../../components/common/BackButton';
import { 
  DocumentTextIcon,
  UserIcon,
  BuildingOfficeIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CalendarIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    company: '',
    branch: ''
  });
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    interviewed: 0
  });

  useEffect(() => {
    fetchApplications();
    fetchStats();
  }, [filters]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams(filters);
      const response = await api.get(`/admin/applications?${params}`);
      if (response.data.success) {
        setApplications(response.data.data || []);
      } else {
        setError(response.data.message || 'Failed to load applications');
      }
    } catch (err) {
      setError('Failed to load applications');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/applications/stats');
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  const handleStatusUpdate = async (applicationId, status, feedback = '') => {
    try {
      const response = await api.put(`/admin/applications/${applicationId}/status`, { 
        status, 
        feedback 
      });
      if (response.data.success) {
        fetchApplications();
        fetchStats();
        alert(`Application ${status} successfully!`);
        setShowModal(false);
      }
    } catch (err) {
      alert('Failed to update application status');
      console.error(err);
    }
  };

  const scheduleInterview = async (applicationId, interviewData) => {
    try {
      const response = await api.post(`/admin/applications/${applicationId}/interview`, interviewData);
      if (response.data.success) {
        fetchApplications();
        alert('Interview scheduled successfully!');
        setShowModal(false);
      }
    } catch (err) {
      alert('Failed to schedule interview');
      console.error(err);
    }
  };

  const openModal = (application) => {
    setSelectedApplication(application);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedApplication(null);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'applied':
        return <ClockIcon className="h-5 w-5 text-yellow-400" />;
      case 'interview_scheduled':
        return <CalendarIcon className="h-5 w-5 text-blue-400" />;
      case 'offer_received':
        return <CheckCircleIcon className="h-5 w-5 text-green-400" />;
      case 'rejected':
        return <XCircleIcon className="h-5 w-5 text-red-400" />;
      default:
        return <DocumentTextIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'applied':
        return 'bg-yellow-500 bg-opacity-20 text-yellow-200 border border-yellow-400';
      case 'interview_scheduled':
        return 'bg-blue-500 bg-opacity-20 text-blue-200 border border-blue-400';
      case 'offer_received':
        return 'bg-green-500 bg-opacity-20 text-green-200 border border-green-400';
      case 'rejected':
        return 'bg-red-500 bg-opacity-20 text-red-200 border border-red-400';
      default:
        return 'bg-gray-500 bg-opacity-20 text-gray-200 border border-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 p-6">
      <div className="space-y-6">
        <BackButton to="/admin" className="text-white hover:text-blue-200 hover:bg-white hover:bg-opacity-10" />
        
        {/* Header */}
        <div className="glass-card p-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex items-center justify-center">
              <DocumentTextIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Application Management</h1>
              <p className="text-blue-100 mt-1">
                Monitor and manage student job applications
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {[
            { title: 'Total Applications', value: stats.total, color: 'bg-blue-500', icon: DocumentTextIcon },
            { title: 'Pending Review', value: stats.pending, color: 'bg-yellow-500', icon: ClockIcon },
            { title: 'Interview Scheduled', value: stats.interviewed, color: 'bg-purple-500', icon: CalendarIcon },
            { title: 'Offers Extended', value: stats.approved, color: 'bg-green-500', icon: CheckCircleIcon },
            { title: 'Rejected', value: stats.rejected, color: 'bg-red-500', icon: XCircleIcon }
          ].map((stat, index) => (
            <div key={index} className="glass-card p-6 hover:bg-white hover:bg-opacity-20 transition-all duration-300">
              <div className="flex items-center">
                <div className={`${stat.color} rounded-xl p-3`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-blue-200">{stat.title}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="glass-card p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-blue-100 mb-2">
                Search Applications
              </label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-300" />
                <input
                  type="text"
                  placeholder="Student name, job title..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="glass-input pl-10 w-full px-4 py-3"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-100 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="glass-input w-full px-4 py-3"
              >
                <option value="">All Status</option>
                <option value="applied">Applied</option>
                <option value="interview_scheduled">Interview Scheduled</option>
                <option value="offer_received">Offer Received</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-100 mb-2">
                Company
              </label>
              <input
                type="text"
                placeholder="Company name..."
                value={filters.company}
                onChange={(e) => setFilters(prev => ({ ...prev, company: e.target.value }))}
                className="glass-input w-full px-4 py-3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-100 mb-2">
                Branch
              </label>
              <select
                value={filters.branch}
                onChange={(e) => setFilters(prev => ({ ...prev, branch: e.target.value }))}
                className="glass-input w-full px-4 py-3"
              >
                <option value="">All Branches</option>
                <option value="CSE">Computer Science</option>
                <option value="ECE">Electronics & Communication</option>
                <option value="EEE">Electrical & Electronics</option>
                <option value="MECH">Mechanical</option>
                <option value="CIVIL">Civil</option>
                <option value="IT">Information Technology</option>
              </select>
            </div>
          </div>
        </div>

        {/* Applications List */}
        {error && (
          <div className="glass-card bg-red-500 bg-opacity-20 border-red-300 text-red-100 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <div className="glass-card">
          <div className="px-6 py-4 border-b border-white border-opacity-20">
            <h2 className="text-xl font-semibold text-white">
              Applications ({applications.length})
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white bg-opacity-5">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-200 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-200 uppercase tracking-wider">
                    Job / Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-200 uppercase tracking-wider">
                    Applied Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-200 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-200 uppercase tracking-wider">
                    Match Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-200 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white divide-opacity-10">
                {applications.map((application) => (
                  <tr key={application._id} className="hover:bg-white hover:bg-opacity-5">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="bg-blue-400 bg-opacity-30 rounded-lg p-2">
                          <UserIcon className="h-5 w-5 text-blue-200" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-white">
                            {application.studentId?.personalInfo?.name || 'N/A'}
                          </div>
                          <div className="text-sm text-blue-200">
                            {application.studentId?.personalInfo?.rollNumber} • {application.studentId?.personalInfo?.branch}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="bg-green-400 bg-opacity-30 rounded-lg p-2">
                          <BuildingOfficeIcon className="h-5 w-5 text-green-200" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-white">
                            {application.jobId?.jobDetails?.title}
                          </div>
                          <div className="text-sm text-blue-200">
                            {application.jobId?.companyId?.companyInfo?.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-200">
                      {new Date(application.appliedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(application.status)}
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                          {application.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-green-300">
                        {application.matchingScore || 'N/A'}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => openModal(application)}
                        className="text-blue-300 hover:text-blue-100 transition-colors"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {applications.length === 0 && (
            <div className="text-center py-12">
              <DocumentTextIcon className="mx-auto h-12 w-12 text-blue-300" />
              <h3 className="mt-2 text-sm font-medium text-white">No applications found</h3>
              <p className="mt-1 text-sm text-blue-200">
                No applications match your current filters.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Application Detail Modal */}
      {showModal && selectedApplication && (
        <ApplicationModal
          application={selectedApplication}
          onClose={closeModal}
          onStatusUpdate={handleStatusUpdate}
          onScheduleInterview={scheduleInterview}
        />
      )}
    </div>
  );
};

const ApplicationModal = ({ application, onClose, onStatusUpdate, onScheduleInterview }) => {
  const [feedback, setFeedback] = useState('');
  const [interviewData, setInterviewData] = useState({
    round: 1,
    interviewType: 'technical',
    scheduledAt: '',
    meetingLink: '',
    instructions: ''
  });
  const [activeTab, setActiveTab] = useState('details');

  const handleStatusUpdate = (status) => {
    if (status === 'rejected' && !feedback.trim()) {
      alert('Please provide feedback for rejection');
      return;
    }
    onStatusUpdate(application._id, status, feedback);
  };

  const handleScheduleInterview = () => {
    if (!interviewData.scheduledAt) {
      alert('Please select interview date and time');
      return;
    }
    onScheduleInterview(application._id, interviewData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="glass-card max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Application Details</h2>
            <button
              onClick={onClose}
              className="text-blue-200 hover:text-white transition-colors"
            >
              <XCircleIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-white border-opacity-20 mb-6">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'details', name: 'Application Details' },
                { id: 'student', name: 'Student Profile' },
                { id: 'actions', name: 'Actions' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-blue-300 text-white'
                      : 'border-transparent text-blue-200 hover:text-white hover:border-blue-400'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-300`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-white mb-4">Job Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-blue-200">Job Title</label>
                      <p className="text-white">{application.jobId?.jobDetails?.title}</p>
                    </div>
                    <div>
                      <label className="text-sm text-blue-200">Company</label>
                      <p className="text-white">{application.jobId?.companyId?.companyInfo?.name}</p>
                    </div>
                    <div>
                      <label className="text-sm text-blue-200">Location</label>
                      <p className="text-white">{application.jobId?.jobDetails?.location}</p>
                    </div>
                    <div>
                      <label className="text-sm text-blue-200">Package</label>
                      <p className="text-white">₹{(application.jobId?.package?.ctc / 100000).toFixed(1)} LPA</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white mb-4">Application Info</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-blue-200">Applied Date</label>
                      <p className="text-white">{new Date(application.appliedAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <label className="text-sm text-blue-200">Status</label>
                      <p className="text-white">{application.status.replace('_', ' ').toUpperCase()}</p>
                    </div>
                    <div>
                      <label className="text-sm text-blue-200">Match Score</label>
                      <p className="text-green-300 font-semibold">{application.matchingScore || 'N/A'}%</p>
                    </div>
                    <div>
                      <label className="text-sm text-blue-200">Cover Letter</label>
                      <p className="text-white text-sm">{application.coverLetter}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'student' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-white mb-4">Personal Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-blue-200">Name</label>
                      <p className="text-white">{application.studentId?.personalInfo?.name}</p>
                    </div>
                    <div>
                      <label className="text-sm text-blue-200">Roll Number</label>
                      <p className="text-white">{application.studentId?.personalInfo?.rollNumber}</p>
                    </div>
                    <div>
                      <label className="text-sm text-blue-200">Branch</label>
                      <p className="text-white">{application.studentId?.personalInfo?.branch}</p>
                    </div>
                    <div>
                      <label className="text-sm text-blue-200">Batch</label>
                      <p className="text-white">{application.studentId?.personalInfo?.batch}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white mb-4">Academic Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-blue-200">CGPA</label>
                      <p className="text-white">{application.studentId?.academics?.cgpa}</p>
                    </div>
                    <div>
                      <label className="text-sm text-blue-200">Backlogs</label>
                      <p className="text-white">{application.studentId?.academics?.backlogs}</p>
                    </div>
                    <div>
                      <label className="text-sm text-blue-200">10th Marks</label>
                      <p className="text-white">{application.studentId?.academics?.tenthMarks}%</p>
                    </div>
                    <div>
                      <label className="text-sm text-blue-200">12th Marks</label>
                      <p className="text-white">{application.studentId?.academics?.twelfthMarks}%</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Skills</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(application.studentId?.skills || {}).map(([category, skills]) => (
                    <div key={category}>
                      <label className="text-sm text-blue-200 capitalize">{category} Skills</label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {skills.map((skill, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500 bg-opacity-30 text-blue-100 border border-blue-400"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'actions' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Update Application Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => handleStatusUpdate('interview_scheduled')}
                    className="px-4 py-3 bg-blue-500 bg-opacity-30 text-blue-200 border border-blue-400 rounded-xl hover:bg-opacity-50 transition-all duration-300"
                  >
                    Schedule Interview
                  </button>
                  <button
                    onClick={() => handleStatusUpdate('offer_received')}
                    className="px-4 py-3 bg-green-500 bg-opacity-30 text-green-200 border border-green-400 rounded-xl hover:bg-opacity-50 transition-all duration-300"
                  >
                    Extend Offer
                  </button>
                  <button
                    onClick={() => handleStatusUpdate('rejected')}
                    className="px-4 py-3 bg-red-500 bg-opacity-30 text-red-200 border border-red-400 rounded-xl hover:bg-opacity-50 transition-all duration-300"
                  >
                    Reject Application
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-white mb-4">Schedule Interview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-100 mb-2">
                      Round
                    </label>
                    <select
                      value={interviewData.round}
                      onChange={(e) => setInterviewData(prev => ({ ...prev, round: parseInt(e.target.value) }))}
                      className="glass-input w-full px-4 py-3"
                    >
                      <option value={1}>Round 1</option>
                      <option value={2}>Round 2</option>
                      <option value={3}>Round 3</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-100 mb-2">
                      Interview Type
                    </label>
                    <select
                      value={interviewData.interviewType}
                      onChange={(e) => setInterviewData(prev => ({ ...prev, interviewType: e.target.value }))}
                      className="glass-input w-full px-4 py-3"
                    >
                      <option value="technical">Technical</option>
                      <option value="hr">HR</option>
                      <option value="managerial">Managerial</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-100 mb-2">
                      Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      value={interviewData.scheduledAt}
                      onChange={(e) => setInterviewData(prev => ({ ...prev, scheduledAt: e.target.value }))}
                      className="glass-input w-full px-4 py-3"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-100 mb-2">
                      Meeting Link
                    </label>
                    <input
                      type="url"
                      placeholder="https://meet.google.com/..."
                      value={interviewData.meetingLink}
                      onChange={(e) => setInterviewData(prev => ({ ...prev, meetingLink: e.target.value }))}
                      className="glass-input w-full px-4 py-3"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-blue-100 mb-2">
                    Instructions
                  </label>
                  <textarea
                    placeholder="Interview instructions for the student..."
                    value={interviewData.instructions}
                    onChange={(e) => setInterviewData(prev => ({ ...prev, instructions: e.target.value }))}
                    rows={3}
                    className="glass-input w-full px-4 py-3"
                  />
                </div>
                <button
                  onClick={handleScheduleInterview}
                  className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-medium hover:from-blue-600 hover:to-indigo-600 transition-all duration-300"
                >
                  Schedule Interview
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-100 mb-2">
                  Feedback / Comments
                </label>
                <textarea
                  placeholder="Add feedback or comments..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={4}
                  className="glass-input w-full px-4 py-3"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Applications;