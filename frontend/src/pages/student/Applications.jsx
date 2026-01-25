import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await api.get('/student/applications');
      if (response.data.success) {
        setApplications(response.data.data || response.data);
      }
    } catch (err) {
      setError('Failed to load applications');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'applied':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'interview_scheduled':
        return <CalendarIcon className="h-5 w-5 text-blue-500" />;
      case 'offer_received':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <DocumentTextIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'applied':
        return 'bg-yellow-100 text-yellow-800';
      case 'interview_scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'offer_received':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

  const statusCounts = {
    all: applications.length,
    applied: applications.filter(app => app.status === 'applied').length,
    interview_scheduled: applications.filter(app => app.status === 'interview_scheduled').length,
    offer_received: applications.filter(app => app.status === 'offer_received').length,
    rejected: applications.filter(app => app.status === 'rejected').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
        <p className="text-gray-600 mt-1">
          Track the status of your job applications
        </p>
      </div>

      {/* Status Filter Tabs */}
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { key: 'all', label: 'All Applications', count: statusCounts.all },
              { key: 'applied', label: 'Applied', count: statusCounts.applied },
              { key: 'interview_scheduled', label: 'Interview Scheduled', count: statusCounts.interview_scheduled },
              { key: 'offer_received', label: 'Offers Received', count: statusCounts.offer_received },
              { key: 'rejected', label: 'Rejected', count: statusCounts.rejected },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`${
                  filter === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className={`${
                    filter === tab.key ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-900'
                  } ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Applications List */}
        <div className="divide-y divide-gray-200">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded m-6">
              {error}
            </div>
          )}

          {filteredApplications.length > 0 ? (
            filteredApplications.map((application) => (
              <div key={application._id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 rounded-lg p-3">
                      <BuildingOfficeIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {application.jobId?.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {application.jobId?.companyId?.companyInfo?.name}
                      </p>
                      <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                        <span>Applied: {new Date(application.appliedAt).toLocaleDateString()}</span>
                        {application.matchingScore && (
                          <span className="text-green-600 font-medium">
                            {application.matchingScore}% Match
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(application.status)}
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                      {application.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Interview Rounds */}
                {application.interviewRounds && application.interviewRounds.length > 0 && (
                  <div className="mt-4 pl-16">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Interview Rounds:</h4>
                    <div className="space-y-2">
                      {application.interviewRounds.map((round, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <span className="text-sm font-medium text-gray-900">
                              Round {round.round}: {round.interviewType}
                            </span>
                            {round.scheduledAt && (
                              <p className="text-sm text-gray-600">
                                Scheduled: {new Date(round.scheduledAt).toLocaleString()}
                              </p>
                            )}
                            {round.meetingLink && (
                              <a
                                href={round.meetingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:text-blue-500"
                              >
                                Join Meeting →
                              </a>
                            )}
                          </div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            round.status === 'scheduled' 
                              ? 'bg-blue-100 text-blue-800'
                              : round.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {round.status.toUpperCase()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Feedback */}
                {application.feedback && (
                  <div className="mt-4 pl-16">
                    <h4 className="text-sm font-medium text-gray-900 mb-1">Feedback:</h4>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      {application.feedback}
                    </p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="px-6 py-12 text-center">
              <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                {filter === 'all' ? 'No applications yet' : `No ${filter.replace('_', ' ')} applications`}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {filter === 'all' 
                  ? 'Start applying to jobs to see them here.'
                  : 'Applications with this status will appear here.'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Applications;