import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { 
  UserIcon, 
  AcademicCapIcon, 
  BriefcaseIcon, 
  ChartBarIcon,
  PlusIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [prsData, setPrsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('personal');

  useEffect(() => {
    fetchProfile();
    fetchPRS();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/student/profile');
      if (response.data.success) {
        setProfile(response.data.data);
      } else {
        setError(response.data.message || 'Failed to load profile');
      }
    } catch (err) {
      setError('Failed to load profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPRS = async () => {
    try {
      const response = await api.get('/student/prs');
      if (response.data.success) {
        setPrsData(response.data);
      } else {
        console.error('Failed to load PRS data:', response.data.message);
      }
    } catch (err) {
      console.error('Failed to load PRS data:', err);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await api.put('/student/profile', profile);
      if (response.data.success) {
        alert('Profile updated successfully!');
        fetchPRS();
      }
    } catch (err) {
      alert('Failed to update profile');
      console.error(err);
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

  const addSkill = (category, skill) => {
    if (!skill.trim()) return;
    
    setProfile(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: [...(prev.skills[category] || []), skill.trim()]
      }
    }));
  };

  const removeSkill = (category, index) => {
    setProfile(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: prev.skills[category].filter((_, i) => i !== index)
      }
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!profile) {
    // Initialize empty profile
    setProfile({
      personalInfo: {
        name: '',
        rollNumber: '',
        branch: '',
        batch: '',
        phone: '',
        address: ''
      },
      academics: {
        cgpa: 0,
        backlogs: 0,
        tenthMarks: 0,
        twelfthMarks: 0
      },
      skills: {
        technical: [],
        programming: [],
        frameworks: [],
        tools: []
      },
      experience: [],
      projects: [],
      achievements: []
    });
  }

  const tabs = [
    { id: 'personal', name: 'Personal Info', icon: UserIcon },
    { id: 'academics', name: 'Academics', icon: AcademicCapIcon },
    { id: 'skills', name: 'Skills & Experience', icon: BriefcaseIcon },
    { id: 'prs', name: 'PRS Score', icon: ChartBarIcon },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600 mt-1">
              Keep your profile updated to improve your placement readiness score
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
              >
                <tab.icon className="h-5 w-5 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {/* Personal Info Tab */}
          {activeTab === 'personal' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profile.personalInfo?.name || ''}
                    onChange={(e) => updateProfile('personalInfo', 'name', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Roll Number
                  </label>
                  <input
                    type="text"
                    value={profile.personalInfo?.rollNumber || ''}
                    onChange={(e) => updateProfile('personalInfo', 'rollNumber', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Branch
                  </label>
                  <select
                    value={profile.personalInfo?.branch || ''}
                    onChange={(e) => updateProfile('personalInfo', 'branch', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Branch</option>
                    <option value="CSE">Computer Science Engineering</option>
                    <option value="ECE">Electronics & Communication</option>
                    <option value="EEE">Electrical & Electronics</option>
                    <option value="MECH">Mechanical Engineering</option>
                    <option value="CIVIL">Civil Engineering</option>
                    <option value="IT">Information Technology</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Batch Year
                  </label>
                  <input
                    type="number"
                    value={profile.personalInfo?.batch || ''}
                    onChange={(e) => updateProfile('personalInfo', 'batch', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profile.personalInfo?.phone || ''}
                    onChange={(e) => updateProfile('personalInfo', 'phone', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    value={profile.personalInfo?.address || ''}
                    onChange={(e) => updateProfile('personalInfo', 'address', e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Academics Tab */}
          {activeTab === 'academics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current CGPA
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    max="10"
                    value={profile.academics?.cgpa || ''}
                    onChange={(e) => updateProfile('academics', 'cgpa', parseFloat(e.target.value))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Active Backlogs
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={profile.academics?.backlogs || ''}
                    onChange={(e) => updateProfile('academics', 'backlogs', parseInt(e.target.value))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    10th Grade Percentage
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    max="100"
                    value={profile.academics?.tenthMarks || ''}
                    onChange={(e) => updateProfile('academics', 'tenthMarks', parseFloat(e.target.value))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    12th Grade Percentage
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    max="100"
                    value={profile.academics?.twelfthMarks || ''}
                    onChange={(e) => updateProfile('academics', 'twelfthMarks', parseFloat(e.target.value))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Skills Tab */}
          {activeTab === 'skills' && (
            <div className="space-y-8">
              {['technical', 'programming', 'frameworks', 'tools'].map((category) => (
                <div key={category}>
                  <h3 className="text-lg font-medium text-gray-900 mb-4 capitalize">
                    {category} Skills
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {(profile.skills?.[category] || []).map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                      >
                        {skill}
                        <button
                          onClick={() => removeSkill(category, index)}
                          className="ml-2 text-blue-600 hover:text-blue-800"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex">
                    <input
                      type="text"
                      placeholder={`Add ${category} skill`}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addSkill(category, e.target.value);
                          e.target.value = '';
                        }
                      }}
                      className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={(e) => {
                        const input = e.target.previousElementSibling;
                        addSkill(category, input.value);
                        input.value = '';
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
                    >
                      <PlusIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PRS Tab */}
          {activeTab === 'prs' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-32 h-32 bg-blue-100 rounded-full mb-4">
                  <span className="text-3xl font-bold text-blue-600">
                    {prsData?.score || 0}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Placement Readiness Score
                </h2>
                <p className="text-gray-600 mt-2">
                  Your overall readiness for campus placements
                </p>
              </div>

              {prsData?.breakdown && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(prsData.breakdown).map(([category, data]) => (
                    <div key={category} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-medium text-gray-900 capitalize">
                          {category.replace(/([A-Z])/g, ' $1').trim()}
                        </h3>
                        <span className="text-sm font-semibold text-gray-900">
                          {data.score}/{data.maxScore}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(data.score / data.maxScore) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">{data.feedback}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-900 mb-2">
                  Tips to Improve Your PRS:
                </h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Complete your profile with accurate information</li>
                  <li>• Maintain a good CGPA and clear any backlogs</li>
                  <li>• Add relevant technical and programming skills</li>
                  <li>• Include projects and work experience</li>
                  <li>• Keep your achievements updated</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;