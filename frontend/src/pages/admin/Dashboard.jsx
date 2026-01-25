import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { 
  UserGroupIcon, 
  BuildingOfficeIcon, 
  BriefcaseIcon, 
  DocumentTextIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import PlacementChart from '../../components/charts/PlacementChart';
import BranchWiseChart from '../../components/charts/BranchWiseChart';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/admin/dashboard');
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

  const { overview, recentActivity, analytics } = dashboardData;

  const statCards = [
    {
      title: 'Total Students',
      value: overview.totalStudents,
      icon: UserGroupIcon,
      color: 'bg-blue-500',
      link: '/admin/students'
    },
    {
      title: 'Total Companies',
      value: overview.totalCompanies,
      icon: BuildingOfficeIcon,
      color: 'bg-green-500',
      link: '/admin/companies'
    },
    {
      title: 'Total Jobs',
      value: overview.totalJobs,
      icon: BriefcaseIcon,
      color: 'bg-purple-500',
      link: '/admin/jobs'
    },
    {
      title: 'Total Applications',
      value: overview.totalApplications,
      icon: DocumentTextIcon,
      color: 'bg-yellow-500',
      link: '/admin/applications'
    },
    {
      title: 'Students Placed',
      value: overview.placedStudents,
      icon: ArrowTrendingUpIcon,
      color: 'bg-indigo-500',
      link: '/admin/placements'
    },
    {
      title: 'Placement Rate',
      value: `${overview.placementPercentage}%`,
      icon: ChartBarIcon,
      color: 'bg-red-500',
      link: '/admin/analytics'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 mt-1">
          Monitor and manage the entire placement ecosystem
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <Link
            key={index}
            to={stat.link}
            className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow"
          >
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
          </Link>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Placement Trends */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Monthly Application Trends
          </h2>
          <PlacementChart data={analytics.monthlyTrends} />
        </div>

        {/* Branch-wise Placement */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Branch-wise Placement Rate
          </h2>
          <BranchWiseChart data={analytics.branchStats} />
        </div>
      </div>

      {/* Top Companies */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">
            Top Hiring Companies
          </h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {analytics.companyStats.slice(0, 8).map((company, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-blue-100 rounded-full p-2">
                    <BuildingOfficeIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900">
                      {company.companyName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {company.totalJobs} jobs • {company.totalApplications} applications
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-green-600">
                    {company.hired}
                  </div>
                  <div className="text-sm text-gray-500">hired</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Recent Applications
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {recentActivity.applications.slice(0, 5).map((application) => (
              <div key={application._id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
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
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    application.status === 'applied' 
                      ? 'bg-yellow-100 text-yellow-800'
                      : application.status === 'interview_scheduled'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {application.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Jobs */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              Recent Job Postings
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {recentActivity.jobs.slice(0, 5).map((job) => (
              <div key={job._id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {job.jobDetails?.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {job.companyId?.companyInfo?.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      Posted {new Date(job.createdAt).toLocaleDateString()}
                    </p>
                  </div>
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

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Link
            to="/admin/students"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <UserGroupIcon className="h-8 w-8 text-blue-500" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-900">Manage Students</h3>
              <p className="text-sm text-gray-500">View student profiles</p>
            </div>
          </Link>
          
          <Link
            to="/admin/companies"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <BuildingOfficeIcon className="h-8 w-8 text-green-500" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-900">Manage Companies</h3>
              <p className="text-sm text-gray-500">Approve companies</p>
            </div>
          </Link>
          
          <Link
            to="/admin/jobs"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <BriefcaseIcon className="h-8 w-8 text-purple-500" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-900">Monitor Jobs</h3>
              <p className="text-sm text-gray-500">Oversee job postings</p>
            </div>
          </Link>
          
          <Link
            to="/admin/analytics"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ChartBarIcon className="h-8 w-8 text-red-500" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-900">View Analytics</h3>
              <p className="text-sm text-gray-500">Detailed insights</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;