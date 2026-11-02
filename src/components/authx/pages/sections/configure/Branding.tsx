import React, { useState } from 'react';
import { Save, Loader, AlertCircle, Check } from 'lucide-react';
import { useTheme } from '../../../../../contexts/ThemeContext';

interface BrandingConfig {
  appName?: string;
  logoUrl?: string;
  primaryColor?: string;
  description?: string;
}

interface BrandingProps {
  config?: BrandingConfig;
  onUpdate: (updates: BrandingConfig) => Promise<boolean>;
}

export const Branding = ({ config, onUpdate }: BrandingProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState<BrandingConfig>(config || {
    appName: '',
    logoUrl: '',
    primaryColor: '#3B82F6',
    description: ''
  });

  const handleSave = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      await onUpdate(formData);
      
      setSuccess('Branding settings saved successfully');
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
          <label className={`block text-sm font-medium mb-2 ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Application Name
          </label>
          <input
            type="text"
            value={formData.appName}
            onChange={(e) => setFormData({ ...formData, appName: e.target.value })}
            className={`w-full px-4 py-2 rounded-lg border ${
              isDark
                ? 'bg-white/5 border-white/10 text-white'
                : 'bg-white border-gray-200 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Logo URL
          </label>
          <input
            type="url"
            value={formData.logoUrl}
            onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
            className={`w-full px-4 py-2 rounded-lg border ${
              isDark
                ? 'bg-white/5 border-white/10 text-white'
                : 'bg-white border-gray-200 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Primary Color
          </label>
          <div className="flex gap-4">
            <input
              type="color"
              value={formData.primaryColor}
              onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
              className="h-10 w-20 rounded cursor-pointer"
            />
            <input
              type="text"
              value={formData.primaryColor}
              onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
              className={`flex-1 px-4 py-2 rounded-lg border ${
                isDark
                  ? 'bg-white/5 border-white/10 text-white'
                  : 'bg-white border-gray-200 text-gray-900'
              } focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
            />
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className={`w-full px-4 py-2 rounded-lg border ${
              isDark
                ? 'bg-white/5 border-white/10 text-white'
                : 'bg-white border-gray-200 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
          />
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