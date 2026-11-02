import { useState, useEffect } from 'react';

interface Project {
  id: string;
  name: string;
  details?: string;
  status: string;
  created_at: string;
}

export const useWaitlistProject = (projectId?: string) => {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) {
        setError('Project ID is required');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`https://api-eight-navy-68.vercel.app/api/waitlist/view/${projectId}`);
        if (!response.ok) throw new Error('Project not found');
        
        const data = await response.json();
        if (!data.project) {
          throw new Error('Project not found');
        }
        
        setProject(data.project);
      } catch (err) {
        setError('Failed to load project');
        console.error('Error fetching project:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  return { project, loading, error };
};