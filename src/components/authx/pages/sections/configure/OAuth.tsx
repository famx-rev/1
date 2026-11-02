import React, { useState, useEffect } from 'react';
import { Save, X, Plus, Trash2, Loader, AlertCircle, Check, Key } from 'lucide-react';
import { useTheme } from '../../../../../contexts/ThemeContext';

interface OAuthConfig {
  redirectUris: string[];
  allowedScopes: string[];
  clientId?: string;
  clientSecret?: string;
}

interface OAuthProps {
  appId: string;
  onUpdate: (updates: OAuthConfig) => Promise<boolean>;
}

export const OAuth = ({ appId, onUpdate }: OAuthProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState<OAuthConfig>({
    redirectUris: [],
    allowedScopes: [],
    clientId: '',
    clientSecret: ''
  });
  const [newRedirectUri, setNewRedirectUri] = useState('');
  const [newScope, setNewScope] = useState('');

  useEffect(() => {
    fetchConfig();
  }, [appId]);

  const fetchConfig = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://api-eight-navy-68.vercel.app/api/authx/oauth/config/${appId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch OAuth configuration');

      const data = await response.json();
      setFormData({
        redirectUris: data.redirectUris || [],
        allowedScopes: data.allowedScopes || [],
        clientId: data.clientId,
        clientSecret: data.clientSecret
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      await onUpdate(formData);
      setSuccess('OAuth configuration updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update configuration');
    } finally {
      setSaving(false);
    }
  };

  const handleAddRedirectUri = () => {
    if (!newRedirectUri) return;
    setFormData(prev => ({
      ...prev,
      redirectUris: [...prev.redirectUris, newRedirectUri]
    }));
    setNewRedirectUri('');
  };

  const handleRemoveRedirectUri = (uri: string) => {
    setFormData(prev => ({
      ...prev,
      redirectUris: prev.redirectUris.filter(u => u !== uri)
    }));
  };

  const handleAddScope = () => {
    if (!newScope) return;
    setFormData(prev => ({
      ...prev,
      allowedScopes: [...prev.allowedScopes, newScope]
    }));
    setNewScope('');
  };

  const handleRemoveScope = (scope: string) => {
    setFormData(prev => ({
      ...prev,
      allowedScopes: prev.allowedScopes.filter(s => s !== scope)
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className={`p-6 rounded-xl border ${
      isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
    }`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-2 rounded-lg ${
          isDark ? 'bg-blue-500/20' : 'bg-blue-50'
        }`}>
          <Key className={isDark ? 'text-blue-400' : 'text-blue-600'} />
        </div>
        <h2 className={`text-xl font-semibold ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          OAuth Configuration
        </h2>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-3">
          <Check className="w-5 h-5 text-green-500" />
          <p className="text-green-600 dark:text-green-400">{success}</p>
        </div>
      )}

      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-6">
        {/* Client Credentials */}
        <div>
          <h3 className={`text-lg font-medium mb-4 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Client Credentials
          </h3>
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Client ID
              </label>
              <input
                type="text"
                value={formData.clientId}
                readOnly
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDark
                    ? 'bg-white/5 border-white/10 text-white'
                    : 'bg-white border-gray-200 text-gray-900'
                }`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Client Secret
              </label>
              <input
                type="password"
                value={formData.clientSecret}
                readOnly
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDark
                    ? 'bg-white/5 border-white/10 text-white'
                    : 'bg-white border-gray-200 text-gray-900'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Redirect URIs */}
        <div>
          <h3 className={`text-lg font-medium mb-4 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Redirect URIs
          </h3>
          <div className="space-y-3">
            {formData.redirectUris.map((uri, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={uri}
                  readOnly
                  className={`flex-1 px-4 py-2 rounded-lg border ${
                    isDark
                      ? 'bg-white/5 border-white/10 text-white'
                      : 'bg-white border-gray-200 text-gray-900'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveRedirectUri(uri)}
                  className={`p-2 rounded-lg ${
                    isDark
                      ? 'hover:bg-white/10 text-gray-400 hover:text-white'
                      : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <div className="flex gap-2">
              <input
                type="url"
                value={newRedirectUri}
                onChange={(e) => setNewRedirectUri(e.target.value)}
                placeholder="https://example.com/callback"
                className={`flex-1 px-4 py-2 rounded-lg border ${
                  isDark
                    ? 'bg-white/5 border-white/10 text-white placeholder-gray-400'
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
              />
              <button
                type="button"
                onClick={handleAddRedirectUri}
                disabled={!newRedirectUri}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  isDark
                    ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                } disabled:opacity-50`}
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Allowed Scopes */}
        <div>
          <h3 className={`text-lg font-medium mb-4 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Allowed Scopes
          </h3>
          <div className="space-y-3">
            {formData.allowedScopes.map((scope, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={scope}
                  readOnly
                  className={`flex-1 px-4 py-2 rounded-lg border ${
                    isDark
                      ? 'bg-white/5 border-white/10 text-white'
                      : 'bg-white border-gray-200 text-gray-900'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveScope(scope)}
                  className={`p-2 rounded-lg ${
                    isDark
                      ? 'hover:bg-white/10 text-gray-400 hover:text-white'
                      : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <div className="flex gap-2">
              <input
                type="text"
                value={newScope}
                onChange={(e) => setNewScope(e.target.value)}
                placeholder="Enter scope (e.g., profile, email)"
                className={`flex-1 px-4 py-2 rounded-lg border ${
                  isDark
                    ? 'bg-white/5 border-white/10 text-white placeholder-gray-400'
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
              />
              <button
                type="button"
                onClick={handleAddScope}
                disabled={!newScope}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  isDark
                    ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                } disabled:opacity-50`}
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-white/10">
          <button
            type="submit"
            disabled={saving}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              isDark
                ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            } disabled:opacity-50`}
          >
            {saving ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};