import React, { useState, useEffect } from 'react';
import { Mail, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';

interface Project {
  id: string;
  name: string;
  details?: string;
}

export const PublicWaitlist = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const response = await fetch(`https://api-eight-navy-68.vercel.app/api/waitlist/${projectId}`);
      if (!response.ok) throw new Error('Project not found');
      const data = await response.json();
      setProject(data.project);
    } catch (err) {
      setError('Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const response = await fetch(`https://api-eight-navy-68.vercel.app/api/waitlist/${projectId}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to join waitlist');
      }

      setSuccess(true);
      setEmail('');
    } catch (err: any) {
      setError(err.message || 'Failed to join waitlist');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Project Not Found
          </h1>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            The waitlist you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className={`w-full max-w-md p-8 rounded-2xl ${
        isDark 
          ? 'bg-white/5 border border-white/10' 
          : 'bg-white border border-gray-200 shadow-xl'
      }`}>
        {success ? (
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className={`text-2xl font-bold mb-2 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              You're on the list!
            </h2>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              Thanks for joining. We'll notify you when we launch!
            </p>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h1 className={`text-3xl font-bold mb-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {project.name}
              </h1>
              {project.details && (
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                  {project.details}
                </p>
              )}
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <p className="text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Email Address
                </label>
                <div className="relative">
                  <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className={`w-full pl-10 pr-4 py-2 rounded-xl border ${
                      isDark
                        ? 'bg-white/5 border-white/10 text-white placeholder-gray-400'
                        : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-medium ${
                  isDark
                    ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                } transition-colors disabled:opacity-50`}
              >
                {submitting ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  'Join Waitlist'
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};