import React, { useState, useEffect } from 'react';
import { Plus, Users, ArrowRight, Loader, AlertCircle, Crown, Sparkles, Zap, Star } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';

interface Project {
  id: string;
  name: string;
  details?: string;
  status: 'active' | 'draft';
  created_at: string;
  signup_count?: number;
}

interface WaitlistOverviewProps {
  onProjectSelect: (projectId: string) => void;
}

export const WaitlistOverview = ({ onProjectSelect }: WaitlistOverviewProps) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    details: ''
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://api-eight-navy-68.vercel.app/api/waitlist/list', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }

      const data = await response.json();
      const projectsList = data.projects || [];
      setProjects(projectsList);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleProjectSelect = (projectId: string) => {
    navigate(`/waitlist/${projectId}`);
    onProjectSelect(projectId);
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://api-eight-navy-68.vercel.app/api/waitlist/new', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newProject)
      });

      if (!response.ok) {
        throw new Error('Failed to create project');
      }

      await fetchProjects();
      setShowCreateForm(false);
      setNewProject({ name: '', details: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project');
    } finally {
      setIsCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="relative">
          <Loader className="w-8 h-8 animate-spin text-blue-500" />
          <div className="absolute inset-0 blur-lg bg-blue-500/20 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with Gradient Text */}
      <div className="relative">
        <div className="flex justify-between items-center">
          <div>
            <h1 className={`text-4xl font-bold mb-2 bg-clip-text text-transparent ${
              isDark 
                ? 'bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400'
                : 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600'
            }`}>
              Waitlist Projects
            </h1>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              Manage and track your waitlist campaigns
            </p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-xl font-medium
              transition-all duration-300 transform hover:scale-105
              ${isDark
                ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 text-white'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
              }
              shadow-lg hover:shadow-xl
            `}
          >
            <Plus className="w-5 h-5" />
            New Project
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Stats Cards */}
        <div className="space-y-6">
          {/* Premium Plan Card */}
          <div className={`
            relative overflow-hidden p-6 rounded-2xl border transition-all duration-300
            ${isDark 
              ? 'bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 border-white/10'
              : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border-gray-200'
            }
            hover:shadow-xl transform hover:scale-[1.02]
          `}>
            <div className="absolute top-0 right-0 p-2">
              <div className={`
                px-3 py-1 rounded-full text-xs font-semibold
                ${isDark ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-800'}
              `}>
                PREMIUM
              </div>
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <div className={`p-3 rounded-xl ${
                isDark ? 'bg-white/10' : 'bg-white'
              }`}>
                <Crown className={`w-6 h-6 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`} />
              </div>
              <div>
                <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Premium Plan
                </h2>
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                  Unlock advanced features
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Zap className={isDark ? 'text-blue-400' : 'text-blue-600'} />
                <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                  Unlimited projects
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Star className={isDark ? 'text-purple-400' : 'text-purple-600'} />
                <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                  Advanced analytics
                </span>
              </div>
              <button className={`
                w-full py-2.5 rounded-xl font-medium text-center
                transition-all duration-300 transform hover:scale-105
                ${isDark
                  ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 text-white'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                }
              `}>
                Upgrade Now
              </button>
            </div>
          </div>

          {/* Updates Card */}
          <div className={`
            p-6 rounded-2xl border transition-all duration-300
            ${isDark 
              ? 'bg-gradient-to-br from-green-500/10 via-blue-500/10 to-purple-500/10 border-white/10'
              : 'bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 border-gray-200'
            }
            hover:shadow-xl transform hover:scale-[1.02]
          `}>
            <div className="flex items-center gap-4 mb-6">
              <div className={`p-3 rounded-xl ${
                isDark ? 'bg-white/10' : 'bg-white'
              }`}>
                <Sparkles className={`w-6 h-6 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              </div>
              <div>
                <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  What's New
                </h2>
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                  Latest updates
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className={`p-4 rounded-xl ${
                isDark ? 'bg-white/5' : 'bg-white'
              }`}>
                <h3 className={`text-lg font-semibold mb-2 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Enhanced Analytics
                </h3>
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                  Track your waitlist performance with detailed insights and metrics
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="lg:col-span-2 space-y-6">
          {error && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <div className="grid gap-6">
            {projects.map((project) => (
              <button
                key={project.id}
                onClick={() => handleProjectSelect(project.id)}
                className={`
                  w-full p-6 rounded-xl border text-left transition-all duration-300
                  transform hover:scale-[1.02] group
                  ${isDark 
                    ? 'bg-gradient-to-br from-white/10 to-white/5 border-white/10 hover:bg-white/15'
                    : 'bg-white border-gray-200 hover:shadow-xl'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <h3 className={`text-xl font-bold ${
                      isDark ? 'text-white' : 'text-gray-900'
                    }`}>
                      {project.name}
                    </h3>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Users className={`w-4 h-4 ${
                          isDark ? 'text-blue-400' : 'text-blue-600'
                        }`} />
                        <span className={`font-medium ${
                          isDark ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {project.signup_count || 0} signups
                        </span>
                      </div>
                      <span className={`
                        px-3 py-1 rounded-full text-xs font-semibold
                        ${project.status === 'active'
                          ? isDark
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-green-100 text-green-800'
                          : isDark
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-yellow-100 text-yellow-800'
                        }
                      `}>
                        {project.status}
                      </span>
                    </div>
                    {project.details && (
                      <p className={`text-sm ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {project.details}
                      </p>
                    )}
                  </div>
                  
                  <div className={`
                    p-3 rounded-full
                    transition-all duration-300
                    ${isDark
                      ? 'bg-white/5 group-hover:bg-white/10'
                      : 'bg-gray-50 group-hover:bg-gray-100'
                    }
                  `}>
                    <ArrowRight className={`
                      w-5 h-5
                      ${isDark ? 'text-gray-400' : 'text-gray-500'}
                      group-hover:translate-x-1 transition-transform duration-300
                    `} />
                  </div>
                </div>
              </button>
            ))}

            {projects.length === 0 && !error && (
              <div className={`
                text-center p-8 rounded-xl border
                ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}
              `}>
                <div className="max-w-sm mx-auto">
                  <Users className={`w-12 h-12 mx-auto mb-4 ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <p className={`text-lg font-medium mb-2 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    No projects yet
                  </p>
                  <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                    Create your first waitlist project to get started
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Project Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className={`
            w-full max-w-md p-6 rounded-xl
            ${isDark
              ? 'bg-gradient-to-br from-gray-900 to-gray-800 border border-white/10'
              : 'bg-white'
            }
            transform transition-all duration-300
          `}>
            <h3 className={`text-2xl font-bold mb-6 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Create New Project
            </h3>
            <form onSubmit={handleCreateProject} className="space-y-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Project Name
                </label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  className={`
                    w-full px-4 py-3 rounded-xl border
                    transition-all duration-300
                    ${isDark
                      ? 'bg-white/5 border-white/10 text-white focus:bg-white/10'
                      : 'bg-white border-gray-200 text-gray-900'
                    }
                    focus:outline-none focus:ring-2 focus:ring-blue-500/50
                  `}
                  required
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Description
                </label>
                <textarea
                  value={newProject.details}
                  onChange={(e) => setNewProject({ ...newProject, details: e.target.value })}
                  className={`
                    w-full px-4 py-3 rounded-xl border
                    transition-all duration-300
                    ${isDark
                      ? 'bg-white/5 border-white/10 text-white focus:bg-white/10'
                      : 'bg-white border-gray-200 text-gray-900'
                    }
                    focus:outline-none focus:ring-2 focus:ring-blue-500/50
                  `}
                  rows={4}
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className={`
                    px-6 py-2.5 rounded-xl font-medium
                    transition-all duration-300
                    ${isDark
                      ? 'bg-white/10 hover:bg-white/20 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                    }
                  `}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className={`
                    flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium
                    transition-all duration-300
                    ${isDark
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 text-white'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                    }
                  `}
                >
                  {isCreating ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Create Project
                      <Plus className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};