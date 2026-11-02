import React from 'react';
import { Plus } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';

export const IntegrationsSection = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const integrations = [
    {
      id: 1,
      name: 'Mailchimp',
      description: 'Sync your waitlist with Mailchimp',
      connected: true,
      icon: '📧'
    },
    {
      id: 2,
      name: 'Slack',
      description: 'Get notifications in Slack',
      connected: false,
      icon: '💬'
    },
    {
      id: 3,
      name: 'Discord',
      description: 'Manage community in Discord',
      connected: false,
      icon: '🎮'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className={`text-2xl font-bold ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          Integrations
        </h2>
        <button className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
          isDark
            ? 'bg-white/10 hover:bg-white/20 text-white'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}>
          <Plus className="w-4 h-4" />
          Add Integration
        </button>
      </div>

      <div className="grid gap-6">
        {integrations.map((integration) => (
          <div
            key={integration.id}
            className={`p-6 rounded-xl border ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-4xl">{integration.icon}</div>
                <div>
                  <h3 className={`text-xl font-semibold mb-1 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {integration.name}
                  </h3>
                  <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                    {integration.description}
                  </p>
                </div>
              </div>
              
              <button className={`px-4 py-2 rounded-lg ${
                integration.connected
                  ? isDark
                    ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400'
                    : 'bg-red-100 hover:bg-red-200 text-red-600'
                  : isDark
                    ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400'
                    : 'bg-blue-100 hover:bg-blue-200 text-blue-600'
              }`}>
                {integration.connected ? 'Disconnect' : 'Connect'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};