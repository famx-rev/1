import React from 'react';
import { ExternalLink, Activity, Clock, GitBranch } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { StatusBadge } from './StatusBadge';
import { App } from '../../types/deploy';

interface AppCardProps {
  app: App;
  onClick: (app: App) => void;
}

export const AppCard: React.FC<AppCardProps> = ({ app, onClick }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div
      onClick={() => onClick(app)}
      className={`
        cursor-pointer
        relative p-6 rounded-lg border
        transition-all duration-300 hover:scale-[1.02]
        ${isDark
          ? 'bg-white/5 border-white/10 hover:bg-white/10'
          : 'bg-white border-gray-200 hover:shadow-lg'
        }
      `}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <h3 className={`text-lg font-semibold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            {app.name}
          </h3>
          <StatusBadge status={app.status} />
        </div>
        <ExternalLink className={`w-4 h-4 ${
          isDark ? 'text-gray-400' : 'text-gray-500'
        }`} />
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Activity className={`w-4 h-4 ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`} />
          <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
            {app.region}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Clock className={`w-4 h-4 ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`} />
          <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
            Updated {app.lastUpdated}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <GitBranch className={`w-4 h-4 ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`} />
          <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>
            {app.gitBranch}
          </span>
        </div>
      </div>
    </div>
  );
};