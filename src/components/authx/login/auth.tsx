import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { authxApi } from './api';

type AuthMode = 'login' | 'signup' | 'forgot';

export const AuthXLogin = () => {
  const { appId } = useParams<{ appId: string }>();
  const [mode, setMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appId) return;
    
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      switch (mode) {
        case 'login':
          const loginResponse = await authxApi.login(appId, formData.email, formData.password);
          setSuccess(loginResponse.message);
          // Handle successful login - store token, redirect, etc.
          break;

        case 'signup':
          if (formData.password !== formData.confirmPassword) {
            throw new Error('Passwords do not match');
          }
          const signupResponse = await authxApi.signup(
            appId,
            formData.email,
            formData.password,
            formData.username
          );
          setSuccess(signupResponse.message);
          // Handle successful signup
          break;

        case 'forgot':
          const forgotResponse = await authxApi.forgotPassword(appId, formData.email);
          setSuccess(forgotResponse.message);
          break;
      }

      // Clear form after success
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className={`min-h-screen w-full flex items-center justify-center relative overflow-hidden ${
      isDark ? 'bg-black' : 'bg-white'
    }`}>
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className={`absolute inset-0 ${
          isDark ? 'bg-gradient-to-br from-white/5 to-black/5' : 'bg-gradient-to-br from-gray-50/50 to-white/50'
        }`} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full filter blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full filter blur-[100px] animate-pulse delay-700" />
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto px-6 py-12">
        <div className={`backdrop-blur-xl rounded-2xl p-8 transition-colors duration-300 ${
          isDark ? 'bg-black/50 border border-white/10' : 'bg-white/80 shadow-lg'
        }`}>
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img 
              src="https://raw.githubusercontent.com/7054company/7eax/refs/heads/master/logo1.png" 
              alt="AuthX Logo" 
              className="h-12 w-auto"
            />
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className={`text-2xl font-bold mb-2 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {mode === 'login' && 'Welcome Back'}
              {mode === 'signup' && 'Create Account'}
              {mode === 'forgot' && 'Reset Password'}
            </h1>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              {mode === 'login' && 'Sign in to continue to your account'}
              {mode === 'signup' && 'Join to get started with AuthX'}
              {mode === 'forgot' && 'Enter your email to reset your password'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
              <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20">
              <p className="text-green-600 dark:text-green-400 text-sm">{success}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="relative">
                <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Username"
                  className={`
                    w-full pl-12 pr-4 py-3 rounded-xl text-lg
                    transition-all duration-300
                    ${isDark
                      ? 'bg-white/10 text-white placeholder-gray-400'
                      : 'bg-white text-gray-900 placeholder-gray-500 shadow-lg'
                    }
                    focus:outline-none focus:ring-2 focus:ring-blue-500/50
                  `}
                  required
                />
              </div>
            )}

            <div className="relative">
              <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email Address"
                className={`
                  w-full pl-12 pr-4 py-3 rounded-xl text-lg
                  transition-all duration-300
                  ${isDark
                    ? 'bg-white/10 text-white placeholder-gray-400'
                    : 'bg-white text-gray-900 placeholder-gray-500 shadow-lg'
                  }
                  focus:outline-none focus:ring-2 focus:ring-blue-500/50
                `}
                required
              />
            </div>

            {mode !== 'forgot' && (
              <div className="relative">
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  className={`
                    w-full pl-12 pr-12 py-3 rounded-xl text-lg
                    transition-all duration-300
                    ${isDark
                      ? 'bg-white/10 text-white placeholder-gray-400'
                      : 'bg-white text-gray-900 placeholder-gray-500 shadow-lg'
                    }
                    focus:outline-none focus:ring-2 focus:ring-blue-500/50
                  `}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 ${
                    isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            )}

            {mode === 'signup' && (
              <div className="relative">
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm Password"
                  className={`
                    w-full pl-12 pr-12 py-3 rounded-xl text-lg
                    transition-all duration-300
                    ${isDark
                      ? 'bg-white/10 text-white placeholder-gray-400'
                      : 'bg-white text-gray-900 placeholder-gray-500 shadow-lg'
                    }
                    focus:outline-none focus:ring-2 focus:ring-blue-500/50
                  `}
                  required
                />
              </div>
            )}

            {/* Action Links */}
            {mode === 'login' && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  className={`text-sm ${
                    isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'
                  }`}
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`
                w-full flex items-center justify-center gap-2 px-6 py-3
                rounded-xl font-medium text-lg transition-all duration-300
                ${isDark
                  ? 'bg-white text-gray-900 hover:bg-gray-100'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
                }
                disabled:opacity-50
              `}
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {mode === 'login' && 'Sign In'}
                  {mode === 'signup' && 'Create Account'}
                  {mode === 'forgot' && 'Reset Password'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {/* Mode Toggle */}
            <div className="mt-6 text-center">
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                {mode === 'login' ? (
                  <>
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('signup')}
                      className={`font-medium ${
                        isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'
                      }`}
                    >
                      Sign up
                    </button>
                  </>
                ) : (
                  <>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className={`font-medium ${
                        isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'
                      }`}
                    >
                      Sign in
                    </button>
                  </>
                )}
              </p>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
              isDark 
                ? 'bg-white/5 backdrop-blur-sm border border-white/10' 
                : 'bg-gray-50 shadow-sm'
            }`}>
              <img 
                src="https://raw.githubusercontent.com/7054company/7eax/refs/heads/master/logo1.png" 
                alt="7EA Logo" 
                className="h-5 w-auto"
              />
              <span className={`text-sm font-medium ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Secured by 7EA
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthXLogin;