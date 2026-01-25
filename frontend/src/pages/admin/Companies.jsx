import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { 
  BuildingOfficeIcon,
  PlusIcon,
  PencilIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('view'); // 'view', 'edit', 'add'
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    industry: ''
  });

  useEffect(() => {
    fetchCompanies();
  }, [filters]);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams(filters);
      const response = await api.get(`/admin/companies?${params}`);
      if (response.data.success) {
        setCompanies(response.data.data || []);
      } else {
        setError(response.data.message || 'Failed to load companies');
      }
    } catch (err) {
      setError('Failed to load companies');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (companyId, status) => {
    try {
      const response = await api.put(`/admin/companies/${companyId}/status`, { status });
      if (response.data.success) {
        fetchCompanies();
        alert(`Company ${status} successfully!`);
      }
    } catch (err) {
      alert('Failed to update company status');
      console.error(err);
    }
  };

  const openModal = (type, company = null) => {
    setModalType(type);
    setSelectedCompany(company);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCompany(null);
    setModalType('view');
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
                <BuildingOfficeIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Company Management</h1>
                <p className="text-blue-100 mt-1">
                  Manage company registrations and placement partnerships
                </p>
              </div>
            </div>
            <button
              onClick={() => openModal('add')}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium hover:from-green-600 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Add Company</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="glass-card p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-blue-100 mb-2">
                Search Companies
              </label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-300" />
                <input
                  type="text"
                  placeholder="Company name..."
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
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-100 mb-2">
                Industry
              </label>
              <select
                value={filters.industry}
                onChange={(e) => setFilters(prev => ({ ...prev, industry: e.target.value }))}
                className="glass-input w-full px-4 py-3"
              >
                <option value="">All Industries</option>
                <option value="Technology">Technology</option>
                <option value="Finance">Finance</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Consulting">Consulting</option>
              </select>
            </div>
          </div>
        </div>

        {/* Companies List */}
        {error && (
          <div className="glass-card bg-red-500 bg-opacity-20 border-red-300 text-red-100 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <div className="glass-card">
          <div className="px-6 py-4 border-b border-white border-opacity-20">
            <h2 className="text-xl font-semibold text-white">
              Companies ({companies.length})
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white bg-opacity-5">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-200 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-200 uppercase tracking-wider">
                    Industry
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-200 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-200 uppercase tracking-wider">
                    Jobs Posted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-200 uppercase tracking-wider">
                    Applications
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-blue-200 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white divide-opacity-10">
                {companies.map((company) => (
                  <tr key={company._id} className="hover:bg-white hover:bg-opacity-5">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="bg-blue-400 bg-opacity-30 rounded-lg p-2">
                          <BuildingOfficeIcon className="h-5 w-5 text-blue-200" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-white">
                            {company.companyInfo?.name}
                          </div>
                          <div className="text-sm text-blue-200">
                            {company.companyInfo?.website}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-200">
                      {company.companyInfo?.industry}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        company.status === 'approved' 
                          ? 'bg-green-500 bg-opacity-20 text-green-200 border border-green-400'
                          : company.status === 'rejected'
                          ? 'bg-red-500 bg-opacity-20 text-red-200 border border-red-400'
                          : 'bg-yellow-500 bg-opacity-20 text-yellow-200 border border-yellow-400'
                      }`}>
                        {company.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-200">
                      {company.jobsPosted || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-200">
                      {company.totalApplications || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openModal('view', company)}
                          className="text-blue-300 hover:text-blue-100 transition-colors"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => openModal('edit', company)}
                          className="text-yellow-300 hover:text-yellow-100 transition-colors"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        {company.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(company._id, 'approved')}
                              className="text-green-300 hover:text-green-100 transition-colors"
                            >
                              <CheckCircleIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(company._id, 'rejected')}
                              className="text-red-300 hover:text-red-100 transition-colors"
                            >
                              <XCircleIcon className="h-5 w-5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {companies.length === 0 && (
            <div className="text-center py-12">
              <BuildingOfficeIcon className="mx-auto h-12 w-12 text-blue-300" />
              <h3 className="mt-2 text-sm font-medium text-white">No companies found</h3>
              <p className="mt-1 text-sm text-blue-200">
                No companies match your current filters.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <CompanyModal
          company={selectedCompany}
          type={modalType}
          onClose={closeModal}
          onSave={fetchCompanies}
        />
      )}
    </div>
  );
};

const CompanyModal = ({ company, type, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    companyInfo: {
      name: '',
      industry: '',
      size: '',
      website: '',
      description: '',
      address: ''
    },
    contactInfo: {
      hrName: '',
      hrEmail: '',
      hrPhone: ''
    }
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (company && (type === 'view' || type === 'edit')) {
      setFormData({
        companyInfo: company.companyInfo || {},
        contactInfo: company.contactInfo || {}
      });
    }
  }, [company, type]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const endpoint = type === 'add' ? '/admin/companies' : `/admin/companies/${company._id}`;
      const method = type === 'add' ? 'post' : 'put';
      
      const response = await api[method](endpoint, formData);
      if (response.data.success) {
        onSave();
        onClose();
        alert(`Company ${type === 'add' ? 'added' : 'updated'} successfully!`);
      }
    } catch (err) {
      alert(`Failed to ${type} company`);
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const updateField = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              {type === 'add' ? 'Add Company' : type === 'edit' ? 'Edit Company' : 'Company Details'}
            </h2>
            <button
              onClick={onClose}
              className="text-blue-200 hover:text-white transition-colors"
            >
              <XCircleIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Company Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-100 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={formData.companyInfo.name || ''}
                    onChange={(e) => updateField('companyInfo', 'name', e.target.value)}
                    disabled={type === 'view'}
                    className="glass-input w-full px-4 py-3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-100 mb-2">
                    Industry
                  </label>
                  <select
                    value={formData.companyInfo.industry || ''}
                    onChange={(e) => updateField('companyInfo', 'industry', e.target.value)}
                    disabled={type === 'view'}
                    className="glass-input w-full px-4 py-3"
                  >
                    <option value="">Select Industry</option>
                    <option value="Technology">Technology</option>
                    <option value="Finance">Finance</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Consulting">Consulting</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-100 mb-2">
                    Company Size
                  </label>
                  <select
                    value={formData.companyInfo.size || ''}
                    onChange={(e) => updateField('companyInfo', 'size', e.target.value)}
                    disabled={type === 'view'}
                    className="glass-input w-full px-4 py-3"
                  >
                    <option value="">Select Size</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-1000">201-1000 employees</option>
                    <option value="1000+">1000+ employees</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-100 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    value={formData.companyInfo.website || ''}
                    onChange={(e) => updateField('companyInfo', 'website', e.target.value)}
                    disabled={type === 'view'}
                    className="glass-input w-full px-4 py-3"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-blue-100 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.companyInfo.description || ''}
                  onChange={(e) => updateField('companyInfo', 'description', e.target.value)}
                  disabled={type === 'view'}
                  rows={3}
                  className="glass-input w-full px-4 py-3"
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-blue-100 mb-2">
                  Address
                </label>
                <textarea
                  value={formData.companyInfo.address || ''}
                  onChange={(e) => updateField('companyInfo', 'address', e.target.value)}
                  disabled={type === 'view'}
                  rows={2}
                  className="glass-input w-full px-4 py-3"
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-white mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-100 mb-2">
                    HR Name
                  </label>
                  <input
                    type="text"
                    value={formData.contactInfo.hrName || ''}
                    onChange={(e) => updateField('contactInfo', 'hrName', e.target.value)}
                    disabled={type === 'view'}
                    className="glass-input w-full px-4 py-3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-100 mb-2">
                    HR Email
                  </label>
                  <input
                    type="email"
                    value={formData.contactInfo.hrEmail || ''}
                    onChange={(e) => updateField('contactInfo', 'hrEmail', e.target.value)}
                    disabled={type === 'view'}
                    className="glass-input w-full px-4 py-3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-100 mb-2">
                    HR Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.contactInfo.hrPhone || ''}
                    onChange={(e) => updateField('contactInfo', 'hrPhone', e.target.value)}
                    disabled={type === 'view'}
                    className="glass-input w-full px-4 py-3"
                  />
                </div>
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

export default Companies;