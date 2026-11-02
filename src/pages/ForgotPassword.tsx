import React, { useState, useEffect } from 'react';
import { GlowText } from '../components/GlowText';
import { InputField } from '../components/InputField';
import { Mail, ArrowLeft, ArrowRight, Lock, Check } from 'lucide-react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useResetPassword } from '../hooks/useResetPassword';

type ResetStage = 'email' | 'code' | 'success';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [stage, setStage] = useState<ResetStage>('email');
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { isLoading, error, initiateReset, completeReset } = useResetPassword();
  const location = useLocation();
  const { token } = useParams<{ token?: string }>();

  useEffect(() => {
    // Check if we're on the code page
    if (location.pathname.includes('/forgot-password/code')) {
      setStage('code');
      // If token is provided in URL, set it
      if (token) {
        setResetToken(token);
      }
    }
  }, [location, token]);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await initiateReset(email);
      setStage('code');
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      return;
    }

    try {
      await completeReset(resetToken, newPassword);
      setStage('success');
    } catch (err) {
      // Error is handled by the hook
    }
  };

  return (
    <div className="relative min-h-screen bg-white dark:bg-black overflow-hidden flex items-center justify-center transition-colors duration-300">
      {/* Background effects */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 dark:bg-blue-500/20 rounded-full filter blur-[128px] animate-pulse" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/20 rounded-full filter blur-[128px] animate-pulse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full filter blur-[96px]" />

      <div className="relative w-full max-w-md p-8">
        <div className={`bg-gray-50/80 dark:bg-white/5 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border ${
          isDark ? 'border-white/10' : 'border-gray-200'
        }`}>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">
              <GlowText className={`${isDark ? 'dark-glow' : ''} text-gray-900 dark:text-white`}>
                {stage === 'email' && 'Reset Password'}
                {stage === 'code' && 'New Password'}
                {stage === 'success' && 'Password Reset'}
              </GlowText>
            </h2>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {stage === 'email' && 'Enter your email to receive reset instructions'}
              {stage === 'code' && 'Enter your new password'}
              {stage === 'success' && 'Your password has been successfully reset'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {stage === 'email' && (
            <form onSubmit={handleRequestReset} className="space-y-6">
              <InputField
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                icon={<Mail className="w-5 h-5" />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <button
                type="submit"
                disabled={isLoading}
                className={`group relative w-full px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                  isDark
                    ? 'bg-white/10 hover:bg-white/20 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                } disabled:opacity-50`}
              >
                <span className="relative flex items-center justify-center gap-2">
                  {isLoading ? (
                    <span className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  ) : (
                    <>
                      Send Reset Link
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
              </button>
            </form>
          )}

          {stage === 'code' && (
            <form onSubmit={handleResetPassword} className="space-y-6">
              {!token && (
                <InputField
                  label="Reset Token"
                  type="text"
                  placeholder="Enter reset token"
                  icon={<Lock className="w-5 h-5" />}
                  value={resetToken}
                  onChange={(e) => setResetToken(e.target.value)}
                  required
                />
              )}

              <InputField
                label="New Password"
                type="password"
                placeholder="Enter new password"
                icon={<Lock className="w-5 h-5" />}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />

              <InputField
                label="Confirm Password"
                type="password"
                placeholder="Confirm new password"
                icon={<Lock className="w-5 h-5" />}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              <button
                type="submit"
                disabled={isLoading}
                className={`group relative w-full px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                  isDark
                    ? 'bg-white/10 hover:bg-white/20 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                } disabled:opacity-50`}
              >
                <span className="relative flex items-center justify-center gap-2">
                  {isLoading ? (
                    <span className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  ) : (
                    <>
                      Reset Password
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>
              </button>
            </form>
          )}

          {stage === 'success' && (
            <div className="text-center">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 ${
                isDark ? 'bg-green-500/20' : 'bg-green-100'
              }`}>
                <Check className={`w-8 h-8 ${
                  isDark ? 'text-green-400' : 'text-green-600'
                }`} />
              </div>
              <p className={`mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Your password has been successfully reset. You can now log in with your new password.
              </p>
              <Link
                to="/login"
                className={`inline-flex items-center justify-center px-6 py-3 rounded-xl font-medium ${
                  isDark
                    ? 'bg-white/10 hover:bg-white/20 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                } transition-all duration-300`}
              >
                Back to Login
              </Link>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className={`inline-flex items-center gap-2 ${
                isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'
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