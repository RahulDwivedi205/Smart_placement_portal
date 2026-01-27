import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import BackButton from '../../components/common/BackButton';
import { 
  PlusIcon,
  BriefcaseIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteModal, setDeleteModal] = useState({ show: false, jobId: null });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/company/jobs');
      setJobs(response.data || []);
      setError('');
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
      setError('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    try {
      await api.delete(`/company/jobs/${jobId}`);
      setJobs(jobs.filter(job => job._id !== jobId));
      setDeleteModal({ show: false, jobId: null });
    } catch (err) {
      console.error('Failed to delete job:', err);
      setError('Failed to delete job');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
        <BackButton to="/company" className="text-white hover:text-blue-200 hover:bg-white hover:bg-opacity-10" />
        
        <div className="glass-card p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex items-center justify-center">
                <BriefcaseIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Job Management</h1>
                <p className="text-blue-100 mt-1">
                  Create and manage your job postings
                </p>
              </div>
            </div>
            <Link
              to="/company/jobs/new"
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-medium hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Post New Job</span>
            </Link>
          </div>
        </div>

        {error && (
          <div className="glass-card bg-red-500 bg-opacity-20 border-red-300 text-red-100 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <div className="glass-card">
          <div className="p-6">
            {jobs.length === 0 ? (
              <div className="text-center py-12">
                <BriefcaseIcon className="mx-auto h-16 w-16 text-blue-300 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  No jobs posted yet
                </h3>
                <p className="text-blue-200 mb-6">
                  Start by creating your first job posting to attract talented candidates.
                </p>
                <Link
                  to="/company/jobs/new"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Post Your First Job
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {jobs.map((job) => (
                  <div key={job._id} className="bg-white bg-opacity-10 rounded-xl p-6 backdrop-blur-sm border border-white border-opacity-20 hover:bg-opacity-20 transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white mb-2">
                          {job.jobDetails?.title || 'Untitled Job'}
                        </h3>
                        <div className="flex items-center space-x-4 text-blue-200 text-sm mb-3">
                          <div className="flex items-center">
                            <MapPinIcon className="h-4 w-4 mr-1" />
                            {job.jobDetails?.location || 'Location not specified'}
                          </div>
                          <div className="flex items-center">
                            <CurrencyDollarIcon className="h-4 w-4 mr-1" />
                            {job.package?.ctc ? `₹${job.package.ctc} LPA` : 'Package not specified'}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 mb-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                            {job.status?.toUpperCase() || 'DRAFT'}
                          </span>
                          <div className="flex items-center text-blue-200 text-sm">
                            <UserGroupIcon className="h-4 w-4 mr-1" />
                            {job.applicationCount || 0} applications
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-blue-100 text-sm mb-4 line-clamp-2">
                      {job.jobDetails?.description || 'No description provided'}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-blue-200 text-sm">
                        <CalendarIcon className="h-4 w-4 inline mr-1" />
                        Posted {new Date(job.postedAt || job.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/company/jobs/${job._id}`}
                          className="p-2 bg-blue-500 bg-opacity-30 text-blue-100 rounded-lg hover:bg-opacity-50 transition-all duration-200"
                          title="View Details"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Link>
                        <Link
                          to={`/company/jobs/${job._id}/edit`}
                          className="p-2 bg-green-500 bg-opacity-30 text-green-100 rounded-lg hover:bg-opacity-50 transition-all duration-200"
                          title="Edit Job"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => setDeleteModal({ show: true, jobId: job._id })}
                          className="p-2 bg-red-500 bg-opacity-30 text-red-100 rounded-lg hover:bg-opacity-50 transition-all duration-200"
                          title="Delete Job"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="glass-card p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-white mb-4">
              Confirm Delete
            </h3>
            <p className="text-blue-100 mb-6">
              Are you sure you want to delete this job posting? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end space-x-4">
              <button
                onClick={() => setDeleteModal({ show: false, jobId: null })}
                className="px-4 py-2 text-blue-200 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteJob(deleteModal.jobId)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Jobs;