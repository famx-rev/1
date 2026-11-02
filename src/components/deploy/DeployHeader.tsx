import React from 'react';
import { Plus, Github } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface DeployHeaderProps {
  onGitPush: () => void;
}

export const DeployHeader = ({ onGitPush }: DeployHeaderProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className={`text-3xl font-bold mb-2 ${
          isDark ? 'text-white dark-glow-sm' : 'text-gray-900'
        }`}>
          Apps
        </h1>
        <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
          Deploy and manage your applications
        </p>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={onGitPush}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg
            transition-all duration-300
            ${isDark
              ? 'bg-white/10 hover:bg-white/20 text-white'
              : 'bg-gray-900 hover:bg-gray-800 text-white'
            }
          `}
        >
          <Github className="w-5 h-5" />
          Git Push
        </button>
        <button 
          onClick={() => window.open('https://app.koyeb.com/apps/new', '_blank')}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg
            transition-all duration-300
            ${isDark
              ? 'bg-blue-500 hover:bg-blue-600 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
            }
          `}
        >
          <Plus className="w-5 h-5" />
          Create App
        </button>
      </div>
    </div>
  );
};