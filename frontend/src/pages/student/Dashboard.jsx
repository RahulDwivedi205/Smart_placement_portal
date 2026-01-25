import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../api/axios';
import { 
  BriefcaseIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  ChartBarIcon,
  UserIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/student/dashboard');
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

  const { stats, recentApplications, profile } = dashboardData;

  const statCards = [
    {
      title: 'Total Applications',
      value: stats.totalApplications,
      icon: DocumentTextIcon,
      gradient: 'from-blue-500 to-blue-600',
      link: '/student/applications'
    },
    {
      title: 'Pending Applications',
      value: stats.pendingApplications,
      icon: ClockIcon,
      gradient: 'from-amber-500 to-orange-500',
      link: '/student/applications'
    },
    {
      title: 'Interviews Scheduled',
      value: stats.interviewsScheduled,
      icon: UserIcon,
      gradient: 'from-purple-500 to-purple-600',
      link: '/student/applications'
    },
    {
      title: 'Offers Received',
      value: stats.offersReceived,
      icon: CheckCircleIcon,
      gradient: 'from-green-500 to-green-600',
      link: '/student/applications'
    },
    {
      title: 'Eligible Jobs',
      value: stats.eligibleJobs,
      icon: BriefcaseIcon,
      gradient: 'from-indigo-500 to-indigo-600',
      link: '/student/jobs'
    },
    {
      title: 'PRS Score',
      value: `${stats.placementReadinessScore}/100`,
      icon: ChartBarIcon,
      gradient: 'from-pink-500 to-rose-500',
      link: '/student/profile'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {profile?.personalInfo?.name || 'Student'}!
              </h1>
              <p className="text-blue-100 text-lg">
                Here's your placement journey overview
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <UserIcon className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((stat, index) => (
            <Link
              key={index}
              to={stat.link}
              className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
            >
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
              <div className="mt-4 flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700">
                View Details
                <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        {profile && (
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Placement Readiness Score
              </h2>
              <Link
                to="/student/profile"
                className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors font-medium"
              >
                Improve Score
              </Link>
            </div>
            <div className="flex items-center mb-4">
              <div className="flex-1 mr-6">
                <div className="bg-gray-200 rounded-full h-6 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-6 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${stats.placementReadinessScore}%` }}
                  ></div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-4xl font-bold text-gray-900">
                  {stats.placementReadinessScore}
                </span>
                <span className="text-gray-500 text-xl">/100</span>
              </div>
            </div>
            <p className="text-gray-600">
              {stats.placementReadinessScore >= 80 
                ? '🎉 Excellent! You\'re well-prepared for placements.'
                : stats.placementReadinessScore >= 60
                ? '📈 Good progress! Consider improving your profile.'
                : '🚀 Focus on building your skills and experience.'
              }
            </p>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Recent Applications
              </h2>
              <Link
                to="/student/applications"
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
              recentApplications.slice(0, 5).map((application) => (
                <div key={application._id} className="px-8 py-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {application.jobId?.title}
                      </h3>
                      <p className="text-gray-600">
                        Applied on {new Date(application.appliedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        application.status === 'applied' 
                          ? 'bg-yellow-100 text-yellow-800'
                          : application.status === 'interview_scheduled'
                          ? 'bg-blue-100 text-blue-800'
                          : application.status === 'offer_received'
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
                <BriefcaseIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No applications yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Start applying to jobs to see them here.
                </p>
                <Link
                  to="/student/jobs"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg"
                >
                  Browse Jobs
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/student/jobs"
              className="group flex items-center p-6 border-2 border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
            >
              <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-200 transition-colors">
                <BriefcaseIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Browse Jobs</h3>
                <p className="text-gray-600">Find eligible opportunities</p>
              </div>
            </Link>
            
            <Link
              to="/student/profile"
              className="group flex items-center p-6 border-2 border-gray-200 rounded-xl hover:border-green-300 hover:bg-green-50 transition-all duration-200"
            >
              <div className="p-3 bg-green-100 rounded-xl group-hover:bg-green-200 transition-colors">
                <UserIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Update Profile</h3>
                <p className="text-gray-600">Improve your PRS score</p>
              </div>
            </Link>
            
            <Link
              to="/student/applications"
              className="group flex items-center p-6 border-2 border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all duration-200"
            >
              <div className="p-3 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition-colors">
                <DocumentTextIcon className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Track Applications</h3>
                <p className="text-gray-600">Monitor your progress</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;