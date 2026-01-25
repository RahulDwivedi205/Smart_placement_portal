import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const getMenuItems = () => {
    switch (user.role) {
      case 'student':
        return [
          { path: '/student', label: 'Dashboard', icon: '📊' },
          { path: '/student/jobs', label: 'Job Listings', icon: '💼' },
          { path: '/student/applications', label: 'My Applications', icon: '📝' },
          { path: '/student/profile', label: 'Profile', icon: '👤' },
        ];
      case 'company':
        return [
          { path: '/company', label: 'Dashboard', icon: '📊' },
          { path: '/company/jobs', label: 'Manage Jobs', icon: '💼' },
          { path: '/company/applications', label: 'Applications', icon: '📝' },
          { path: '/company/profile', label: 'Company Profile', icon: '🏢' },
        ];
      case 'admin':
        return [
          { path: '/admin', label: 'Dashboard', icon: '📊' },
          { path: '/admin/students', label: 'Students', icon: '👥' },
          { path: '/admin/companies', label: 'Companies', icon: '🏢' },
          { path: '/admin/jobs', label: 'All Jobs', icon: '💼' },
          { path: '/admin/analytics', label: 'Analytics', icon: '📈' },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <aside className="w-64 bg-white shadow-sm min-h-screen">
      <div className="p-4">
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;