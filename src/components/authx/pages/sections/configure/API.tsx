import React, { useState, useEffect } from 'react';
import { Key, Copy, Check, RefreshCw, AlertCircle } from 'lucide-react';
import { useTheme } from '../../../../../contexts/ThemeContext';

interface APIProps {
  appId: string;
}

export const API = ({ appId }: APIProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState<'id' | 'secret' | null>(null);
  const [isRegeneratingSecret, setIsRegeneratingSecret] = useState(false);
  const [apiKeys, setApiKeys] = useState({
    publicKey: '',
    secretKey: ''
  });

  useEffect(() => {
    // Only fetch when component mounts
    fetchApiKeys();
  }, [appId]);

  const fetchApiKeys = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://api-eight-navy-68.vercel.app/api/authx/oauth/config/${appId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch API keys');

      const data = await response.json();
      setApiKeys({
        publicKey: data.clientId,
        secretKey: data.clientSecret
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load API keys');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text: string, type: 'id' | 'secret') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleRegenerateSecret = async () => {
    try {
      setIsRegeneratingSecret(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`https://api-eight-navy-68.vercel.app/api/authx/oauth/secret/${appId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to regenerate secret key');

      const data = await response.json();
      setApiKeys(prev => ({
        ...prev,
        secretKey: data.clientSecret
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to regenerate secret key');
    } finally {
      setIsRegeneratingSecret(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-2 rounded-lg ${
          isDark ? 'bg-blue-500/20' : 'bg-blue-50'
        }`}>
          <Key className={isDark ? 'text-blue-400' : 'text-blue-600'} />
        </div>
        <h2 className={`text-xl font-semibold ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          API Configuration
        </h2>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Public Key */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Public Key
          </label>
          <div className="flex gap-2">
            <div className={`flex-1 px-4 py-2 rounded-lg font-mono text-sm ${
              isDark ? 'bg-white/5 text-gray-300' : 'bg-gray-50 text-gray-700'
            }`}>
              {apiKeys.publicKey}
            </div>
            <button
              onClick={() => handleCopy(apiKeys.publicKey, 'id')}
              className={`p-2 rounded-lg transition-colors ${
                isDark
                  ? 'hover:bg-white/10 text-gray-400 hover:text-white'
                  : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
              }`}
            >
              {copied === 'id' ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Secret Key */}
        <div>
          <label className={`block text-sm font-medium mb-2 ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Secret Key
          </label>
          <div className="flex gap-2">
            <div className={`flex-1 px-4 py-2 rounded-lg font-mono text-sm ${
              isDark ? 'bg-white/5 text-gray-300' : 'bg-gray-50 text-gray-700'
            }`}>
              {apiKeys.secretKey}
            </div>
            <button
              onClick={() => handleCopy(apiKeys.secretKey, 'secret')}
              className={`p-2 rounded-lg transition-colors ${
                isDark
                  ? 'hover:bg-white/10 text-gray-400 hover:text-white'
                  : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
              }`}
            >
              {copied === 'secret' ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={handleRegenerateSecret}
              disabled={isRegeneratingSecret}
              className={`p-2 rounded-lg transition-colors ${
                isDark
                  ? 'hover:bg-white/10 text-gray-400 hover:text-white'
                  : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${isRegeneratingSecret ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        <div className={`mt-4 p-4 rounded-lg ${
          isDark ? 'bg-yellow-500/10' : 'bg-yellow-50'
        } border ${
          isDark ? 'border-yellow-500/20' : 'border-yellow-200'
        }`}>
          <p className={`text-sm ${
            isDark ? 'text-yellow-400' : 'text-yellow-800'
          }`}>
            Keep your secret key secure! Never expose it in client-side code or commit it to version control.
          </p>
        </div>
      </div>
    </div>
  );
};