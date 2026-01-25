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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card bg-red-500 bg-opacity-20 border-red-300 text-red-100 px-4 py-3 rounded-xl">
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
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 p-6">
      <div className="space-y-6">
        <div className="glass-card p-8">
          <div className="flex items-center space-x-4 mb-2">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex items-center justify-center">
              <ChartBarIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Admin Dashboard
              </h1>
              <p className="text-blue-100 mt-1">
                Monitor and manage the entire placement ecosystem
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((stat, index) => (
            <Link
              key={index}
              to={stat.link}
              className="glass-card p-6 hover:bg-white hover:bg-opacity-20 transition-all duration-300 transform hover:scale-105 group"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`${stat.color} rounded-xl p-3 group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-blue-100 truncate">
                      {stat.title}
                    </dt>
                    <dd className="text-2xl font-bold text-white">
                      {stat.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Monthly Application Trends
            </h2>
            <PlacementChart data={analytics.monthlyTrends} />
          </div>

          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Branch-wise Placement Rate
            </h2>
            <BranchWiseChart data={analytics.branchStats} />
          </div>
        </div>

        <div className="glass-card">
          <div className="px-6 py-4 border-b border-white border-opacity-20">
            <h2 className="text-xl font-semibold text-white">
              Top Hiring Companies
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {analytics.companyStats.slice(0, 8).map((company, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-white bg-opacity-10 rounded-xl backdrop-blur-sm">
                  <div className="flex items-center">
                    <div className="bg-blue-400 bg-opacity-30 rounded-full p-2">
                      <BuildingOfficeIcon className="h-5 w-5 text-blue-200" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-white">
                        {company.companyName}
                      </h3>
                      <p className="text-sm text-blue-200">
                        {company.totalJobs} jobs • {company.totalApplications} applications
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-green-300">
                      {company.hired}
                    </div>
                    <div className="text-sm text-blue-200">hired</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card">
            <div className="px-6 py-4 border-b border-white border-opacity-20">
              <h2 className="text-xl font-semibold text-white">
                Recent Applications
              </h2>
            </div>
            <div className="divide-y divide-white divide-opacity-20">
              {recentActivity.applications.slice(0, 5).map((application) => (
                <div key={application._id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-white">
                        {application.studentId?.personalInfo?.name || 'Student'}
                      </h3>
                      <p className="text-sm text-blue-200">
                        Applied for {application.jobId?.title}
                      </p>
                      <p className="text-xs text-blue-300">
                        {new Date(application.appliedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      application.status === 'applied' 
                        ? 'bg-yellow-500 bg-opacity-20 text-yellow-200 border border-yellow-400'
                        : application.status === 'interview_scheduled'
                        ? 'bg-blue-500 bg-opacity-20 text-blue-200 border border-blue-400'
                        : 'bg-gray-500 bg-opacity-20 text-gray-200 border border-gray-400'
                    }`}>
                      {application.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card">
            <div className="px-6 py-4 border-b border-white border-opacity-20">
              <h2 className="text-xl font-semibold text-white">
                Recent Job Postings
              </h2>
            </div>
            <div className="divide-y divide-white divide-opacity-20">
              {recentActivity.jobs.slice(0, 5).map((job) => (
                <div key={job._id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-white">
                        {job.jobDetails?.title}
                      </h3>
                      <p className="text-sm text-blue-200">
                        {job.companyId?.companyInfo?.name}
                      </p>
                      <p className="text-xs text-blue-300">
                        Posted {new Date(job.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      job.status === 'active' 
                        ? 'bg-green-500 bg-opacity-20 text-green-200 border border-green-400'
                        : 'bg-gray-500 bg-opacity-20 text-gray-200 border border-gray-400'
                    }`}>
                      {job.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link
              to="/admin/students"
              className="flex items-center p-4 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-xl hover:bg-opacity-20 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
            >
              <UserGroupIcon className="h-8 w-8 text-blue-300" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-white">Manage Students</h3>
                <p className="text-sm text-blue-200">View student profiles</p>
              </div>
            </Link>
            
            <Link
              to="/admin/companies"
              className="flex items-center p-4 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-xl hover:bg-opacity-20 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
            >
              <BuildingOfficeIcon className="h-8 w-8 text-green-300" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-white">Manage Companies</h3>
                <p className="text-sm text-blue-200">Approve companies</p>
              </div>
            </Link>
            
            <Link
              to="/admin/jobs"
              className="flex items-center p-4 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-xl hover:bg-opacity-20 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
            >
              <BriefcaseIcon className="h-8 w-8 text-purple-300" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-white">Monitor Jobs</h3>
                <p className="text-sm text-blue-200">Oversee job postings</p>
              </div>
            </Link>
            
            <Link
              to="/admin/analytics"
              className="flex items-center p-4 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-xl hover:bg-opacity-20 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm"
            >
              <ChartBarIcon className="h-8 w-8 text-red-300" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-white">View Analytics</h3>
                <p className="text-sm text-blue-200">Detailed insights</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;