import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Heart, Mail, Lock, Eye, EyeOff, User } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectPath = user.role === 'Admin' ? '/dashboard' : '/patient-dashboard';
      navigate(redirectPath);
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = login(email, password);
      if (!success) {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const demoAccounts = [
    { email: 'admin@entnt.in', password: 'admin123', role: 'Admin (Dentist)' },
    { email: 'john@entnt.in', password: 'patient123', role: 'Patient' },
  ];

  const fillDemoCredentials = (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-teal-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-50 rounded-full mix-blend-multiply filter blur-2xl opacity-50 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-r from-primary-600 to-blue-700 rounded-full flex items-center justify-center shadow-xl transform transition-transform duration-300 hover:scale-110">
                <Heart size={40} className="text-white animate-pulse" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-blue-700 bg-clip-text text-transparent mb-2">
            DentalCare
          </h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-600">
            Your smile is our priority - Please sign in to continue
          </p>
        </div>

        {/* Demo accounts */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 shadow-lg backdrop-blur-sm">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <User size={16} className="text-blue-600" />
            </div>
            <h3 className="font-semibold text-blue-800">Demo Accounts</h3>
          </div>
          <div className="space-y-3">
            {demoAccounts.map((account, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-blue-100">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium text-blue-900">{account.role}</p>
                    <p className="text-sm text-blue-700">{account.email}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => fillDemoCredentials(account.email, account.password)}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 shadow-md"
                  >
                    Use
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Login form */}
        <form className="mt-8 space-y-6 bg-white/90 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/20" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center animate-shake">
              <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center mr-3">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              </div>
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail size={20} className="text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none relative block w-full pl-12 pr-4 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:z-10 transition-all duration-200 bg-gray-50 focus:bg-white shadow-inner"
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={20} className="text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none relative block w-full pl-12 pr-12 py-4 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:z-10 transition-all duration-200 bg-gray-50 focus:bg-white shadow-inner"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-gray-100 rounded-r-xl transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={20} className="text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye size={20} className="text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-primary-600 to-blue-700 hover:from-primary-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:hover:scale-100 disabled:hover:shadow-none"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing in...
                </div>
              ) : (
                <span className="flex items-center">
                  <Heart size={20} className="mr-2 group-hover:animate-pulse" />
                  Sign in to DentalCare
                </span>
              )}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="text-center">
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/30">
            <p className="text-sm text-gray-600 mb-2">
              ENTNT Technical Assignment - Dental Center Management
            </p>
            <div className="flex justify-center space-x-4 text-xs text-gray-500">
              <span>✨ Modern UI</span>
              <span>🔒 Secure</span>
              <span>📱 Responsive</span>
              <span>⚡ Fast</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
