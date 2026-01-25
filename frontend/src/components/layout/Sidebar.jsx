import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  ChartBarIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  UserIcon,
  BuildingOfficeIcon,
  UsersIcon,
  ChartPieIcon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const getMenuItems = () => {
    switch (user.role) {
      case 'student':
        return [
          { path: '/student', label: 'Dashboard', icon: ChartBarIcon },
          { path: '/student/jobs', label: 'Job Listings', icon: BriefcaseIcon },
          { path: '/student/applications', label: 'My Applications', icon: DocumentTextIcon },
          { path: '/student/profile', label: 'Profile', icon: UserIcon },
        ];
      case 'company':
        return [
          { path: '/company', label: 'Dashboard', icon: ChartBarIcon },
          { path: '/company/jobs', label: 'Manage Jobs', icon: BriefcaseIcon },
          { path: '/company/applications', label: 'Applications', icon: DocumentTextIcon },
          { path: '/company/profile', label: 'Company Profile', icon: BuildingOfficeIcon },
        ];
      case 'admin':
        return [
          { path: '/admin', label: 'Dashboard', icon: ChartBarIcon },
          { path: '/admin/companies', label: 'Companies', icon: BuildingOfficeIcon },
          { path: '/admin/applications', label: 'Applications', icon: DocumentTextIcon },
          { path: '/admin/placement-process', label: 'Placement Process', icon: UsersIcon },
          { path: '/admin/analytics', label: 'Analytics', icon: ChartPieIcon },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <aside className="w-64 bg-white/80 backdrop-blur-md shadow-xl border-r border-blue-100 min-h-screen fixed left-0 top-16 z-40">
      <div className="p-6">
        <div className="mb-8">
          <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <UserIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900">
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Portal
              </div>
              <div className="text-xs text-blue-600">Welcome back!</div>
            </div>
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700 hover:transform hover:scale-105'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-blue-600'}`} />
                <span>{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
          <div className="text-sm font-medium text-gray-900 mb-2">Need Help?</div>
          <div className="text-xs text-gray-600 mb-3">
            Check out our documentation and support resources.
          </div>
          <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-medium py-2 px-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200">
            Get Support
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;