import React, { useState } from 'react';
import { Save, Loader, AlertCircle, Check } from 'lucide-react';
import { useTheme } from '../../../../../contexts/ThemeContext';

interface AuthConfig {
  emailAuthEnabled?: boolean;
  phoneAuthEnabled?: boolean;
  usernameEnabled?: boolean;
  mfaEnabled?: boolean;
  sessionDuration?: string;
}

interface AuthProps {
  config?: AuthConfig;
  onUpdate: (updates: AuthConfig) => Promise<boolean>;
}

export const Auth = ({ config, onUpdate }: AuthProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState<AuthConfig>(config || {
    emailAuthEnabled: true,
    phoneAuthEnabled: false,
    usernameEnabled: true,
    mfaEnabled: false,
    sessionDuration: '7 days'
  });

  const handleSave = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      await onUpdate(formData);
      
      setSuccess('Authentication settings saved successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save configuration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`p-6 rounded-xl border ${
      isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
    }`}>
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center gap-3">
          <Check className="w-5 h-5 text-green-500" />
          <p className="text-green-600 dark:text-green-400">{success}</p>
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label className={`flex items-center gap-2 ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
            <input
              type="checkbox"
              checked={formData.emailAuthEnabled}
              onChange={(e) => setFormData({ ...formData, emailAuthEnabled: e.target.checked })}
              className="rounded border-gray-300"
            />
            <span className="text-sm font-medium">Enable Email Authentication</span>
          </label>
        </div>

        <div>
          <label className={`flex items-center gap-2 ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
            <input
              type="checkbox"
              checked={formData.phoneAuthEnabled}
              onChange={(e) => setFormData({ ...formData, phoneAuthEnabled: e.target.checked })}
              className="rounded border-gray-300"
            />
            <span className="text-sm font-medium">Enable Phone Authentication</span>
          </label>
        </div>

        <div>
          <label className={`flex items-center gap-2 ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
            <input
              type="checkbox"
              checked={formData.usernameEnabled}
              onChange={(e) => setFormData({ ...formData, usernameEnabled: e.target.checked })}
              className="rounded border-gray-300"
            />
            <span className="text-sm font-medium">Enable Username</span>
          </label>
        </div>

        <div>
          <label className={`flex items-center gap-2 ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
            <input
              type="checkbox"
              checked={formData.mfaEnabled}
              onChange={(e) => setFormData({ ...formData, mfaEnabled: e.target.checked })}
              className="rounded border-gray-300"
            />
            <span className="text-sm font-medium">Enable Multi-Factor Authentication</span>
          </label>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Session Duration
          </label>
          <select
            value={formData.sessionDuration}
            onChange={(e) => setFormData({ ...formData, sessionDuration: e.target.value })}
            className={`w-full px-4 py-2 rounded-lg border ${
              isDark
                ? 'bg-white/5 border-white/10 text-white'
                : 'bg-white border-gray-200 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
          >
            <option value="24 hours">24 hours</option>
            <option value="7 days">7 days</option>
            <option value="30 days">30 days</option>
          </select>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={loading}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              isDark
                ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            } disabled:opacity-50`}
          >
            {loading ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};