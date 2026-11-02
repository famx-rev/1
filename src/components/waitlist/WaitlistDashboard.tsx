import React, { useState, useEffect } from 'react';
import { ArrowLeft, Loader, AlertCircle } from 'lucide-react';
import { WaitlistNav } from './WaitlistNav';
import { OverviewSection } from './sections/OverviewSection';
import { PeopleSection } from './sections/PeopleSection';
import { JourneySection } from './sections/JourneySection';
import { CampaignsSection } from './sections/CampaignsSection';
import { IntegrationsSection } from './sections/IntegrationsSection';
import { SettingsSection } from './sections/SettingsSection';
import { useTheme } from '../../contexts/ThemeContext';

type Section = 'overview' | 'people' | 'journey' | 'campaigns' | 'integrations' | 'settings';

interface WaitlistDashboardProps {
  projectId: string;
  onBack: () => void;
}

interface ProjectDetails {
  id: string;
  name: string;
  details?: string;
  status: string;
  signups: Array<any>;
}

export const WaitlistDashboard = ({ projectId, onBack }: WaitlistDashboardProps) => {
  const [activeSection, setActiveSection] = useState<Section>('overview');
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    fetchProjectDetails();
  }, [projectId]);

  const fetchProjectDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://api-eight-navy-68.vercel.app/api/waitlist/${projectId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch project details');
      }

      const data = await response.json();
      setProject(data.project);
    } catch (error) {
      setError('Failed to load project details');
      console.error('Error fetching project details:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderSection = () => {
    if (!project) return null;

    switch (activeSection) {
      case 'overview':
        return <OverviewSection />;
      case 'people':
        return <PeopleSection projectId={projectId} />;
      case 'journey':
        return <JourneySection />;
      case 'campaigns':
        return <CampaignsSection />;
      case 'integrations':
        return <IntegrationsSection />;
      case 'settings':
        return <SettingsSection project={project} />;
      default:
        return <OverviewSection />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
        <AlertCircle className="w-5 h-5 text-red-500" />
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className={`p-2 rounded-lg ${
            isDark
              ? 'hover:bg-white/10 text-gray-400 hover:text-white'
              : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
          } transition-colors`}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className={`text-3xl font-bold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            {project?.name}
          </h1>
          {project?.details && (
            <p className={`mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {project.details}
            </p>
          )}
        </div>
      </div>
      
      <WaitlistNav activeSection={activeSection} onSectionChange={setActiveSection} />
      {renderSection()}
    </div>
  );
};