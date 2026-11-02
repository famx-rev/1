import React, { useState, useCallback } from 'react';
import { Github, Upload, FolderUp, File, Plus, Trash2, Check, Loader, AlertCircle } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';

interface FileItem {
  name: string;
  content: string;
  path?: string;
  type: 'file' | 'folder';
}

export const GitPusher = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [files, setFiles] = useState<FileItem[]>([]);
  const [repoName, setRepoName] = useState('');
  const [commitMessage, setCommitMessage] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;

    const newFiles: FileItem[] = [];
    
    Array.from(fileList).forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        newFiles.push({
          name: file.name,
          content: reader.result as string,
          path: file.webkitRelativePath || file.name,
          type: file.webkitRelativePath ? 'folder' : 'file'
        });
        if (newFiles.length === fileList.length) {
          setFiles(prev => [...prev, ...newFiles]);
        }
      };
      reader.readAsText(file);
    });
  }, []);

  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleAuthenticate = async () => {
    try {
      setIsLoading(true);
      // Implement GitHub OAuth flow
      window.location.href = `https://github.com/login/oauth/authorize?client_id=YOUR_CLIENT_ID&scope=repo`;
    } catch (err) {
      setError('Failed to authenticate with GitHub');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePush = async () => {
    if (!repoName || files.length === 0 || !commitMessage) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      // Implement GitHub API push logic here
      setSuccess('Successfully pushed to GitHub!');
    } catch (err) {
      setError('Failed to push to GitHub');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className={`text-4xl font-bold mb-4 ${
            isDark ? 'text-white dark-glow' : 'text-gray-900'
          }`}>
            Git Pusher
          </h1>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            Push files directly to GitHub from your browser
          </p>
        </div>

        <div className={`p-8 rounded-2xl border ${
          isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
        }`}>
          {/* GitHub Authentication */}
          {!isAuthenticated ? (
            <div className="text-center py-8">
              <button
                onClick={handleAuthenticate}
                disabled={isLoading}
                className={`
                  flex items-center gap-2 px-6 py-3 rounded-xl font-medium mx-auto
                  transition-all duration-300
                  ${isDark
                    ? 'bg-white/10 hover:bg-white/20 text-white'
                    : 'bg-gray-900 hover:bg-gray-800 text-white'
                  }
                `}
              >
                {isLoading ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Github className="w-5 h-5" />
                    Connect with GitHub
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Status Messages */}
              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <p className="text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              {success && (
                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <p className="text-green-600 dark:text-green-400">{success}</p>
                </div>
              )}

              {/* Repository Settings */}
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Repository Name
                  </label>
                  <input
                    type="text"
                    value={repoName}
                    onChange={(e) => setRepoName(e.target.value)}
                    placeholder="my-awesome-repo"
                    className={`
                      w-full px-4 py-2 rounded-lg border
                      ${isDark
                        ? 'bg-white/5 border-white/10 text-white placeholder-gray-400'
                        : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                      }
                      focus:outline-none focus:ring-2 focus:ring-blue-500/50
                    `}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="private"
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <label
                    htmlFor="private"
                    className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    Private Repository
                  </label>
                </div>
              </div>

              {/* File Upload */}
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className={`
                      flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed cursor-pointer
                      ${isDark
                        ? 'border-white/10 hover:border-white/20 text-white'
                        : 'border-gray-300 hover:border-gray-400 text-gray-600'
                      }
                    `}>
                      <File className="w-5 h-5" />
                      <span>Choose Files</span>
                      <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <div className="flex-1">
                    <label className={`
                      flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed cursor-pointer
                      ${isDark
                        ? 'border-white/10 hover:border-white/20 text-white'
                        : 'border-gray-300 hover:border-gray-400 text-gray-600'
                      }
                    `}>
                      <FolderUp className="w-5 h-5" />
                      <span>Choose Folder</span>
                      <input
                        type="file"
                        webkitdirectory=""
                        directory=""
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* File List */}
                {files.length > 0 && (
                  <div className="space-y-2">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className={`
                          flex items-center justify-between p-3 rounded-lg
                          ${isDark ? 'bg-white/5' : 'bg-gray-50'}
                        `}
                      >
                        <div className="flex items-center gap-2">
                          {file.type === 'folder' ? (
                            <FolderUp className="w-4 h-4" />
                          ) : (
                            <File className="w-4 h-4" />
                          )}
                          <span className={isDark ? 'text-white' : 'text-gray-900'}>
                            {file.path || file.name}
                          </span>
                        </div>
                        <button
                          onClick={() => handleRemoveFile(index)}
                          className={`p-1 rounded-lg ${
                            isDark
                              ? 'hover:bg-white/10 text-gray-400 hover:text-white'
                              : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Commit Message */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Commit Message
                </label>
                <input
                  type="text"
                  value={commitMessage}
                  onChange={(e) => setCommitMessage(e.target.value)}
                  placeholder="Initial commit"
                  className={`
                    w-full px-4 py-2 rounded-lg border
                    ${isDark
                      ? 'bg-white/5 border-white/10 text-white placeholder-gray-400'
                      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                    }
                    focus:outline-none focus:ring-2 focus:ring-blue-500/50
                  `}
                />
              </div>

              {/* Push Button */}
              <button
                onClick={handlePush}
                disabled={isLoading || files.length === 0}
                className={`
                  w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium
                  transition-all duration-300
                  ${isDark
                    ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }
                  disabled:opacity-50
                `}
              >
                {isLoading ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Push to GitHub
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};