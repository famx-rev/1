import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { AuthCard } from '../components/auth/AuthCard';
import { AuthInput } from '../components/auth/AuthInput';
import { AuthButton } from '../components/auth/AuthButton';
import { useTheme } from '../contexts/ThemeContext';
import { authService } from '../services/auth.service';

export const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      setIsLoading(true);
      await authService.login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex min-h-screen items-center justify-center px-4 py-16 transition-colors duration-300 ${
      isDark ? 'bg-black' : 'bg-white'
    }`}>
      <div className="flex w-full max-w-md flex-col items-center gap-6">
        <AuthCard>
          <div className="mb-8">
            <h1 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Welcome back
            </h1>
            <p className={`mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Sign in to your CloudPlatform dashboard.
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <AuthInput
              label="Email"
              type="email"
              placeholder="you@example.com"
              icon={<Mail className="w-4 h-4" />}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              autoComplete="email"
              required
            />

            <AuthInput
              label="Password"
              type="password"
              placeholder="Enter your password"
              icon={<Lock className="w-4 h-4" />}
              labelAction={
                <Link
                  to="/forgot-password"
                  className={`text-xs font-medium transition-colors ${
                    isDark
                      ? 'text-gray-400 hover:text-white'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  Forgot password?
                </Link>
              }
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              autoComplete="current-password"
              required
            />

            <div className="pt-2">
              <AuthButton type="submit" isLoading={isLoading}>
                Sign in
              </AuthButton>
            </div>
          </form>
        </AuthCard>

        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          New to CloudPlatform?{' '}
          <Link
            to="/signup"
            className="font-semibold text-emerald-600 transition-colors hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};
