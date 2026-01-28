import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BackButton from '../../components/common/BackButton';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useNotification } from '../../context/NotificationContext';
import { useGamification } from '../../context/GamificationContext';
import { studentService } from '../../services/apiService';
import { formatDate, getErrorMessage } from '../../utils';
import { ROUTES, USER_ROLES } from '../../constants';
import LevelBadge from '../../components/gamification/LevelBadge';
import XpNotification from '../../components/gamification/XpNotification';
import GamificationDashboard from '../../components/gamification/GamificationDashboard';
import { 
  BriefcaseIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  ChartBarIcon,
  UserIcon,
  DocumentTextIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showGamification, setShowGamification] = useState(false);
  const { showNotification } = useNotification();
  const { userStats, recentXpGain, clearXpNotification, trackDailyLogin, awardXpToUser, updateUserStats } = useGamification();

  useEffect(() => {
    fetchDashboardData();
    trackDailyLogin(); // Award daily login XP
  }, []);

  // Update gamification stats when dashboard data changes
  useEffect(() => {
    if (dashboardData) {
      updateUserStats({
        totalApplications: dashboardData.stats.totalApplications,
        interviewsScheduled: dashboardData.stats.interviewsScheduled,
        offersReceived: dashboardData.stats.offersReceived,
        profileCompletion: calculateProfileCompletion(dashboardData.profile)
      });
    }
  }, [dashboardData]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await studentService.getDashboard();
      setDashboardData(response.data);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      showNotification(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const calculateProfileCompletion = (profile) => {
    if (!profile) return 0;
    
    let completedFields = 0;
    let totalFields = 10; // Adjust based on your profile structure
    
    if (profile.personalInfo?.firstName && profile.personalInfo?.firstName !== 'Student') completedFields++;
    if (profile.personalInfo?.lastName) completedFields++;
    if (profile.personalInfo?.phone && profile.personalInfo?.phone !== '0000000000') completedFields++;
    if (profile.personalInfo?.rollNumber) completedFields++;
    if (profile.personalInfo?.branch) completedFields++;
    if (profile.academics?.cgpa > 0) completedFields++;
    if (profile.academics?.tenthMarks > 0) completedFields++;
    if (profile.academics?.twelfthMarks > 0) completedFields++;
    if (profile.skills?.technical?.length > 0) completedFields++;
    if (profile.projects?.length > 0) completedFields++;
    
    return Math.round((completedFields / totalFields) * 100);
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading dashboard..." />;
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <BackButton to={ROUTES.LOGIN} className="mb-4" />
          <Card className="p-8 text-center">
            <p className="text-red-600">Failed to load dashboard data. Please try again.</p>
            <Button onClick={fetchDashboardData} className="mt-4">
              Retry
            </Button>
          </Card>
        </div>
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
      link: ROUTES.STUDENT.APPLICATIONS
    },
    {
      title: 'Pending Applications',
      value: stats.pendingApplications,
      icon: ClockIcon,
      gradient: 'from-amber-500 to-orange-500',
      link: ROUTES.STUDENT.APPLICATIONS
    },
    {
      title: 'Interviews Scheduled',
      value: stats.interviewsScheduled,
      icon: UserIcon,
      gradient: 'from-purple-500 to-purple-600',
      link: ROUTES.STUDENT.APPLICATIONS
    },
    {
      title: 'Offers Received',
      value: stats.offersReceived,
      icon: CheckCircleIcon,
      gradient: 'from-green-500 to-green-600',
      link: ROUTES.STUDENT.APPLICATIONS
    },
    {
      title: 'Eligible Jobs',
      value: stats.eligibleJobs,
      icon: BriefcaseIcon,
      gradient: 'from-indigo-500 to-indigo-600',
      link: ROUTES.STUDENT.JOBS
    },
    {
      title: 'PRS Score',
      value: `${stats.placementReadinessScore}/100`,
      icon: ChartBarIcon,
      gradient: 'from-pink-500 to-rose-500',
      link: ROUTES.STUDENT.PROFILE
    },
    {
      title: 'Level & XP',
      value: `Level ${userStats.level}`,
      subtitle: `${userStats.totalXp} XP`,
      icon: TrophyIcon,
      gradient: 'from-yellow-500 to-orange-500',
      link: '#gamification',
      onClick: () => setShowGamification(true)
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <BackButton to={ROUTES.LOGIN} className="mb-4" />
        </div>
        
        <Card className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white shadow-xl">
          <div className="flex items-center justify-between p-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Welcome back, {profile?.personalInfo?.firstName || 'Student'}! 🚀
              </h1>
              <p className="text-purple-100 text-lg">
                Your journey to success starts here - track your placement progress
              </p>
              {profile?.personalInfo?.firstName === 'Student' && (
                <p className="text-yellow-200 text-sm mt-2 font-medium">
                  💡 Complete your profile to unlock personalized job recommendations
                </p>
              )}
            </div>
            <div className="hidden md:block">
              <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <UserIcon className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => {
            const Component = stat.onClick ? 'button' : Link;
            const props = stat.onClick 
              ? { onClick: stat.onClick }
              : { to: stat.link };
              
            return (
              <Component
                key={index}
                {...props}
                className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 text-left w-full"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-1">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                    {stat.subtitle && (
                      <p className="text-sm text-gray-500 mt-1">
                        {stat.subtitle}
                      </p>
                    )}
                  </div>
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.gradient} shadow-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-purple-600 text-sm font-medium group-hover:text-purple-700">
                  {stat.onClick ? 'View Details' : 'View Details'}
                  <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Component>
            );
          })}
        </div>

        {/* Gamification Section */}
        <Card className="p-8 shadow-lg bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                🎮 Your Placement Journey
              </h2>
              <p className="text-gray-600 mt-1">Level up your career game!</p>
            </div>
            <Button
              onClick={() => setShowGamification(true)}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
            >
              View Full Dashboard 🚀
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <LevelBadge xp={userStats.totalXp} size="lg" />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                <span className="text-sm font-medium text-gray-700">Badges Earned</span>
                <span className="text-lg font-bold text-purple-600">{userStats.earnedBadges.length}/9</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                <span className="text-sm font-medium text-gray-700">Login Streak</span>
                <span className="text-lg font-bold text-green-600">{userStats.consecutiveLogins} days 🔥</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                <span className="text-sm font-medium text-gray-700">Profile Complete</span>
                <span className="text-lg font-bold text-blue-600">{userStats.profileCompletion}%</span>
              </div>
            </div>
          </div>
        </Card>

        {profile && (
          <Card className="p-8 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Placement Readiness Score
              </h2>
              <Link to={ROUTES.STUDENT.PROFILE}>
                <Button variant="outline" size="sm">
                  Improve Score
                </Button>
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
          </Card>
        )}

        <Card className="shadow-lg overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Recent Applications
              </h2>
              <Link to={ROUTES.STUDENT.APPLICATIONS}>
                <Button variant="ghost" size="sm">
                  View All
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Button>
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
                        Applied on {formatDate(application.appliedAt)}
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
                <Link to={ROUTES.STUDENT.JOBS}>
                  <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                    Browse Jobs
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to={ROUTES.STUDENT.JOBS}
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
              to={ROUTES.STUDENT.PROFILE}
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
              to={ROUTES.STUDENT.APPLICATIONS}
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
        </Card>
      </div>
      
      {/* Gamification Modal */}
      {showGamification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">🎮 Gamification Dashboard</h2>
              <Button
                variant="ghost"
                onClick={() => setShowGamification(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </Button>
            </div>
            <div className="p-6">
              <GamificationDashboard />
            </div>
          </div>
        </div>
      )}
      
      {/* XP Notification */}
      <XpNotification
        xpGained={recentXpGain.xp}
        action={recentXpGain.action}
        onComplete={clearXpNotification}
      />
    </div>
  );
};

export default Dashboard;