import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { 
  ClipboardDocumentListIcon,
  CalendarIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

const PlacementProcess = () => {
  const [processes, setProcesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProcess, setSelectedProcess] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('view');
  const [stats, setStats] = useState({
    totalProcesses: 0,
    activeProcesses: 0,
    completedProcesses: 0,
    totalStudentsPlaced: 0
  });

  useEffect(() => {
    fetchProcesses();
    fetchStats();
  }, []);

  const fetchProcesses = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/placement-processes');
      if (response.data.success) {
        setProcesses(response.data.data || []);
      } else {
        setError(response.data.message || 'Failed to load placement processes');
      }
    } catch (err) {
      setError('Failed to load placement processes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/placement-processes/stats');
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  const openModal = (type, process = null) => {
    setModalType(type);
    setSelectedProcess(process);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProcess(null);
    setModalType('view');
  };

  const handleDelete = async (processId) => {
    if (window.confirm('Are you sure you want to delete this placement process?')) {
      try {
        const response = await api.delete(`/admin/placement-processes/${processId}`);
        if (response.data.success) {
          fetchProcesses();
          fetchStats();
          alert('Placement process deleted successfully!');
        }
      } catch (err) {
        alert('Failed to delete placement process');
        console.error(err);
      }
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
        {/* Header */}
        <div className="glass-card p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex items-center justify-center">
                <ClipboardDocumentListIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Placement Process Management</h1>
                <p className="text-blue-100 mt-1">
                  Manage and track placement drives and recruitment processes
                </p>
              </div>
            </div>
            <button
              onClick={() => openModal('add')}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
            >
              <PlusIcon className="h-5 w-5" />
              <span>New Process</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { title: 'Total Processes', value: stats.totalProcesses, color: 'bg-blue-500', icon: ClipboardDocumentListIcon },
            { title: 'Active Processes', value: stats.activeProcesses, color: 'bg-green-500', icon: CalendarIcon },
            { title: 'Completed', value: stats.completedProcesses, color: 'bg-purple-500', icon: ChartBarIcon },
            { title: 'Students Placed', value: stats.totalStudentsPlaced, color: 'bg-indigo-500', icon: UserGroupIcon }
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

        {/* Processes List */}
        {error && (
          <div className="glass-card bg-red-500 bg-opacity-20 border-red-300 text-red-100 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {processes.map((process) => (
            <div key={process._id} className="glass-card p-6 hover:bg-white hover:bg-opacity-20 transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="bg-blue-400 bg-opacity-30 rounded-xl p-3">
                    <BuildingOfficeIcon className="h-6 w-6 text-blue-200" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-white">
                      {process.companyId?.companyInfo?.name}
                    </h3>
                    <p className="text-sm text-blue-200">
                      {process.title}
                    </p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  process.status === 'active' 
                    ? 'bg-green-500 bg-opacity-20 text-green-200 border border-green-400'
                    : process.status === 'completed'
                    ? 'bg-blue-500 bg-opacity-20 text-blue-200 border border-blue-400'
                    : 'bg-yellow-500 bg-opacity-20 text-yellow-200 border border-yellow-400'
                }`}>
                  {process.status.toUpperCase()}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-blue-200">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  {new Date(process.startDate).toLocaleDateString()} - {new Date(process.endDate).toLocaleDateString()}
                </div>
                
                <div className="flex items-center text-sm text-blue-200">
                  <UserGroupIcon className="h-4 w-4 mr-2" />
                  {process.eligibleStudents?.length || 0} eligible students
                </div>
                
                <div className="flex items-center text-sm text-blue-200">
                  <ChartBarIcon className="h-4 w-4 mr-2" />
                  {process.applicationsReceived || 0} applications received
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-blue-100 line-clamp-2">
                  {process.description}
                </p>
              </div>

              {/* Process Stages */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-white mb-2">Process Stages</h4>
                <div className="flex flex-wrap gap-2">
                  {process.stages?.map((stage, index) => (
                    <span
                      key={index}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        stage.completed
                          ? 'bg-green-500 bg-opacity-30 text-green-200 border border-green-400'
                          : stage.active
                          ? 'bg-blue-500 bg-opacity-30 text-blue-200 border border-blue-400'
                          : 'bg-gray-500 bg-opacity-30 text-gray-200 border border-gray-400'
                      }`}
                    >
                      {stage.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-blue-200">
                  Created: {new Date(process.createdAt).toLocaleDateString()}
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => openModal('view', process)}
                    className="text-blue-300 hover:text-blue-100 transition-colors"
                  >
                    <EyeIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => openModal('edit', process)}
                    className="text-yellow-300 hover:text-yellow-100 transition-colors"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(process._id)}
                    className="text-red-300 hover:text-red-100 transition-colors"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {processes.length === 0 && (
          <div className="text-center py-12">
            <ClipboardDocumentListIcon className="mx-auto h-12 w-12 text-blue-300" />
            <h3 className="mt-2 text-sm font-medium text-white">No placement processes found</h3>
            <p className="mt-1 text-sm text-blue-200">
              Create your first placement process to get started.
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <ProcessModal
          process={selectedProcess}
          type={modalType}
          onClose={closeModal}
          onSave={() => {
            fetchProcesses();
            fetchStats();
          }}
        />
      )}
    </div>
  );
};

const ProcessModal = ({ process, type, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    companyId: '',
    description: '',
    startDate: '',
    endDate: '',
    status: 'planned',
    eligibilityCriteria: {
      minimumCGPA: 6.0,
      allowedBranches: [],
      maximumBacklogs: 0,
      minimumTenthMarks: 60,
      minimumTwelfthMarks: 60
    },
    stages: [
      { name: 'Application', active: true, completed: false },
      { name: 'Aptitude Test', active: false, completed: false },
      { name: 'Technical Interview', active: false, completed: false },
      { name: 'HR Interview', active: false, completed: false },
      { name: 'Final Selection', active: false, completed: false }
    ]
  });
  const [companies, setCompanies] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCompanies();
    if (process && (type === 'view' || type === 'edit')) {
      setFormData({
        title: process.title || '',
        companyId: process.companyId?._id || '',
        description: process.description || '',
        startDate: process.startDate ? new Date(process.startDate).toISOString().split('T')[0] : '',
        endDate: process.endDate ? new Date(process.endDate).toISOString().split('T')[0] : '',
        status: process.status || 'planned',
        eligibilityCriteria: process.eligibilityCriteria || formData.eligibilityCriteria,
        stages: process.stages || formData.stages
      });
    }
  }, [process, type]);

  const fetchCompanies = async () => {
    try {
      const response = await api.get('/admin/companies?status=approved');
      if (response.data.success) {
        setCompanies(response.data.data || []);
      }
    } catch (err) {
      console.error('Failed to load companies:', err);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const endpoint = type === 'add' ? '/admin/placement-processes' : `/admin/placement-processes/${process._id}`;
      const method = type === 'add' ? 'post' : 'put';
      
      const response = await api[method](endpoint, formData);
      if (response.data.success) {
        onSave();
        onClose();
        alert(`Placement process ${type === 'add' ? 'created' : 'updated'} successfully!`);
      }
    } catch (err) {
      alert(`Failed to ${type} placement process`);
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateEligibility = (field, value) => {
    setFormData(prev => ({
      ...prev,
      eligibilityCriteria: {
        ...prev.eligibilityCriteria,
        [field]: value
      }
    }));
  };

  const updateStage = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      stages: prev.stages.map((stage, i) => 
        i === index ? { ...stage, [field]: value } : stage
      )
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="glass-card max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              {type === 'add' ? 'Create Placement Process' : type === 'edit' ? 'Edit Placement Process' : 'Process Details'}
            </h2>
            <button
              onClick={onClose}
              className="text-blue-200 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-100 mb-2">
                    Process Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => updateField('title', e.target.value)}
                    disabled={type === 'view'}
                    className="glass-input w-full px-4 py-3"
                    placeholder="e.g., Software Developer Recruitment 2024"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-100 mb-2">
                    Company
                  </label>
                  <select
                    value={formData.companyId}
                    onChange={(e) => updateField('companyId', e.target.value)}
                    disabled={type === 'view'}
                    className="glass-input w-full px-4 py-3"
                  >
                    <option value="">Select Company</option>
                    {companies.map((company) => (
                      <option key={company._id} value={company._id}>
                        {company.companyInfo?.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-100 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => updateField('startDate', e.target.value)}
                    disabled={type === 'view'}
                    className="glass-input w-full px-4 py-3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-100 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => updateField('endDate', e.target.value)}
                    disabled={type === 'view'}
                    className="glass-input w-full px-4 py-3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-100 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => updateField('status', e.target.value)}
                    disabled={type === 'view'}
                    className="glass-input w-full px-4 py-3"
                  >
                    <option value="planned">Planned</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-blue-100 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  disabled={type === 'view'}
                  rows={3}
                  className="glass-input w-full px-4 py-3"
                  placeholder="Describe the placement process..."
                />
              </div>
            </div>

            {/* Eligibility Criteria */}
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Eligibility Criteria</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-100 mb-2">
                    Minimum CGPA
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={formData.eligibilityCriteria.minimumCGPA}
                    onChange={(e) => updateEligibility('minimumCGPA', parseFloat(e.target.value))}
                    disabled={type === 'view'}
                    className="glass-input w-full px-4 py-3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-100 mb-2">
                    Maximum Backlogs
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.eligibilityCriteria.maximumBacklogs}
                    onChange={(e) => updateEligibility('maximumBacklogs', parseInt(e.target.value))}
                    disabled={type === 'view'}
                    className="glass-input w-full px-4 py-3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-100 mb-2">
                    Minimum 10th Marks (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.eligibilityCriteria.minimumTenthMarks}
                    onChange={(e) => updateEligibility('minimumTenthMarks', parseFloat(e.target.value))}
                    disabled={type === 'view'}
                    className="glass-input w-full px-4 py-3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-100 mb-2">
                    Minimum 12th Marks (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.eligibilityCriteria.minimumTwelfthMarks}
                    onChange={(e) => updateEligibility('minimumTwelfthMarks', parseFloat(e.target.value))}
                    disabled={type === 'view'}
                    className="glass-input w-full px-4 py-3"
                  />
                </div>
              </div>
            </div>

            {/* Process Stages */}
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Process Stages</h3>
              <div className="space-y-3">
                {formData.stages.map((stage, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white bg-opacity-10 rounded-xl">
                    <div className="flex items-center space-x-4">
                      <span className="text-white font-medium">{stage.name}</span>
                    </div>
                    {type !== 'view' && (
                      <div className="flex items-center space-x-4">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={stage.active}
                            onChange={(e) => updateStage(index, 'active', e.target.checked)}
                            className="rounded"
                          />
                          <span className="text-sm text-blue-200">Active</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={stage.completed}
                            onChange={(e) => updateStage(index, 'completed', e.target.checked)}
                            className="rounded"
                          />
                          <span className="text-sm text-blue-200">Completed</span>
                        </label>
                      </div>
                    )}
                    {type === 'view' && (
                      <div className="flex space-x-2">
                        {stage.completed && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500 bg-opacity-30 text-green-200 border border-green-400">
                            Completed
                          </span>
                        )}
                        {stage.active && !stage.completed && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500 bg-opacity-30 text-blue-200 border border-blue-400">
                            Active
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {type !== 'view' && (
            <div className="flex justify-end space-x-4 mt-8">
              <button
                onClick={onClose}
                className="px-6 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-xl text-white hover:bg-opacity-30 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-medium hover:from-blue-600 hover:to-indigo-600 disabled:opacity-50 transition-all duration-300"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlacementProcess;