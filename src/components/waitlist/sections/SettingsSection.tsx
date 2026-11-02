import React from 'react';
import { Save } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';

export const SettingsSection = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="space-y-8">
      <div>
        <h2 className={`text-2xl font-bold mb-6 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          Waitlist Settings
        </h2>

        <div className={`p-6 rounded-xl border ${
          isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
        }`}>
          <div className="space-y-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Waitlist Name
              </label>
              <input
                type="text"
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDark
                    ? 'bg-white/5 border-white/10 text-white'
                    : 'bg-white border-gray-200 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                placeholder="My Awesome Project"
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Welcome Message
              </label>
              <textarea
                rows={4}
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDark
                    ? 'bg-white/5 border-white/10 text-white'
                    : 'bg-white border-gray-200 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                placeholder="Welcome message for new signups..."
              />
            </div>

            <div>
              <label className={`flex items-center gap-2 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium">Enable referral system</span>
              </label>
            </div>

            <div>
              <label className={`flex items-center gap-2 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium">Auto-approve signups</span>
              </label>
            </div>

            <div className="pt-4 border-t border-gray-200 dark:border-white/10">
              <button className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                isDark
                  ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}>
                <Save className="w-4 h-4" />
                Save Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};