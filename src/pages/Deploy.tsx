import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DeployHeader } from '../components/deploy/DeployHeader';
import { AppCard } from '../components/deploy/AppCard';
import { GitPusher } from '../components/deploy/gitpush/GitPusher';
import { App } from '../types/deploy';

export const Deploy = () => {
  const [apps] = useState<App[]>([
    {
      id: '1',
      name: 'frontend-app',
      status: 'running',
      region: 'fra-1',
      lastUpdated: '2 hours ago',
      gitBranch: 'main',
      url: 'https://frontend-app.koyeb.app'
    },
    {
      id: '2',
      name: 'api-service',
      status: 'running',
      region: 'fra-1',
      lastUpdated: '1 day ago',
      gitBranch: 'main',
      url: 'https://api-service.koyeb.app'
    },
    {
      id: '3',
      name: 'worker-service',
      status: 'stopped',
      region: 'fra-1',
      lastUpdated: '5 days ago',
      gitBranch: 'develop'
    }
  ]);

  const location = useLocation();
  const navigate = useNavigate();
  const isGitPusher = location.pathname.includes('/deploy/gitpush');

  const handleAppClick = (app: App) => {
    if (app.url) {
      window.open(app.url, '_blank');
    }
  };

  if (isGitPusher) {
    return <GitPusher />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        <DeployHeader onGitPush={() => navigate('/deploy/gitpush')} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apps.map((app) => (
            <AppCard 
              key={app.id} 
              app={app} 
              onClick={handleAppClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
};