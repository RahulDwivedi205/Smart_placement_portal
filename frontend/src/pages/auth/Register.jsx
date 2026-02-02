import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { validateEmail, validatePassword, getErrorMessage } from '../../utils';
import { ROUTES, USER_ROLES } from '../../constants';
import BackButton from '../../components/common/BackButton';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: USER_ROLES.STUDENT
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { register } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.role) {
      newErrors.role = 'Please select a role';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      const result = await register(formData);
      
      if (result.success) {
        showNotification('Registration successful!', 'success');
        navigate(`/${result.user.role}`);
      } else {
        showNotification(result.message, 'error');
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      showNotification(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-900 via-indigo-800 to-purple-600">
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-purple-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-indigo-300 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute bottom-32 left-16 w-40 h-40 bg-purple-500 rounded-full opacity-15 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 bg-indigo-400 rounded-full opacity-25 animate-bounce"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-purple-300 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-indigo-400 rounded-full opacity-30 animate-bounce"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="absolute top-6 left-6">
            <BackButton className="text-white hover:text-purple-200 hover:bg-white hover:bg-opacity-10" />
          </div>
          
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                <circle cx="12" cy="12" r="2" fill="currentColor"/>
              </svg>
            </div>
            <h1 className="text-white text-sm font-medium mb-2">CampusConnect Pro</h1>
            <h2 className="text-white text-2xl font-bold mb-8">Create Account</h2>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white border-opacity-20">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-white text-sm font-medium mb-2">Email Address</label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  placeholder="Enter your email"
                  className="bg-white bg-opacity-20 border-white border-opacity-30 text-white placeholder-white placeholder-opacity-70 focus:ring-white focus:ring-opacity-50"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 focus:border-transparent backdrop-blur-sm"
                >
                  <option value={USER_ROLES.STUDENT} className="text-gray-900">Student</option>
                  <option value={USER_ROLES.COMPANY} className="text-gray-900">Company HR</option>
                  <option value={USER_ROLES.ADMIN} className="text-gray-900">Placement Admin</option>
                </select>
                {errors.role && (
                  <p className="text-red-300 text-sm mt-1">{errors.role}</p>
                )}
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Password</label>
                <Input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  placeholder="Enter your password"
                  className="bg-white bg-opacity-20 border-white border-opacity-30 text-white placeholder-white placeholder-opacity-70 focus:ring-white focus:ring-opacity-50"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Confirm Password</label>
                <Input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                  placeholder="Confirm your password"
                  className="bg-white bg-opacity-20 border-white border-opacity-30 text-white placeholder-white placeholder-opacity-70 focus:ring-white focus:ring-opacity-50"
                />
              </div>

              <Button
                type="submit"
                loading={loading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
              >
                Create Account
              </Button>

              <div className="text-center">
                <p className="text-white text-sm opacity-80">
                  Already have an account?{' '}
                  <Link to={ROUTES.LOGIN} className="font-semibold hover:underline">
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;