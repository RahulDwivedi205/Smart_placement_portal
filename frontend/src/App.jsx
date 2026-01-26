import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';

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

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={!user ? <Login /> : <Navigate to={`/${user.role}`} />} 
        />
        <Route 
          path="/register" 
          element={!user ? <Register /> : <Navigate to={`/${user.role}`} />} 
        />

        <Route path="/" element={<Layout />}>
          <Route 
            path="/student" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student/jobs" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <JobListings />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student/applications" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <Applications />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student/profile" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <Profile />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/company" 
            element={
              <ProtectedRoute allowedRoles={['company']}>
                <CompanyDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/company/profile" 
            element={
              <ProtectedRoute allowedRoles={['company']}>
                <CompanyProfile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/company/jobs" 
            element={
              <ProtectedRoute allowedRoles={['company']}>
                <CompanyJobs />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/company/jobs/new" 
            element={
              <ProtectedRoute allowedRoles={['company']}>
                <JobForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/company/jobs/:jobId/edit" 
            element={
              <ProtectedRoute allowedRoles={['company']}>
                <JobForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/company/applications" 
            element={
              <ProtectedRoute allowedRoles={['company']}>
                <CompanyApplications />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/companies" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminCompanies />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/applications" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminApplications />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/placement-process" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <PlacementProcess />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/" 
            element={
              user ? (
                <Navigate to={`/${user.role}`} />
              ) : (
                <Navigate to="/login" />
              )
            } 
          />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;