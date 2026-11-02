import React, { useState } from 'react';
import { Code, Copy, Check, Terminal } from 'lucide-react';
import { useTheme } from '../../../../../contexts/ThemeContext';

interface ApiConfProps {
  appId: string;
}

export const ApiConf = ({ appId }: ApiConfProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  const baseUrl = 'https://api-eight-navy-68.vercel.app/api/authx';

  const endpoints = [
    {
      name: 'Sign Up',
      method: 'POST',
      path: `/user/signup`,
      description: 'Register a new user',
      body: {
        email: 'user@example.com',
        password: 'password123',
        username: 'johndoe' // optional
      }
    },
    {
      name: 'Login',
      method: 'POST',
      path: `/user/login`,
      description: 'Authenticate user',
      body: {
        email: 'user@example.com',
        password: 'password123'
      }
    },
    {
      name: 'Forgot Password',
      method: 'POST',
      path: `/user/forgot-password`,
      description: 'Request password reset',
      body: {
        email: 'user@example.com'
      }
    },
    {
      name: 'Reset Password',
      method: 'POST',
      path: `/user/reset-password`,
      description: 'Reset user password',
      body: {
        token: 'reset-token',
        newPassword: 'newpassword123'
      }
    },
    {
      name: 'Current User',
      method: 'GET',
      path: `/user/me`,
      description: 'Get authenticated user details',
      headers: {
        Authorization: 'Bearer <jwt-token>'
      }
    }
  ];

  const handleCopy = async (text: string, endpoint: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedEndpoint(endpoint);
      setTimeout(() => setCopiedEndpoint(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getFullUrl = (path: string) => `${baseUrl}/${appId}${path}`;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-2 rounded-lg ${
          isDark ? 'bg-purple-500/20' : 'bg-purple-50'
        }`}>
          <Terminal className={isDark ? 'text-purple-400' : 'text-purple-600'} />
        </div>
        <h2 className={`text-xl font-semibold ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          API Endpoints
        </h2>
      </div>

      <div className="space-y-6">
        {endpoints.map((endpoint, index) => (
          <div
            key={index}
            className={`p-6 rounded-xl border ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className={`text-lg font-semibold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {endpoint.name}
                </h3>
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                  {endpoint.description}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                isDark
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {endpoint.method}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className={`flex-1 p-3 rounded-lg font-mono text-sm ${
                  isDark ? 'bg-black/30' : 'bg-gray-50'
                }`}>
                  {getFullUrl(endpoint.path)}
                </div>
                <button
                  onClick={() => handleCopy(getFullUrl(endpoint.path), endpoint.path)}
                  className={`p-2 rounded-lg ${
                    isDark
                      ? 'hover:bg-white/10 text-gray-400 hover:text-white'
                      : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {copiedEndpoint === endpoint.path ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              {endpoint.body && (
                <div className={`p-3 rounded-lg font-mono text-sm ${
                  isDark ? 'bg-black/30' : 'bg-gray-50'
                }`}>
                  <pre className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                    {JSON.stringify(endpoint.body, null, 2)}
                  </pre>
                </div>
              )}

              {endpoint.headers && (
                <div className={`p-3 rounded-lg font-mono text-sm ${
                  isDark ? 'bg-black/30' : 'bg-gray-50'
                }`}>
                  <pre className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                    {JSON.stringify(endpoint.headers, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};