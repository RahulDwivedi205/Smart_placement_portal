import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { 
  BriefcaseIcon, 
  UserGroupIcon, 
  ClockIcon, 
  CheckCircleIcon,
  PlusIcon,
  ChartBarIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

const CompanyDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/company/dashboard');
      if (response.data.success) {
        setDashboardData(response.data.data);
      } else {
        setError(response.data.message || 'Failed to load dashboard data');
      }
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  const { stats, recentApplications, jobStats, company } = dashboardData;

  const statCards = [
    {
      title: 'Total Jobs Posted',
      value: stats.totalJobs,
      icon: BriefcaseIcon,
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Active Jobs',
      value: stats.activeJobs,
      icon: BriefcaseIcon,
      gradient: 'from-green-500 to-green-600'
    },
    {
      title: 'Total Applications',
      value: stats.totalApplications,
      icon: UserGroupIcon,
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Pending Review',
      value: stats.pendingApplications,
      icon: ClockIcon,
      gradient: 'from-amber-500 to-orange-500'
    },
    {
      title: 'Interviews Scheduled',
      value: stats.interviewsScheduled,
      icon: UserGroupIcon,
      gradient: 'from-indigo-500 to-indigo-600'
    },
    {
      title: 'Offers Extended',
      value: stats.offersExtended,
      icon: CheckCircleIcon,
      gradient: 'from-emerald-500 to-emerald-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome, {company?.companyInfo?.name || 'Company'}!
              </h1>
              <p className="text-blue-100 text-lg">
                Manage your recruitment process and find the best talent
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:block">
                <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <BuildingOfficeIcon className="w-12 h-12 text-white" />
                </div>
              </div>
              <Link
                to="/company/jobs/new"
                className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors shadow-lg flex items-center space-x-2"
              >
                <PlusIcon className="w-5 h-5" />
                <span>Post New Job</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((stat, index) => (
            <div key={index} className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.gradient} shadow-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <h2 className="text-2xl font-bold text-gray-900">Job Performance</h2>
          </div>
          <div className="p-8">
            <div className="space-y-4">
              {jobStats.slice(0, 5).map((job, index) => (
                <div key={index} className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 hover:shadow-md transition-shadow">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{job.jobTitle}</h3>
                    <p className="text-gray-600">
                      {job.applications} applications received
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                      job.status === 'active' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {job.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Recent Applications
              </h2>
              <Link
                to="/company/applications"
                className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
              >
                View All
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {recentApplications.length > 0 ? (
              recentApplications.slice(0, 8).map((application) => (
                <div key={application._id} className="px-8 py-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                        <UserGroupIcon className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {application.studentId?.personalInfo?.name || 'Student'}
                        </h3>
                        <p className="text-gray-600">
                          Applied for {application.jobId?.title}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(application.appliedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {application.overallScore && (
                        <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                          {application.overallScore}% Match
                        </div>
                      )}
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        application.status === 'applied' 
                          ? 'bg-yellow-100 text-yellow-800'
                          : application.status === 'interview_scheduled'
                          ? 'bg-blue-100 text-blue-800'
                          : application.status === 'offer_extended'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {application.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-8 py-12 text-center">
                <UserGroupIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No applications yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Post jobs to start receiving applications.
                </p>
                <Link
                  to="/company/jobs/new"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg"
                >
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Post Your First Job
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/company/jobs/new"
              className="group flex items-center p-6 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
            >
              <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                <PlusIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Post New Job</h3>
                <p className="text-gray-600">Create a new job posting</p>
              </div>
            </Link>
            
            <Link
              to="/company/jobs"
              className="group flex items-center p-6 border-2 border-gray-200 rounded-xl hover:border-green-300 hover:bg-green-50 transition-all duration-200"
            >
              <div className="p-3 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors">
                <BriefcaseIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Manage Jobs</h3>
                <p className="text-gray-600">View and edit job postings</p>
              </div>
            </Link>
            
            <Link
              to="/company/analytics"
              className="group flex items-center p-6 border-2 border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all duration-200"
            >
              <div className="p-3 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition-colors">
                <ChartBarIcon className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">View Analytics</h3>
                <p className="text-gray-600">Recruitment insights</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;