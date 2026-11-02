import React from 'react';
import { Plus, Mail, Bell } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';

export const CampaignsSection = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const campaigns = [
    {
      id: 1,
      name: 'Welcome Email',
      type: 'email',
      status: 'active',
      sent: 1234,
      opened: 876,
      clicked: 543
    },
    {
      id: 2,
      name: 'Launch Notification',
      type: 'notification',
      status: 'draft',
      sent: 0,
      opened: 0,
      clicked: 0
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className={`text-2xl font-bold ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          Campaigns
        </h2>
        <button className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
          isDark
            ? 'bg-white/10 hover:bg-white/20 text-white'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}>
          <Plus className="w-4 h-4" />
          Create Campaign
        </button>
      </div>

      <div className="grid gap-6">
        {campaigns.map((campaign) => (
          <div
            key={campaign.id}
            className={`p-6 rounded-xl border ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${
                isDark ? 'bg-white/10' : 'bg-gray-100'
              }`}>
                {campaign.type === 'email' ? (
                  <Mail className={isDark ? 'text-white' : 'text-gray-900'} />
                ) : (
                  <Bell className={isDark ? 'text-white' : 'text-gray-900'} />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`text-xl font-semibold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {campaign.name}
                  </h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    campaign.status === 'active'
                      ? isDark
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-green-100 text-green-800'
                      : isDark
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {campaign.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                      Sent
                    </p>
                    <p className={`text-lg font-semibold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {campaign.sent}
                    </p>
                  </div>
                  <div>
                    <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                      Opened
                    </p>
                    <p className={`text-lg font-semibold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {campaign.opened}
                    </p>
                  </div>
                  <div>
                    <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                      Clicked
                    </p>
                    <p className={`text-lg font-semibold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {campaign.clicked}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};