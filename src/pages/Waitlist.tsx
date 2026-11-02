import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { WaitlistDashboard } from '../components/waitlist/WaitlistDashboard';
import { WaitlistOverview } from '../components/waitlist/WaitlistOverview';
import { useTheme } from '../contexts/ThemeContext';

export const Waitlist = () => {
  const { projectId } = useParams<{ projectId?: string }>();
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    // If projectId is in URL, set it as selected
    if (projectId) {
      setSelectedProject(projectId);
    }
  }, [projectId]);

  // Handle project selection
  const handleProjectSelect = (id: string) => {
    setSelectedProject(id);
    navigate(`/waitlist/${id}`);
  };

  // Handle back navigation
  const handleBack = () => {
    setSelectedProject(null);
    navigate('/waitlist');
  };

  return (
    <div className={`min-h-screen ${
      isDark ? 'bg-black' : 'bg-white'
    } pt-24 pb-12 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {projectId ? (
          <WaitlistDashboard 
            projectId={projectId} 
            onBack={handleBack}
          />
        ) : (
          <WaitlistOverview 
            onProjectSelect={handleProjectSelect} 
          />
        )}
      </div>
    </div>
  );
};