import React from 'react';
import { Mail, Loader } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';

interface PublicWaitlistFormProps {
  email: string;
  onEmailChange: (email: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
}

export const PublicWaitlistForm = ({
  email,
  onEmailChange,
  onSubmit,
  submitting
}: PublicWaitlistFormProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label className={`block text-sm font-medium mb-2 ${
          isDark ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Email Address
        </label>
        <div className="relative">
          <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`} />
          <input
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="Enter your email"
            className={`w-full pl-10 pr-4 py-2 rounded-xl border ${
              isDark
                ? 'bg-white/5 border-white/10 text-white placeholder-gray-400'
                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
            } focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-medium ${
          isDark
            ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        } transition-colors disabled:opacity-50`}
      >
        {submitting ? (
          <Loader className="w-5 h-5 animate-spin" />
        ) : (
          'Join Waitlist'
        )}
      </button>
    </form>
  );
};