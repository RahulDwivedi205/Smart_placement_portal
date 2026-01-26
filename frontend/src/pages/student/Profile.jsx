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
  const [profile, setProfile] = useState({
    personalInfo: {
      firstName: '',
      lastName: '',
      rollNumber: '',
      branch: '',
      batch: '',
      phone: '',
      currentSemester: ''
    },
    academics: {
      cgpa: '',
      backlogs: '',
      tenthMarks: '',
      twelfthMarks: ''
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
  const [prsData, setPrsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('personal');

  useEffect(() => {
    fetchProfile();
    fetchPRS();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/student/profile');
      console.log('Profile response:', response.data);
      
      if (response.data.success && response.data.data) {
        const profileData = response.data.data;
        console.log('Received profile data:', profileData);
        setProfile({
          personalInfo: {
            firstName: profileData.personalInfo?.firstName || '',
            lastName: profileData.personalInfo?.lastName || '',
            rollNumber: profileData.personalInfo?.rollNumber || '',
            branch: profileData.personalInfo?.branch || '',
            batch: profileData.personalInfo?.batch || '',
            phone: profileData.personalInfo?.phone || '',
            currentSemester: profileData.personalInfo?.currentSemester || ''
          },
          academics: {
            cgpa: profileData.academics?.cgpa || '',
            backlogs: profileData.academics?.backlogs || '',
            tenthMarks: profileData.academics?.tenthMarks || '',
            twelfthMarks: profileData.academics?.twelfthMarks || ''
          },
          skills: {
            technical: profileData.skills?.technical || [],
            programming: profileData.skills?.programming || [],
            frameworks: profileData.skills?.frameworks || [],
            tools: profileData.skills?.tools || []
          },
          experience: profileData.experience || [],
          projects: profileData.projects || [],
          achievements: profileData.academics?.achievements || []
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

  const fetchPRS = async () => {
    try {
      const response = await api.get('/student/prs');
      if (response.data.success) {
        setPrsData(response.data);
      }
    } catch (err) {
      console.error('Failed to load PRS data:', err);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      
      // Validate required fields
      const requiredFields = [
        { field: profile.personalInfo.firstName, name: 'First Name' },
        { field: profile.personalInfo.lastName, name: 'Last Name' },
        { field: profile.personalInfo.rollNumber, name: 'Roll Number' },
        { field: profile.personalInfo.branch, name: 'Branch' },
        { field: profile.personalInfo.batch, name: 'Batch Year' },
        { field: profile.personalInfo.currentSemester, name: 'Current Semester' },
        { field: profile.personalInfo.phone, name: 'Phone Number' },
        { field: profile.academics.cgpa, name: 'CGPA' },
        { field: profile.academics.tenthMarks, name: '10th Grade Marks' },
        { field: profile.academics.twelfthMarks, name: '12th Grade Marks' }
      ];

      const missingFields = requiredFields.filter(item => !item.field || item.field === '');
      
      if (missingFields.length > 0) {
        setError(`Please fill in the following required fields: ${missingFields.map(item => item.name).join(', ')}`);
        return;
      }

      // Validate CGPA range
      if (profile.academics.cgpa < 0 || profile.academics.cgpa > 10) {
        setError('CGPA must be between 0 and 10');
        return;
      }

      // Validate percentage ranges
      if (profile.academics.tenthMarks < 0 || profile.academics.tenthMarks > 100) {
        setError('10th Grade marks must be between 0 and 100');
        return;
      }

      if (profile.academics.twelfthMarks < 0 || profile.academics.twelfthMarks > 100) {
        setError('12th Grade marks must be between 0 and 100');
        return;
      }
      
      // Convert string values to appropriate types
      const profileToSave = {
        ...profile,
        personalInfo: {
          ...profile.personalInfo,
          batch: parseInt(profile.personalInfo.batch) || 0,
          currentSemester: parseInt(profile.personalInfo.currentSemester) || 1
        },
        academics: {
          ...profile.academics,
          cgpa: parseFloat(profile.academics.cgpa) || 0,
          backlogs: parseInt(profile.academics.backlogs) || 0,
          tenthMarks: parseFloat(profile.academics.tenthMarks) || 0,
          twelfthMarks: parseFloat(profile.academics.twelfthMarks) || 0,
          achievements: profile.achievements || []
        }
      };
      
      console.log('Saving profile:', profileToSave);
      const response = await api.put('/student/profile', profileToSave);
      console.log('Save response:', response.data);
      
      if (response.data.success) {
        setSuccess('Profile updated successfully!');
        fetchPRS();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(response.data.message || 'Failed to update profile');
      }
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

  const addSkill = (category, skill) => {
    if (!skill.trim()) return;
    
    setProfile(prev => ({
      ...prev,
      skills: {
        ...prev.skills,
        [category]: [...prev.skills[category], skill.trim()]
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

  const addAchievement = (achievement) => {
    if (!achievement.trim()) return;
    
    setProfile(prev => ({
      ...prev,
      achievements: [...prev.achievements, achievement.trim()]
    }));
  };

  const removeAchievement = (index) => {
    setProfile(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index)
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
    { id: 'personal', name: 'Personal Info', icon: UserIcon },
    { id: 'academics', name: 'Academics', icon: AcademicCapIcon },
    { id: 'skills', name: 'Skills & Experience', icon: BriefcaseIcon },
    { id: 'prs', name: 'PRS Score', icon: ChartBarIcon },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 p-6">
      <div className="space-y-6">
        <div className="glass-card p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex items-center justify-center">
                <UserIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">My Profile</h1>
                <p className="text-blue-100 mt-1">
                  Keep your profile updated to improve your placement readiness score
                </p>
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

            {activeTab === 'personal' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-blue-100 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={profile.personalInfo.firstName}
                      onChange={(e) => updateProfile('personalInfo', 'firstName', e.target.value)}
                      className="glass-input w-full px-4 py-3"
                      placeholder="Enter your first name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-blue-100 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={profile.personalInfo.lastName}
                      onChange={(e) => updateProfile('personalInfo', 'lastName', e.target.value)}
                      className="glass-input w-full px-4 py-3"
                      placeholder="Enter your last name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-blue-100 mb-2">
                      Roll Number *
                    </label>
                    <input
                      type="text"
                      value={profile.personalInfo.rollNumber}
                      onChange={(e) => updateProfile('personalInfo', 'rollNumber', e.target.value)}
                      className="glass-input w-full px-4 py-3"
                      placeholder="Enter your roll number"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-blue-100 mb-2">
                      Branch *
                    </label>
                    <select
                      value={profile.personalInfo.branch}
                      onChange={(e) => updateProfile('personalInfo', 'branch', e.target.value)}
                      className="glass-input w-full px-4 py-3"
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
                    <label className="block text-sm font-medium text-blue-100 mb-2">
                      Batch Year *
                    </label>
                    <input
                      type="number"
                      value={profile.personalInfo.batch}
                      onChange={(e) => updateProfile('personalInfo', 'batch', e.target.value)}
                      className="glass-input w-full px-4 py-3"
                      placeholder="e.g., 2024"
                      min="2020"
                      max="2030"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-blue-100 mb-2">
                      Current Semester *
                    </label>
                    <select
                      value={profile.personalInfo.currentSemester}
                      onChange={(e) => updateProfile('personalInfo', 'currentSemester', e.target.value)}
                      className="glass-input w-full px-4 py-3"
                    >
                      <option value="">Select Semester</option>
                      <option value="1">1st Semester</option>
                      <option value="2">2nd Semester</option>
                      <option value="3">3rd Semester</option>
                      <option value="4">4th Semester</option>
                      <option value="5">5th Semester</option>
                      <option value="6">6th Semester</option>
                      <option value="7">7th Semester</option>
                      <option value="8">8th Semester</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-blue-100 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={profile.personalInfo.phone}
                      onChange={(e) => updateProfile('personalInfo', 'phone', e.target.value)}
                      className="glass-input w-full px-4 py-3"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'academics' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-blue-100 mb-2">
                      Current CGPA *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="10"
                      value={profile.academics.cgpa}
                      onChange={(e) => updateProfile('academics', 'cgpa', e.target.value)}
                      className="glass-input w-full px-4 py-3"
                      placeholder="e.g., 8.5"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-blue-100 mb-2">
                      Active Backlogs
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={profile.academics.backlogs}
                      onChange={(e) => updateProfile('academics', 'backlogs', e.target.value)}
                      className="glass-input w-full px-4 py-3"
                      placeholder="0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-blue-100 mb-2">
                      10th Grade Percentage *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={profile.academics.tenthMarks}
                      onChange={(e) => updateProfile('academics', 'tenthMarks', e.target.value)}
                      className="glass-input w-full px-4 py-3"
                      placeholder="e.g., 85.5"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-blue-100 mb-2">
                      12th Grade Percentage *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={profile.academics.twelfthMarks}
                      onChange={(e) => updateProfile('academics', 'twelfthMarks', e.target.value)}
                      className="glass-input w-full px-4 py-3"
                      placeholder="e.g., 88.2"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'skills' && (
              <div className="space-y-8">
                {['technical', 'programming', 'frameworks', 'tools'].map((category) => (
                  <div key={category}>
                    <h3 className="text-lg font-medium text-white mb-4 capitalize">
                      {category} Skills
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {profile.skills[category].map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-500 bg-opacity-30 text-blue-100 border border-blue-400"
                        >
                          {skill}
                          <button
                            onClick={() => removeSkill(category, index)}
                            className="ml-2 text-blue-200 hover:text-white"
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
                        className="glass-input flex-1 rounded-r-none px-4 py-3"
                      />
                      <button
                        onClick={(e) => {
                          const input = e.target.previousElementSibling;
                          addSkill(category, input.value);
                          input.value = '';
                        }}
                        className="px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-r-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300"
                      >
                        <PlusIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}

                <div>
                  <h3 className="text-lg font-medium text-white mb-4">
                    Achievements
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {profile.achievements.map((achievement, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-500 bg-opacity-30 text-green-100 border border-green-400"
                      >
                        {achievement}
                        <button
                          onClick={() => removeAchievement(index)}
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
                      placeholder="Add achievement"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addAchievement(e.target.value);
                          e.target.value = '';
                        }
                      }}
                      className="glass-input flex-1 rounded-r-none px-4 py-3"
                    />
                    <button
                      onClick={(e) => {
                        const input = e.target.previousElementSibling;
                        addAchievement(input.value);
                        input.value = '';
                      }}
                      className="px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-r-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300"
                    >
                      <PlusIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'prs' && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full mb-4">
                    <span className="text-4xl font-bold text-white">
                      {prsData?.score || 0}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    Placement Readiness Score
                  </h2>
                  <p className="text-blue-200 mt-2">
                    Your overall readiness for campus placements
                  </p>
                </div>

                {prsData?.breakdown && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(prsData.breakdown).map(([category, data]) => (
                      <div key={category} className="bg-white bg-opacity-10 rounded-xl p-4 backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-sm font-medium text-white capitalize">
                            {category.replace(/([A-Z])/g, ' $1').trim()}
                          </h3>
                          <span className="text-sm font-semibold text-white">
                            {data.score}/{data.maxScore}
                          </span>
                        </div>
                        <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-400 to-indigo-400 h-2 rounded-full"
                            style={{ width: `${(data.score / data.maxScore) * 100}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-blue-200 mt-2">{data.feedback}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="bg-blue-500 bg-opacity-20 border border-blue-400 rounded-xl p-4">
                  <h3 className="text-sm font-medium text-blue-100 mb-2">
                    Tips to Improve Your PRS:
                  </h3>
                  <ul className="text-sm text-blue-200 space-y-1">
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
    </div>
  );
};

export default Profile;