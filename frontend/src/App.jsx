import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { GamificationProvider } from './context/GamificationContext';
import { useAuth } from './context/AuthContext';
import ErrorBoundary from './components/common/ErrorBoundary';

import Layout from './components/layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import StudentDashboard from './pages/student/Dashboard';
import CompanyDashboard from './pages/company/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';
import JobListings from './pages/student/JobListings';
import Applications from './pages/student/Applications';
import Profile from './pages/student/Profile';
import CompanyProfile from './pages/company/Profile';
import CompanyJobs from './pages/company/Jobs';
import JobForm from './pages/company/JobForm';
import CompanyApplications from './pages/company/Applications';
import AdminCompanies from './pages/admin/Companies';
import AdminApplications from './pages/admin/Applications';
import PlacementProcess from './pages/admin/PlacementProcess';

import { USER_ROLES, ROUTES } from './constants';
import LoadingSpinner from './components/ui/LoadingSpinner';

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading application..." />;
  }

  return (
    <Router>
      <Routes>
        <Route 
          path={ROUTES.LOGIN}
          element={!user ? <Login /> : <Navigate to={`/${user.role}`} />} 
        />
        <Route 
          path={ROUTES.REGISTER}
          element={!user ? <Register /> : <Navigate to={`/${user.role}`} />} 
        />

        <Route path="/" element={<Layout />}>
          {/* Student Routes */}
          <Route 
            path={ROUTES.STUDENT.DASHBOARD}
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.STUDENT]}>
                <StudentDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path={ROUTES.STUDENT.JOBS}
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.STUDENT]}>
                <JobListings />
              </ProtectedRoute>
            } 
          />
          <Route 
            path={ROUTES.STUDENT.APPLICATIONS}
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.STUDENT]}>
                <Applications />
              </ProtectedRoute>
            } 
          />
          <Route 
            path={ROUTES.STUDENT.PROFILE}
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.STUDENT]}>
                <Profile />
              </ProtectedRoute>
            } 
          />

          {/* Company Routes */}
          <Route 
            path={ROUTES.COMPANY.DASHBOARD}
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.COMPANY]}>
                <CompanyDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path={ROUTES.COMPANY.PROFILE}
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.COMPANY]}>
                <CompanyProfile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path={ROUTES.COMPANY.JOBS}
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.COMPANY]}>
                <CompanyJobs />
              </ProtectedRoute>
            } 
          />
          <Route 
            path={ROUTES.COMPANY.JOB_NEW}
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.COMPANY]}>
                <JobForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/company/jobs/:jobId/edit"
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.COMPANY]}>
                <JobForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path={ROUTES.COMPANY.APPLICATIONS}
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.COMPANY]}>
                <CompanyApplications />
              </ProtectedRoute>
            } 
          />

          {/* Admin Routes */}
          <Route 
            path={ROUTES.ADMIN.DASHBOARD}
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path={ROUTES.ADMIN.COMPANIES}
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
                <AdminCompanies />
              </ProtectedRoute>
            } 
          />
          <Route 
            path={ROUTES.ADMIN.APPLICATIONS}
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
                <AdminApplications />
              </ProtectedRoute>
            } 
          />
          <Route 
            path={ROUTES.ADMIN.PLACEMENT_PROCESS}
            element={
              <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
                <PlacementProcess />
              </ProtectedRoute>
            } 
          />

          {/* Default Route */}
          <Route 
            path={ROUTES.HOME}
            element={
              user ? (
                <Navigate to={`/${user.role}`} />
              ) : (
                <Navigate to={ROUTES.LOGIN} />
              )
            } 
          />
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<Navigate to={ROUTES.HOME} />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <NotificationProvider>
        <AuthProvider>
          <GamificationProvider>
            <AppRoutes />
          </GamificationProvider>
        </AuthProvider>
      </NotificationProvider>
    </ErrorBoundary>
  );
}

export default App;