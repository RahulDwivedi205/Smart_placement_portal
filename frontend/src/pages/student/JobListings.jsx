import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import BackButton from '../../components/common/BackButton';
import { useGamification } from '../../context/GamificationContext';
import { useNotification } from '../../context/NotificationContext';
import { 
  MagnifyingGlassIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  AcademicCapIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline';

const JobListings = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applying, setApplying] = useState({});
  const { awardXpToUser, updateUserStats } = useGamification();
  const { showNotification } = useNotification();
  const [filters, setFilters] = useState({
    search: '',
    branch: '',
    ctc: '',
    location: ''
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  });

  useEffect(() => {
    fetchJobs();
  }, [filters, pagination.currentPage]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.currentPage,
        limit: 12,
        ...filters
      });

      const response = await api.get(`/student/jobs/eligible?${params}`);
      if (response.data.success) {
        setJobs(response.data.data || []);
        setPagination({
          currentPage: 1,
          totalPages: 1,
          total: response.data.data?.length || 0
        });
      } else {
        setError(response.data.message || 'Failed to load jobs');
      }
    } catch (err) {
      setError('Failed to load jobs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  const handleApply = async (jobId) => {
    try {
      setApplying(prev => ({ ...prev, [jobId]: true }));
      const response = await api.post(`/student/jobs/${jobId}/apply`, {
        coverLetter: 'I am interested in this position and believe I would be a great fit based on my skills and academic background.'
      });
      
      if (response.data.success) {
        // Award XP for application
        const isFirstApplication = jobs.filter(job => job.hasApplied).length === 0;
        
        if (isFirstApplication) {
          awardXpToUser('first_application');
          showNotification('🚀 First Application Badge Earned! +25 XP', 'success');
        } else {
          awardXpToUser('application_submitted');
        }
        
        // Check for quick applier badge (5 applications in one day)
        const today = new Date().toDateString();
        const todayApplications = parseInt(localStorage.getItem(`applications_${today}`) || '0') + 1;
        localStorage.setItem(`applications_${today}`, todayApplications.toString());
        
        if (todayApplications === 5) {
          awardXpToUser('quick_applier', 35);
          showNotification('💨 Speed Demon Badge Earned! +35 XP', 'success');
        }
        
        showNotification('Application submitted successfully! 🎯', 'success');
        fetchJobs(); // Refresh to update application status
      } else {
        showNotification(response.data.message || 'Failed to apply', 'error');
      }
    } catch (err) {
      showNotification(err.response?.data?.message || 'Failed to apply', 'error');
    } finally {
      setApplying(prev => ({ ...prev, [jobId]: false }));
    }
  };

  const formatSalary = (ctc) => {
    if (ctc >= 1000000) {
      return `₹${(ctc / 1000000).toFixed(1)} LPA`;
    }
    return `₹${(ctc / 100000).toFixed(0)} LPA`;
  };

  if (loading && jobs.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 p-6">
      <div className="space-y-6">
        <BackButton to="/student" className="text-white hover:text-blue-200 hover:bg-white hover:bg-opacity-10" />
        
        <div className="glass-card p-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex items-center justify-center">
              <BriefcaseIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Job Opportunities</h1>
              <p className="text-blue-100 mt-1">
                Discover and apply to jobs that match your profile
              </p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-blue-100 mb-2">
                Search Jobs
              </label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-300" />
                <input
                  type="text"
                  placeholder="Job title, company..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="glass-input pl-10 w-full px-4 py-3"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-100 mb-2">
                Branch
              </label>
              <select
                value={filters.branch}
                onChange={(e) => handleFilterChange('branch', e.target.value)}
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

            <div>
              <label className="block text-sm font-medium text-blue-100 mb-2">
                Salary Range
              </label>
              <select
                value={filters.ctc}
                onChange={(e) => handleFilterChange('ctc', e.target.value)}
                className="glass-input w-full px-4 py-3"
              >
                <option value="">Any Salary</option>
                <option value="0-5">0-5 LPA</option>
                <option value="5-10">5-10 LPA</option>
                <option value="10-15">10-15 LPA</option>
                <option value="15-20">15-20 LPA</option>
                <option value="20">20+ LPA</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-100 mb-2">
                Location
              </label>
              <input
                type="text"
                placeholder="City, State"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="glass-input w-full px-4 py-3"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-blue-200">
            Showing {jobs.length} of {pagination.total} jobs
          </p>
        </div>

        {error && (
          <div className="glass-card bg-red-500 bg-opacity-20 border-red-300 text-red-100 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <div key={job._id} className="glass-card p-6 hover:bg-white hover:bg-opacity-20 transition-all duration-300 transform hover:scale-105">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="bg-blue-400 bg-opacity-30 rounded-xl p-3">
                    <BuildingOfficeIcon className="h-6 w-6 text-blue-200" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-white">
                      {job.jobDetails?.title}
                    </h3>
                    <p className="text-sm text-blue-200">
                      {job.companyId?.companyInfo?.name || 'Company Name'}
                    </p>
                  </div>
                </div>
                {job.eligibilityScore && (
                  <div className="text-right">
                    <div className="text-sm font-medium text-green-300">
                      {job.eligibilityScore}% Match
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-blue-200">
                  <MapPinIcon className="h-4 w-4 mr-2" />
                  {job.jobDetails?.location || 'Location not specified'}
                </div>
                
                <div className="flex items-center text-sm text-blue-200">
                  <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                  {formatSalary(job.package?.ctc)}
                </div>
                
                <div className="flex items-center text-sm text-blue-200">
                  <AcademicCapIcon className="h-4 w-4 mr-2" />
                  Min CGPA: {job.eligibility?.minimumCGPA}
                </div>
                
                <div className="flex items-center text-sm text-blue-200">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Apply by: {new Date(job.applicationDeadline).toLocaleDateString()}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-blue-100 line-clamp-3">
                  {job.jobDetails?.description}
                </p>
              </div>

              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {job.eligibility?.requiredSkills?.slice(0, 3).map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500 bg-opacity-30 text-blue-100 border border-blue-400"
                    >
                      {skill}
                    </span>
                  ))}
                  {job.eligibility?.requiredSkills?.length > 3 && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white bg-opacity-20 text-blue-200 border border-white border-opacity-30">
                      +{job.eligibility.requiredSkills.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    job.jobDetails?.type === 'fulltime' 
                      ? 'bg-green-500 bg-opacity-30 text-green-200 border border-green-400'
                      : 'bg-yellow-500 bg-opacity-30 text-yellow-200 border border-yellow-400'
                  }`}>
                    {job.jobDetails?.type === 'fulltime' ? 'Full-time' : job.jobDetails?.type || 'Full-time'}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500 bg-opacity-30 text-purple-200 border border-purple-400">
                    {job.requirements?.experience || 'Fresher'}
                  </span>
                </div>
                
                <div className="flex space-x-2">
                  <Link
                    to={`/student/jobs/${job._id}`}
                    className="px-4 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-xl text-sm font-medium text-white hover:bg-opacity-30 transition-all duration-300"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() => handleApply(job._id)}
                    disabled={applying[job._id] || job.hasApplied}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                      job.hasApplied 
                        ? 'bg-green-500 bg-opacity-30 text-green-200 border border-green-400 cursor-not-allowed'
                        : applying[job._id]
                        ? 'bg-gray-500 bg-opacity-30 text-gray-200 border border-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600'
                    }`}
                  >
                    {job.hasApplied ? 'Applied' : applying[job._id] ? 'Applying...' : 'Apply Now'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2">
            <button
              onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
              disabled={pagination.currentPage === 1}
              className="px-4 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-xl text-sm font-medium text-white hover:bg-opacity-30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              Previous
            </button>
            
            <span className="px-4 py-2 text-sm text-blue-200">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            
            <button
              onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
              disabled={pagination.currentPage === pagination.totalPages}
              className="px-4 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-xl text-sm font-medium text-white hover:bg-opacity-30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
            >
              Next
            </button>
          </div>
        )}

        {jobs.length === 0 && !loading && (
          <div className="text-center py-12">
            <BuildingOfficeIcon className="mx-auto h-12 w-12 text-blue-300" />
            <h3 className="mt-2 text-sm font-medium text-white">No jobs found</h3>
            <p className="mt-1 text-sm text-blue-200">
              Try adjusting your filters to see more opportunities.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobListings;