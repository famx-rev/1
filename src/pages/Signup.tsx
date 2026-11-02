import React, { useState } from 'react';
import { GlowText } from '../components/GlowText';
import { InputField } from '../components/InputField';
import { User, Mail, Lock, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { authService } from '../services/auth.service';

export const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setIsLoading(true);
      await authService.register(formData.username, formData.email, formData.password);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-white dark:bg-black overflow-hidden flex items-center justify-center transition-colors duration-300">
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/20 rounded-full filter blur-[128px] animate-pulse" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/20 rounded-full filter blur-[128px] animate-pulse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full filter blur-[96px]" />

      <div className="relative w-full max-w-md p-8">
        <div className="bg-gray-50/80 dark:bg-white/5 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-gray-200 dark:border-white/10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">
              <GlowText className={`${isDark ? 'dark-glow' : ''} text-gray-900 dark:text-white`}>
                Create Account
              </GlowText>
            </h2>
            <p className={`${isDark ? 'text-gray-400 dark-glow-xs' : 'text-gray-600'}`}>
              Join our platform and start building
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              label="Username"
              type="text"
              placeholder="Enter your username"
              icon={<User className="w-5 h-5" />}
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
            />

            <InputField
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              icon={<Mail className="w-5 h-5" />}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />

            <InputField
              label="Password"
              type="password"
              placeholder="Create a password"
              icon={<Lock className="w-5 h-5" />}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />

            <InputField
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              icon={<Lock className="w-5 h-5" />}
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
            />

            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black transition-all duration-300 disabled:opacity-70"
            >
              <span className={`flex items-center justify-center gap-2 ${isDark ? 'dark-glow-sm' : ''}`}>
                {isLoading ? (
                  <span className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className={`inline-flex items-center gap-2 ${
                isDark ? 'text-blue-400 hover:text-blue-300 dark-glow-xs' : 'text-blue-600 hover:text-blue-500'
              } transition-colors`}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};