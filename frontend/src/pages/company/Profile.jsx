import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { 
  BuildingOfficeIcon, 
  UserIcon, 
  ChartBarIcon
} from '@heroicons/react/24/outline';

const CompanyProfile = () => {
  const [profile, setProfile] = useState({
    companyInfo: {
      name: '',
      industry: '',
      size: '',
      website: '',
      description: '',
      headquarters: '',
      founded: ''
    },
    hrDetails: {
      name: '',
      designation: '',
      phone: '',
      alternateEmail: ''
    },
    companyStats: {
      totalHires: 0,
      averagePackage: '',
      successRate: 0,
      rating: 0
    },
    preferences: {
      preferredBranches: [],
      minimumCGPA: 6.0,
      allowBacklogs: false,
      maxBacklogs: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('company');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/company/profile');
      console.log('Profile response:', response.data);
      
      if (response.data && !response.data.message) {
        setProfile({
          companyInfo: {
            name: response.data.companyInfo?.name || '',
            industry: response.data.companyInfo?.industry || '',
            size: response.data.companyInfo?.size || '',
            website: response.data.companyInfo?.website || '',
            description: response.data.companyInfo?.description || '',
            headquarters: response.data.companyInfo?.headquarters || '',
            founded: response.data.companyInfo?.founded || ''
          },
          hrDetails: {
            name: response.data.hrDetails?.name || '',
            designation: response.data.hrDetails?.designation || '',
            phone: response.data.hrDetails?.phone || '',
            alternateEmail: response.data.hrDetails?.alternateEmail || ''
          },
          companyStats: {
            totalHires: response.data.companyStats?.totalHires || 0,
            averagePackage: response.data.companyStats?.averagePackage || '',
            successRate: response.data.companyStats?.successRate || 0,
            rating: response.data.companyStats?.rating || 0
          },
          preferences: {
            preferredBranches: response.data.preferences?.preferredBranches || [],
            minimumCGPA: response.data.preferences?.minimumCGPA || 6.0,
            allowBacklogs: response.data.preferences?.allowBacklogs || false,
            maxBacklogs: response.data.preferences?.maxBacklogs || 0
          }
        });
        setError('');
      } else {
        console.log('No existing profile found, using default values');
        setError('');
      }
    } catch (err) {
      console.error('Profile fetch error:', err);
      if (err.response?.status === 404) {
        console.log('Profile not found, using default values');
        setError('');
      } else {
        setError('Failed to load profile');
      }
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
        { field: profile.companyInfo.name, name: 'Company Name' },
        { field: profile.companyInfo.industry, name: 'Industry' },
        { field: profile.companyInfo.size, name: 'Company Size' },
        { field: profile.hrDetails.name, name: 'HR Name' },
        { field: profile.hrDetails.phone, name: 'HR Phone Number' }
      ];

      const missingFields = requiredFields.filter(item => !item.field || item.field === '');
      
      if (missingFields.length > 0) {
        setError(`Please fill in the following required fields: ${missingFields.map(item => item.name).join(', ')}`);
        return;
      }

      // Validate CGPA range
      if (profile.preferences.minimumCGPA < 0 || profile.preferences.minimumCGPA > 10) {
        setError('Minimum CGPA must be between 0 and 10');
        return;
      }
      
      // Convert string values to appropriate types
      const profileToSave = {
        ...profile,
        companyInfo: {
          ...profile.companyInfo,
          founded: parseInt(profile.companyInfo.founded) || undefined
        },
        companyStats: {
          ...profile.companyStats,
          totalHires: parseInt(profile.companyStats.totalHires) || 0,
          averagePackage: parseFloat(profile.companyStats.averagePackage) || undefined,
          successRate: parseFloat(profile.companyStats.successRate) || 0,
          rating: parseFloat(profile.companyStats.rating) || 0
        },
        preferences: {
          ...profile.preferences,
          minimumCGPA: parseFloat(profile.preferences.minimumCGPA) || 6.0,
          maxBacklogs: parseInt(profile.preferences.maxBacklogs) || 0
        }
      };
      
      console.log('Saving profile:', profileToSave);
      const response = await api.put('/company/profile', profileToSave);
      console.log('Save response:', response.data);
      
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Save error:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const updateProfile = (section, field, value) => {
    setProfile(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const addBranch = (branch) => {
    if (!branch.trim() || profile.preferences.preferredBranches.includes(branch.trim())) return;
    
    setProfile(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        preferredBranches: [...prev.preferences.preferredBranches, branch.trim()]
      }
    }));
  };

  const removeBranch = (index) => {
    setProfile(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        preferredBranches: prev.preferences.preferredBranches.filter((_, i) => i !== index)
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

  const tabs = [
    { id: 'company', name: 'Company Info', icon: BuildingOfficeIcon },
    { id: 'hr', name: 'HR Details', icon: UserIcon },
    { id: 'stats', name: 'Company Stats', icon: ChartBarIcon },
    { id: 'preferences', name: 'Hiring Preferences', icon: ChartBarIcon },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 p-6">
      <div className="space-y-6">
        <div className="glass-card p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex items-center justify-center">
                <BuildingOfficeIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Company Profile</h1>
                <p className="text-blue-100 mt-1">
                  Manage your company information and hiring preferences
                </p>
                {profile.companyInfo.name === 'Your Company Name' && (
                  <p className="text-yellow-200 text-sm mt-1 font-medium">
                    ⚠️ Please update your company information below
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-medium hover:from-blue-600 hover:to-indigo-600 disabled:opacity-50 transition-all duration-300 transform hover:scale-105"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        <div className="glass-card">
          <div className="border-b border-white border-opacity-20">
            <nav className="-mb-px flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-blue-300 text-white'
                      : 'border-transparent text-blue-200 hover:text-white hover:border-blue-400'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors duration-300`}
                >
                  <tab.icon className="h-5 w-5 mr-2" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {error && (
              <div className="glass-card bg-red-500 bg-opacity-20 border-red-300 text-red-100 px-4 py-3 rounded-xl mb-6">
                {error}
              </div>
            )}

            {success && (
              <div className="glass-card bg-green-500 bg-opacity-20 border-green-300 text-green-100 px-4 py-3 rounded-xl mb-6">
                {success}
              </div>
            )}

            {activeTab === 'company' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-blue-100 mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      value={profile.companyInfo.name}
                      onChange={(e) => updateProfile('companyInfo', 'name', e.target.value)}
                      className="glass-input w-full px-4 py-3"
                      placeholder="Enter company name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-blue-100 mb-2">
                      Industry *
                    </label>
                    <select
                      value={profile.companyInfo.industry}
                      onChange={(e) => updateProfile('companyInfo', 'industry', e.target.value)}
                      className="glass-input w-full px-4 py-3"
                    >
                      <option value="">Select Industry</option>
                      <option value="Technology">Technology</option>
                      <option value="Finance">Finance</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Consulting">Consulting</option>
                      <option value="E-commerce">E-commerce</option>
                      <option value="Education">Education</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-blue-100 mb-2">
                      Company Size *
                    </label>
                    <select
                      value={profile.companyInfo.size}
                      onChange={(e) => updateProfile('companyInfo', 'size', e.target.value)}
                      className="glass-input w-full px-4 py-3"
                    >
                      <option value="">Select Size</option>
                      <option value="startup">Startup (1-50 employees)</option>
                      <option value="small">Small (51-200 employees)</option>
                      <option value="medium">Medium (201-1000 employees)</option>
                      <option value="large">Large (1001-5000 employees)</option>
                      <option value="enterprise">Enterprise (5000+ employees)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-blue-100 mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      value={profile.companyInfo.website}
                      onChange={(e) => updateProfile('companyInfo', 'website', e.target.value)}
                      className="glass-input w-full px-4 py-3"
                      placeholder="https://company.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-blue-100 mb-2">
                      Headquarters
                    </label>
                    <input
                      type="text"
                      value={profile.companyInfo.headquarters}
                      onChange={(e) => updateProfile('companyInfo', 'headquarters', e.target.value)}
                      className="glass-input w-full px-4 py-3"
                      placeholder="City, Country"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-blue-100 mb-2">
                      Founded Year
                    </label>
                    <input
                      type="number"
                      value={profile.companyInfo.founded}
                      onChange={(e) => updateProfile('companyInfo', 'founded', e.target.value)}
                      className="glass-input w-full px-4 py-3"
                      placeholder="e.g., 2010"
                      min="1800"
                      max="2030"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-blue-100 mb-2">
                    Company Description
                  </label>
                  <textarea
                    value={profile.companyInfo.description}
                    onChange={(e) => updateProfile('companyInfo', 'description', e.target.value)}
                    className="glass-input w-full px-4 py-3"
                    rows="4"
                    placeholder="Describe your company, culture, and what makes it unique..."
                  />
                </div>
              </div>
            )}

            {activeTab === 'hr' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-blue-100 mb-2">
                      HR Name *
                    </label>
                    <input
                      type="text"
                      value={profile.hrDetails.name}
                      onChange={(e) => updateProfile('hrDetails', 'name', e.target.value)}
                      className="glass-input w-full px-4 py-3"
                      placeholder="Enter HR name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-blue-100 mb-2">
                      Designation
                    </label>
                    <input
                      type="text"
                      value={profile.hrDetails.designation}
                      onChange={(e) => updateProfile('hrDetails', 'designation', e.target.value)}
                      className="glass-input w-full px-4 py-3"
                      placeholder="e.g., HR Manager"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-blue-100 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={profile.hrDetails.phone}
                      onChange={(e) => updateProfile('hrDetails', 'phone', e.target.value)}
                      className="glass-input w-full px-4 py-3"
                      placeholder="Enter phone number"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-blue-100 mb-2">
                      Alternate Email
                    </label>
                    <input
                      type="email"
                      value={profile.hrDetails.alternateEmail}
                      onChange={(e) => updateProfile('hrDetails', 'alternateEmail', e.target.value)}
                      className="glass-input w-full px-4 py-3"
                      placeholder="hr@company.com"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'stats' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-blue-100 mb-2">
                      Total Hires (All Time)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={profile.companyStats.totalHires}
                      onChange={(e) => updateProfile('companyStats', 'totalHires', e.target.value)}
                      className="glass-input w-full px-4 py-3"
                      placeholder="0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-blue-100 mb-2">
                      Average Package (LPA)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      value={profile.companyStats.averagePackage}
                      onChange={(e) => updateProfile('companyStats', 'averagePackage', e.target.value)}
                      className="glass-input w-full px-4 py-3"
                      placeholder="e.g., 12.5"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-blue-100 mb-2">
                      Success Rate (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      value={profile.companyStats.successRate}
                      onChange={(e) => updateProfile('companyStats', 'successRate', e.target.value)}
                      className="glass-input w-full px-4 py-3"
                      placeholder="e.g., 85.5"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-blue-100 mb-2">
                      Company Rating (1-5)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={profile.companyStats.rating}
                      onChange={(e) => updateProfile('companyStats', 'rating', e.target.value)}
                      className="glass-input w-full px-4 py-3"
                      placeholder="e.g., 4.2"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="space-y-6">
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
                      value={profile.preferences.minimumCGPA}
                      onChange={(e) => updateProfile('preferences', 'minimumCGPA', e.target.value)}
                      className="glass-input w-full px-4 py-3"
                      placeholder="e.g., 6.0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-blue-100 mb-2">
                      Allow Backlogs
                    </label>
                    <select
                      value={profile.preferences.allowBacklogs}
                      onChange={(e) => updateProfile('preferences', 'allowBacklogs', e.target.value === 'true')}
                      className="glass-input w-full px-4 py-3"
                    >
                      <option value="false">No</option>
                      <option value="true">Yes</option>
                    </select>
                  </div>
                  
                  {profile.preferences.allowBacklogs && (
                    <div>
                      <label className="block text-sm font-medium text-blue-100 mb-2">
                        Maximum Backlogs Allowed
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={profile.preferences.maxBacklogs}
                        onChange={(e) => updateProfile('preferences', 'maxBacklogs', e.target.value)}
                        className="glass-input w-full px-4 py-3"
                        placeholder="e.g., 2"
                      />
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-blue-100 mb-2">
                    Preferred Branches
                  </label>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {profile.preferences.preferredBranches.map((branch, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500 bg-opacity-30 text-blue-100 border border-blue-400"
                      >
                        {branch}
                        <button
                          onClick={() => removeBranch(index)}
                          className="ml-2 text-blue-200 hover:text-white"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex">
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          addBranch(e.target.value);
                          e.target.value = '';
                        }
                      }}
                      className="glass-input flex-1 px-4 py-3"
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
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;