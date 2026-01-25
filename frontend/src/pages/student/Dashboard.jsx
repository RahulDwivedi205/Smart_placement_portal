import React, { useState, useEffect } from 'react';
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
      color: 'bg-blue-500',
      link: '/student/applications'
    },
    {
      title: 'Pending Applications',
      value: stats.pendingApplications,
      icon: ClockIcon,
      color: 'bg-yellow-500',
      link: '/student/applications'
    },
    {
      title: 'Interviews Scheduled',
      value: stats.interviewsScheduled,
      icon: UserIcon,
      color: 'bg-purple-500',
      link: '/student/applications'
    },
    {
      title: 'Offers Received',
      value: stats.offersReceived,
      icon: CheckCircleIcon,
      color: 'bg-green-500',
      link: '/student/applications'
    },
    {
      title: 'Eligible Jobs',
      value: stats.eligibleJobs,
      icon: BriefcaseIcon,
      color: 'bg-indigo-500',
      link: '/student/jobs'
    },
    {
      title: 'PRS Score',
      value: `${stats.placementReadinessScore}/100`,
      icon: ChartBarIcon,
      color: 'bg-red-500',
      link: '/student/profile'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {profile?.personalInfo?.name || 'Student'}!
        </h1>
        <p className="text-gray-600 mt-1">
          Here's your placement journey overview
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

      {/* PRS Score Card */}
      {profile && (
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">
              Placement Readiness Score
            </h2>
            <Link
              to="/student/profile"
              className="text-blue-600 hover:text-blue-500 text-sm font-medium"
            >
              View Details →
            </Link>
          </div>
          <div className="flex items-center">
            <div className="flex-1">
              <div className="bg-gray-200 rounded-full h-4">
                <div
                  className="bg-blue-600 h-4 rounded-full transition-all duration-300"
                  style={{ width: `${stats.placementReadinessScore}%` }}
                ></div>
              </div>
            </div>
            <div className="ml-4">
              <span className="text-2xl font-bold text-gray-900">
                {stats.placementReadinessScore}
              </span>
              <span className="text-gray-500">/100</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {stats.placementReadinessScore >= 80 
              ? 'Excellent! You\'re well-prepared for placements.'
              : stats.placementReadinessScore >= 60
              ? 'Good progress! Consider improving your profile.'
              : 'Focus on building your skills and experience.'
            }
          </p>
        </div>
      )}

      {/* Recent Applications */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">
              Recent Applications
            </h2>
            <Link
              to="/student/applications"
              className="text-blue-600 hover:text-blue-500 text-sm font-medium"
            >
              View All →
            </Link>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {recentApplications.length > 0 ? (
            recentApplications.slice(0, 5).map((application) => (
              <div key={application._id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {application.jobId?.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Applied on {new Date(application.appliedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
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
            <div className="px-6 py-8 text-center">
              <BriefcaseIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No applications yet
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Start applying to jobs to see them here.
              </p>
              <div className="mt-6">
                <Link
                  to="/student/jobs"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Browse Jobs
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/student/jobs"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <BriefcaseIcon className="h-8 w-8 text-blue-500" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-900">Browse Jobs</h3>
              <p className="text-sm text-gray-500">Find eligible opportunities</p>
            </div>
          </Link>
          
          <Link
            to="/student/profile"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <UserIcon className="h-8 w-8 text-green-500" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-900">Update Profile</h3>
              <p className="text-sm text-gray-500">Improve your PRS score</p>
            </div>
          </Link>
          
          <Link
            to="/student/applications"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <DocumentTextIcon className="h-8 w-8 text-purple-500" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-900">Track Applications</h3>
              <p className="text-sm text-gray-500">Monitor your progress</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;