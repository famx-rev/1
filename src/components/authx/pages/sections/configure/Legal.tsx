import React, { useState } from 'react';
import { Save, Loader, AlertCircle, Check, Shield } from 'lucide-react';
import { useTheme } from '../../../../../contexts/ThemeContext';

interface LegalConfig {
  termsUrl?: string;
  privacyUrl?: string;
  companyName?: string;
  companyAddress?: string;
  dataProcessingEnabled?: boolean;
  cookieConsentEnabled?: boolean;
}

interface LegalProps {
  config?: LegalConfig;
  onUpdate: (updates: LegalConfig) => Promise<boolean>;
}

export const Legal = ({ config, onUpdate }: LegalProps) => {
  const [formData, setFormData] = useState<LegalConfig>(config || {
    termsUrl: '',
    privacyUrl: '',
    companyName: '',
    companyAddress: '',
    dataProcessingEnabled: false,
    cookieConsentEnabled: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      await onUpdate(formData);
      setSuccess('Legal settings updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update legal settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`p-6 rounded-xl border ${
      isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
    }`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-2 rounded-lg ${
          isDark ? 'bg-blue-500/20' : 'bg-blue-50'
        }`}>
          <Shield className={isDark ? 'text-blue-400' : 'text-blue-600'} />
        </div>
        <div>
          <h2 className={`text-xl font-semibold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Legal Configuration
          </h2>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            Configure the legal compliance settings for your application
          </p>
        </div>
      </div>

      {/* Status Messages */}
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
        {/* Terms of Service URL */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Terms of Service URL
          </label>
          <input
            type="url"
            value={formData.termsUrl}
            onChange={(e) => setFormData({ ...formData, termsUrl: e.target.value })}
            placeholder="https://example.com/terms-of-service"
            className={`w-full px-4 py-2 rounded-lg border ${
              isDark
                ? 'bg-white/5 border-white/10 text-white placeholder-gray-400'
                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
            } focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
          />
          <p className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            The URL to your terms of service document
          </p>
        </div>

        {/* Privacy Policy URL */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Privacy Policy URL
          </label>
          <input
            type="url"
            value={formData.privacyUrl}
            onChange={(e) => setFormData({ ...formData, privacyUrl: e.target.value })}
            placeholder="https://example.com/privacy-policy"
            className={`w-full px-4 py-2 rounded-lg border ${
              isDark
                ? 'bg-white/5 border-white/10 text-white placeholder-gray-400'
                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
            } focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
          />
          <p className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            The URL to your privacy policy document
          </p>
        </div>

        {/* Company Information */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Company Name
          </label>
          <input
            type="text"
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            placeholder="Your Company Name"
            className={`w-full px-4 py-2 rounded-lg border ${
              isDark
                ? 'bg-white/5 border-white/10 text-white placeholder-gray-400'
                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
            } focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Company Address
          </label>
          <textarea
            value={formData.companyAddress}
            onChange={(e) => setFormData({ ...formData, companyAddress: e.target.value })}
            placeholder="Your Company's Legal Address"
            rows={3}
            className={`w-full px-4 py-2 rounded-lg border ${
              isDark
                ? 'bg-white/5 border-white/10 text-white placeholder-gray-400'
                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
            } focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
          />
        </div>

        {/* Consent Settings */}
        <div className={`p-4 rounded-lg ${
          isDark ? 'bg-white/5' : 'bg-gray-50'
        }`}>
          <h3 className={`text-lg font-medium mb-4 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Consent Settings
          </h3>
          
          <div className="space-y-4">
            <label className={`flex items-center gap-2 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <input
                type="checkbox"
                checked={formData.dataProcessingEnabled}
                onChange={(e) => setFormData({ ...formData, dataProcessingEnabled: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <span className="text-sm font-medium">Enable Data Processing Consent</span>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Require explicit consent for data processing during signup
                </p>
              </div>
            </label>

            <label className={`flex items-center gap-2 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <input
                type="checkbox"
                checked={formData.cookieConsentEnabled}
                onChange={(e) => setFormData({ ...formData, cookieConsentEnabled: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <span className="text-sm font-medium">Enable Cookie Consent</span>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Show cookie consent banner to comply with privacy regulations
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-white/10">
          <button
            onClick={handleSubmit}
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