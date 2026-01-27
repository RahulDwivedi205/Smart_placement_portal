import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';
import BackButton from '../../components/common/BackButton';
import { 
  BriefcaseIcon,
  XMarkIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

const JobForm = () => {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const isEdit = Boolean(jobId);

  const [job, setJob] = useState({
    jobDetails: {
      title: '',
      description: '',
      location: '',
      type: 'fulltime',
      workMode: 'onsite',
      duration: ''
    },
    package: {
      ctc: '',
      baseSalary: '',
      stipend: ''
    },
    eligibility: {
      branches: [],
      minimumCGPA: 6.0,
      allowBacklogs: false,
      maxBacklogs: 0,
      batch: [],
      requiredSkills: []
    },
    requirements: {
      experience: '',
      education: '',
      additionalRequirements: []
    },
    applicationDeadline: '',
    status: 'active'
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isEdit) {
      fetchJob();
    }
  }, [jobId, isEdit]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/company/jobs/${jobId}`);
      if (response.data) {
        setJob({
          jobDetails: {
            title: response.data.jobDetails?.title || '',
            description: response.data.jobDetails?.description || '',
            location: response.data.jobDetails?.location || '',
            type: response.data.jobDetails?.type || 'fulltime',
            workMode: response.data.jobDetails?.workMode || 'onsite',
            duration: response.data.jobDetails?.duration || ''
          },
          package: {
            ctc: response.data.package?.ctc || '',
            baseSalary: response.data.package?.baseSalary || '',
            stipend: response.data.package?.stipend || ''
          },
          eligibility: {
            branches: response.data.eligibility?.branches || [],
            minimumCGPA: response.data.eligibility?.minimumCGPA || 6.0,
            allowBacklogs: response.data.eligibility?.allowBacklogs || false,
            maxBacklogs: response.data.eligibility?.maxBacklogs || 0,
            batch: response.data.eligibility?.batch || [],
            requiredSkills: response.data.eligibility?.requiredSkills || []
          },
          requirements: {
            experience: response.data.requirements?.experience || '',
            education: response.data.requirements?.education || '',
            additionalRequirements: response.data.requirements?.additionalRequirements || []
          },
          applicationDeadline: response.data.applicationDeadline ? 
            new Date(response.data.applicationDeadline).toISOString().split('T')[0] : '',
          status: response.data.status || 'active'
        });
      }
    } catch (err) {
      console.error('Failed to fetch job:', err);
      setError('Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      // Validate required fields
      const requiredFields = [
        { field: job.jobDetails.title, name: 'Job Title' },
        { field: job.jobDetails.description, name: 'Job Description' },
        { field: job.jobDetails.location, name: 'Location' },
        { field: job.package.ctc, name: 'CTC' }
      ];

      const missingFields = requiredFields.filter(item => !item.field || item.field === '');
      
      if (missingFields.length > 0) {
        setError(`Please fill in the following required fields: ${missingFields.map(item => item.name).join(', ')}`);
        return;
      }

      if (job.eligibility.branches.length === 0) {
        setError('Please select at least one eligible branch');
        return;
      }

      // Convert data types
      const jobToSave = {
        ...job,
        package: {
          ...job.package,
          ctc: parseFloat(job.package.ctc) || 0,
          baseSalary: parseFloat(job.package.baseSalary) || undefined,
          stipend: parseFloat(job.package.stipend) || undefined
        },
        eligibility: {
          ...job.eligibility,
          minimumCGPA: parseFloat(job.eligibility.minimumCGPA) || 6.0,
          maxBacklogs: parseInt(job.eligibility.maxBacklogs) || 0,
          batch: job.eligibility.batch.map(b => parseInt(b)).filter(b => !isNaN(b))
        },
        applicationDeadline: job.applicationDeadline ? new Date(job.applicationDeadline) : null
      };

      let response;
      if (isEdit) {
        response = await api.put(`/company/jobs/${jobId}`, jobToSave);
      } else {
        response = await api.post('/company/jobs', jobToSave);
      }

      if (response.data) {
        setSuccess(`Job ${isEdit ? 'updated' : 'created'} successfully!`);
        setTimeout(() => {
          navigate('/company/jobs');
        }, 2000);
      }
    } catch (err) {
      console.error('Save error:', err);
      setError(err.response?.data?.message || `Failed to ${isEdit ? 'update' : 'create'} job`);
    } finally {
      setSaving(false);
    }
  };

  const updateJob = (section, field, value) => {
    setJob(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const addItem = (section, field, item) => {
    if (!item.trim()) return;
    
    setJob(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: [...prev[section][field], item.trim()]
      }
    }));
  };

  const removeItem = (section, field, index) => {
    setJob(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: prev[section][field].filter((_, i) => i !== index)
      }
    }));
  };

  const addBranch = (branch) => {
    if (!branch || job.eligibility.branches.includes(branch)) return;
    
    setJob(prev => ({
      ...prev,
      eligibility: {
        ...prev.eligibility,
        branches: [...prev.eligibility.branches, branch]
      }
    }));
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
        <BackButton to="/company/jobs" className="text-white hover:text-blue-200 hover:bg-white hover:bg-opacity-10" />
        
        <div className="glass-card p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex items-center justify-center">
                <BriefcaseIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  {isEdit ? 'Edit Job' : 'Post New Job'}
                </h1>
                <p className="text-blue-100 mt-1">
                  {isEdit ? 'Update job details and requirements' : 'Create a new job posting to attract candidates'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/company/jobs')}
                className="px-4 py-2 text-blue-200 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-medium hover:from-blue-600 hover:to-indigo-600 disabled:opacity-50 transition-all duration-300 transform hover:scale-105"
              >
                {saving ? 'Saving...' : (isEdit ? 'Update Job' : 'Post Job')}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="glass-card bg-red-500 bg-opacity-20 border-red-300 text-red-100 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {success && (
          <div className="glass-card bg-green-500 bg-opacity-20 border-green-300 text-green-100 px-4 py-3 rounded-xl">
            {success}
          </div>
        )}

        <div className="glass-card p-6">
          <div className="space-y-8">
            {/* Job Details Section */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Job Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-blue-100 mb-2">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    value={job.jobDetails.title}
                    onChange={(e) => updateJob('jobDetails', 'title', e.target.value)}
                    className="glass-input w-full px-4 py-3"
                    placeholder="e.g., Software Engineer"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-blue-100 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    value={job.jobDetails.location}
                    onChange={(e) => updateJob('jobDetails', 'location', e.target.value)}
                    className="glass-input w-full px-4 py-3"
                    placeholder="e.g., Bangalore, India"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-blue-100 mb-2">
                    Job Type
                  </label>
                  <select
                    value={job.jobDetails.type}
                    onChange={(e) => updateJob('jobDetails', 'type', e.target.value)}
                    className="glass-input w-full px-4 py-3"
                  >
                    <option value="fulltime">Full Time</option>
                    <option value="parttime">Part Time</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-blue-100 mb-2">
                    Work Mode
                  </label>
                  <select
                    value={job.jobDetails.workMode}
                    onChange={(e) => updateJob('jobDetails', 'workMode', e.target.value)}
                    className="glass-input w-full px-4 py-3"
                  >
                    <option value="onsite">On-site</option>
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-blue-100 mb-2">
                    Application Deadline
                  </label>
                  <input
                    type="date"
                    value={job.applicationDeadline}
                    onChange={(e) => setJob(prev => ({ ...prev, applicationDeadline: e.target.value }))}
                    className="glass-input w-full px-4 py-3"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-blue-100 mb-2">
                    Job Description *
                  </label>
                  <textarea
                    value={job.jobDetails.description}
                    onChange={(e) => updateJob('jobDetails', 'description', e.target.value)}
                    className="glass-input w-full px-4 py-3"
                    rows="6"
                    placeholder="Describe the role, responsibilities, and what you're looking for in a candidate..."
                  />
                </div>
              </div>
            </div>

            {/* Requirements Section */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Eligibility & Requirements</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-blue-100 mb-2">
                    Minimum CGPA
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={job.eligibility.minimumCGPA}
                    onChange={(e) => updateJob('eligibility', 'minimumCGPA', e.target.value)}
                    className="glass-input w-full px-4 py-3"
                    placeholder="e.g., 6.0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-blue-100 mb-2">
                    Allow Backlogs
                  </label>
                  <select
                    value={job.eligibility.allowBacklogs}
                    onChange={(e) => updateJob('eligibility', 'allowBacklogs', e.target.value === 'true')}
                    className="glass-input w-full px-4 py-3"
                  >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                </div>
                
                {job.eligibility.allowBacklogs && (
                  <div>
                    <label className="block text-sm font-medium text-blue-100 mb-2">
                      Maximum Backlogs
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={job.eligibility.maxBacklogs}
                      onChange={(e) => updateJob('eligibility', 'maxBacklogs', e.target.value)}
                      className="glass-input w-full px-4 py-3"
                      placeholder="e.g., 2"
                    />
                  </div>
                )}
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-blue-100 mb-2">
                    Eligible Branches *
                  </label>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.eligibility.branches.map((branch, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500 bg-opacity-30 text-blue-100 border border-blue-400"
                      >
                        {branch}
                        <button
                          onClick={() => removeItem('eligibility', 'branches', index)}
                          className="ml-2 text-blue-200 hover:text-white"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        addBranch(e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="glass-input w-full px-4 py-3"
                  >
                    <option value="">Select Branch to Add</option>
                    <option value="CSE">Computer Science Engineering</option>
                    <option value="IT">Information Technology</option>
                    <option value="ECE">Electronics & Communication</option>
                    <option value="EEE">Electrical & Electronics</option>
                    <option value="MECH">Mechanical Engineering</option>
                    <option value="CIVIL">Civil Engineering</option>
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-blue-100 mb-2">
                    Required Skills
                  </label>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.eligibility.requiredSkills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-500 bg-opacity-30 text-green-100 border border-green-400"
                      >
                        {skill}
                        <button
                          onClick={() => removeItem('eligibility', 'requiredSkills', index)}
                          className="ml-2 text-green-200 hover:text-white"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex">
                    <input
                      type="text"
                      placeholder="Add required skill"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addItem('eligibility', 'requiredSkills', e.target.value);
                          e.target.value = '';
                        }
                      }}
                      className="glass-input flex-1 rounded-r-none px-4 py-3"
                    />
                    <button
                      onClick={(e) => {
                        const input = e.target.previousElementSibling;
                        addItem('eligibility', 'requiredSkills', input.value);
                        input.value = '';
                      }}
                      className="px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-r-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300"
                    >
                      <PlusIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-blue-100 mb-2">
                    Experience Requirements
                  </label>
                  <textarea
                    value={job.requirements.experience}
                    onChange={(e) => updateJob('requirements', 'experience', e.target.value)}
                    className="glass-input w-full px-4 py-3"
                    rows="3"
                    placeholder="Describe any specific experience requirements..."
                  />
                </div>
              </div>
            </div>

            {/* Compensation Section */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Package Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-blue-100 mb-2">
                    CTC (LPA) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={job.package.ctc}
                    onChange={(e) => updateJob('package', 'ctc', e.target.value)}
                    className="glass-input w-full px-4 py-3"
                    placeholder="e.g., 12.5"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-blue-100 mb-2">
                    Base Salary (LPA)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={job.package.baseSalary}
                    onChange={(e) => updateJob('package', 'baseSalary', e.target.value)}
                    className="glass-input w-full px-4 py-3"
                    placeholder="e.g., 10.0"
                  />
                </div>
                
                {job.jobDetails.type === 'internship' && (
                  <div>
                    <label className="block text-sm font-medium text-blue-100 mb-2">
                      Stipend (per month)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={job.package.stipend}
                      onChange={(e) => updateJob('package', 'stipend', e.target.value)}
                      className="glass-input w-full px-4 py-3"
                      placeholder="e.g., 25000"
                    />
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-blue-100 mb-2">
                    Status
                  </label>
                  <select
                    value={job.status}
                    onChange={(e) => setJob(prev => ({ ...prev, status: e.target.value }))}
                    className="glass-input w-full px-4 py-3"
                  >
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobForm;