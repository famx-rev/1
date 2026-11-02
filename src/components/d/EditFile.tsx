import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, Globe, Eye, Download, ExternalLink } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface DataItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  content?: string;
  file_size?: number;
  is_public?: boolean;
  created_at: string;
  updated_at: string;
}

interface EditFileProps {
  file: DataItem | null;
  onBack: () => void;
  onSave: () => void;
}

export const EditFile: React.FC<EditFileProps> = ({ file, onBack, onSave }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const [content, setContent] = useState('');
  const [name, setName] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (file) {
      setContent(file.content || '');
      setName(file.name || '');
      setIsPublic(file.is_public || false);
    }
  }, [file]);

  const handleSave = async () => {
    if (!file) return;

    try {
      setSaving(true);
      setError('');
      
      const token = localStorage.getItem('token');
      const response = await fetch(`https://api-eight-navy-68.vercel.app/api/d/update/${file.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          content,
          isPublic
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save file');
      }

      onSave();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save file');
    } finally {
      setSaving(false);
    }
  };

  const getPublicUrl = () => {
    if (file && isPublic) {
      return `https://api-eight-navy-68.vercel.app/api/d/p/${file.id}`;
    }
    return null;
  };

  const copyPublicUrl = () => {
    const url = getPublicUrl();
    if (url) {
      navigator.clipboard.writeText(url);
      alert('Public URL copied to clipboard!');
    }
  };

  const openPublicUrl = () => {
    const url = getPublicUrl();
    if (url) {
      window.open(url, '_blank');
    }
  };

  if (!file) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-white'} flex items-center justify-center`}>
        <div className={`text-center ${isDark ? 'text-white' : 'text-gray-900'}`}>
          <h2 className="text-xl font-semibold mb-2">No file selected</h2>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            Please select a file to edit
          </p>
          <button
            onClick={onBack}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-white'} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
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
              <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Edit File
              </h1>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {file.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Public URL Actions */}
            {isPublic && (
              <div className="flex items-center gap-2">
                <button
                  onClick={copyPublicUrl}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                    isDark 
                      ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30' 
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  } transition-colors`}
                  title="Copy public URL"
                >
                  <ExternalLink className="w-4 h-4" />
                  Copy URL
                </button>
                
                <button
                  onClick={openPublicUrl}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                    isDark 
                      ? 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30' 
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  } transition-colors`}
                  title="Open public URL"
                >
                  <Eye className="w-4 h-4" />
                  View
                </button>
              </div>
            )}

            <button
              onClick={handleSave}
              disabled={saving}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                isDark 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              } transition-colors disabled:opacity-50`}
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {/* File Settings */}
        <div className={`p-6 rounded-xl border mb-6 ${
          isDark 
            ? 'bg-white/5 border-white/10' 
            : 'bg-white border-gray-200'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            File Settings
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* File Name */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                File Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border ${
                  isDark 
                    ? 'bg-white/5 border-white/10 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300`}
              />
            </div>

            {/* Public Toggle */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Visibility
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPublic(!isPublic)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all ${
                    isPublic
                      ? 'bg-green-500/20 border-green-500/30 text-green-600 dark:text-green-400'
                      : isDark
                        ? 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Globe className="w-4 h-4" />
                  {isPublic ? 'Public' : 'Private'}
                </button>
              </div>
              {isPublic && (
                <div className="mt-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <p className="text-sm text-green-600 dark:text-green-400 mb-2">
                    Public URL:
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={getPublicUrl() || ''}
                      readOnly
                      className="flex-1 text-sm bg-transparent border-none outline-none text-green-600 dark:text-green-400"
                    />
                    <button
                      onClick={copyPublicUrl}
                      className="p-1 hover:bg-green-500/20 rounded"
                    >
                      <ExternalLink className="w-4 h-4 text-green-500" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Editor */}
        <div className={`p-6 rounded-xl border ${
          isDark 
            ? 'bg-white/5 border-white/10' 
            : 'bg-white border-gray-200'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Content
          </h3>
          
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter file content..."
            className={`w-full h-96 px-4 py-3 rounded-xl border resize-none ${
              isDark 
                ? 'bg-white/5 border-white/10 text-white placeholder-gray-400' 
                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
            } focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 font-mono text-sm`}
          />
          
          <div className="mt-4 flex items-center justify-between">
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {content.length} characters
            </p>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setContent('')}
                className={`px-3 py-1 text-sm rounded-lg ${
                  isDark 
                    ? 'hover:bg-white/10 text-gray-400 hover:text-white' 
                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                } transition-colors`}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};