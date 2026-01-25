import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { 
  BriefcaseIcon, 
  UserGroupIcon, 
  ClockIcon, 
  CheckCircleIcon,
  PlusIcon,
  ChartBarIcon
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
      color: 'bg-blue-500'
    },
    {
      title: 'Active Jobs',
      value: stats.activeJobs,
      icon: BriefcaseIcon,
      color: 'bg-green-500'
    },
    {
      title: 'Total Applications',
      value: stats.totalApplications,
      icon: UserGroupIcon,
      color: 'bg-purple-500'
    },
    {
      title: 'Pending Review',
      value: stats.pendingApplications,
      icon: ClockIcon,
      color: 'bg-yellow-500'
    },
    {
      title: 'Interviews Scheduled',
      value: stats.interviewsScheduled,
      icon: UserGroupIcon,
      color: 'bg-indigo-500'
    },
    {
      title: 'Offers Extended',
      value: stats.offersExtended,
      icon: CheckCircleIcon,
      color: 'bg-green-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome, {company?.companyInfo?.name || 'Company'}!
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your recruitment process and find the best talent
            </p>
          </div>
          <Link
            to="/company/jobs/new"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Post New Job
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`${stat.color} rounded-md p-3`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.title}
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stat.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Job Performance */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Job Performance</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {jobStats.slice(0, 5).map((job, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{job.jobTitle}</h3>
                  <p className="text-sm text-gray-500">
                    {job.applications} applications received
                  </p>
                </div>
                <div className="flex items-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
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

      {/* Recent Applications */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">
              Recent Applications
            </h2>
            <Link
              to="/company/applications"
              className="text-blue-600 hover:text-blue-500 text-sm font-medium"
            >
              View All →
            </Link>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {recentApplications.length > 0 ? (
            recentApplications.slice(0, 8).map((application) => (
              <div key={application._id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="bg-gray-100 rounded-full p-2">
                      <UserGroupIcon className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-gray-900">
                        {application.studentId?.personalInfo?.name || 'Student'}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Applied for {application.jobId?.title}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(application.appliedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {application.overallScore && (
                      <div className="text-sm text-green-600 font-medium">
                        {application.overallScore}% Match
                      </div>
                    )}
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
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
            <div className="px-6 py-8 text-center">
              <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No applications yet
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Post jobs to start receiving applications.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/company/jobs/new"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <PlusIcon className="h-8 w-8 text-blue-500" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-900">Post New Job</h3>
              <p className="text-sm text-gray-500">Create a new job posting</p>
            </div>
          </Link>
          
          <Link
            to="/company/jobs"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <BriefcaseIcon className="h-8 w-8 text-green-500" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-900">Manage Jobs</h3>
              <p className="text-sm text-gray-500">View and edit job postings</p>
            </div>
          </Link>
          
          <Link
            to="/company/analytics"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ChartBarIcon className="h-8 w-8 text-purple-500" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-900">View Analytics</h3>
              <p className="text-sm text-gray-500">Recruitment insights</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;