import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Folder, File, Plus, Upload, Search, MoreVertical, CreditCard as Edit, Trash2, Eye, Globe, Download, Share, FolderPlus, FileText, ArrowLeft, Home, ExternalLink } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { EditFile } from './EditFile';

interface DataItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  content?: string;
  file_size?: number;
  is_public?: boolean;
  created_at: string;
  updated_at: string;
  parent_id?: string;
}

interface BreadcrumbItem {
  id: string | null;
  name: string;
}

export const DataHubDashboard = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [items, setItems] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState<DataItem | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createType, setCreateType] = useState<'file' | 'folder'>('file');
  const [newItemName, setNewItemName] = useState('');
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([{ id: null, name: 'Root' }]);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  useEffect(() => {
    fetchItems();
  }, [currentFolder]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required');
        return;
      }

      const url = currentFolder 
        ? `https://api-eight-navy-68.vercel.app/api/d/list?parent_id=${currentFolder}`
        : 'https://api-eight-navy-68.vercel.app/api/d/list';

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch items');
      }

      const data = await response.json();
      setItems(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateItem = async () => {
    if (!newItemName.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://api-eight-navy-68.vercel.app/api/d/new', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: newItemName,
          type: createType,
          content: createType === 'file' ? '' : undefined,
          parent_id: currentFolder
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create item');
      }

      setNewItemName('');
      setShowCreateModal(false);
      fetchItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create item');
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://api-eight-navy-68.vercel.app/api/d/delete/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete item');
      }

      fetchItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete item');
    }
  };

  const handleTogglePublic = async (item: DataItem) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://api-eight-navy-68.vercel.app/api/d/update/${item.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          isPublic: !item.is_public
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update item');
      }

      fetchItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update item');
    }
  };

  const handleFolderClick = (folder: DataItem) => {
    setCurrentFolder(folder.id);
    setBreadcrumbs([...breadcrumbs, { id: folder.id, name: folder.name }]);
  };

  const handleBreadcrumbClick = (index: number) => {
    const newBreadcrumbs = breadcrumbs.slice(0, index + 1);
    setBreadcrumbs(newBreadcrumbs);
    setCurrentFolder(newBreadcrumbs[newBreadcrumbs.length - 1].id);
  };

  const handleFileEdit = (file: DataItem) => {
    setSelectedFile(file);
  };

  const handleFileView = async (file: DataItem) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://api-eight-navy-68.vercel.app/api/d/v/${file.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch file content');
      }

      const data = await response.json();
      setSelectedFile(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to view file');
    }
  };

  const getPublicUrl = (item: DataItem) => {
    if (item.is_public) {
      return `https://api-eight-navy-68.vercel.app/api/d/p/${item.id}`;
    }
    return null;
  };

  const copyPublicUrl = (item: DataItem) => {
    const url = getPublicUrl(item);
    if (url) {
      navigator.clipboard.writeText(url);
      alert('Public URL copied to clipboard!');
    }
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (selectedFile) {
    return (
      <EditFile 
        file={selectedFile} 
        onBack={() => setSelectedFile(null)}
        onSave={() => {
          setSelectedFile(null);
          fetchItems();
        }}
      />
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-black' : 'bg-white'} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              DataHub
            </h1>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Manage your files and folders
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setCreateType('folder');
                setShowCreateModal(true);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                isDark 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              } transition-colors`}
            >
              <FolderPlus className="w-4 h-4" />
              New Folder
            </button>
            
            <button
              onClick={() => {
                setCreateType('file');
                setShowCreateModal(true);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                isDark 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
              } transition-colors`}
            >
              <FileText className="w-4 h-4" />
              New File
            </button>
          </div>
        </div>

        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 mb-6">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              <button
                onClick={() => handleBreadcrumbClick(index)}
                className={`flex items-center gap-1 px-2 py-1 rounded ${
                  isDark 
                    ? 'hover:bg-white/10 text-gray-300 hover:text-white' 
                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                } transition-colors`}
              >
                {index === 0 && <Home className="w-4 h-4" />}
                {crumb.name}
              </button>
              {index < breadcrumbs.length - 1 && (
                <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>/</span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`} />
          <input
            type="text"
            placeholder="Search files and folders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
              isDark 
                ? 'bg-white/5 border-white/10 text-white placeholder-gray-400' 
                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
            } focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300`}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Items Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className={`relative p-4 rounded-xl border ${
                  isDark 
                    ? 'bg-white/5 border-white/10 hover:bg-white/10' 
                    : 'bg-white border-gray-200 hover:shadow-lg'
                } transition-all duration-300 group`}
              >
                {/* Item Icon and Name */}
                <div 
                  className="flex items-center gap-3 mb-3 cursor-pointer"
                  onClick={() => {
                    if (item.type === 'folder') {
                      handleFolderClick(item);
                    } else {
                      handleFileView(item);
                    }
                  }}
                >
                  {item.type === 'folder' ? (
                    <Folder className={`w-8 h-8 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                  ) : (
                    <File className={`w-8 h-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {item.name}
                    </h3>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {item.type === 'file' && item.file_size ? `${item.file_size} bytes` : item.type}
                    </p>
                  </div>
                </div>

                {/* Public URL Display */}
                {item.is_public && (
                  <div className="mb-3 p-2 rounded-lg bg-green-500/10 border border-green-500/20">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-green-600 dark:text-green-400">Public</span>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <input
                        type="text"
                        value={getPublicUrl(item) || ''}
                        readOnly
                        className="flex-1 text-xs bg-transparent border-none outline-none text-green-600 dark:text-green-400"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyPublicUrl(item);
                        }}
                        className="p-1 hover:bg-green-500/20 rounded"
                      >
                        <ExternalLink className="w-3 h-3 text-green-500" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {item.type === 'file' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFileEdit(item);
                        }}
                        className={`p-2 rounded-lg ${
                          isDark 
                            ? 'hover:bg-white/10 text-gray-400 hover:text-white' 
                            : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                        } transition-colors`}
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTogglePublic(item);
                      }}
                      className={`p-2 rounded-lg transition-colors ${
                        item.is_public
                          ? 'bg-green-500/20 text-green-500 hover:bg-green-500/30'
                          : isDark 
                            ? 'hover:bg-white/10 text-gray-400 hover:text-white' 
                            : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                      }`}
                      title={item.is_public ? 'Make Private' : 'Make Public'}
                    >
                      <Globe className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteItem(item.id);
                    }}
                    className={`p-2 rounded-lg ${
                      isDark 
                        ? 'hover:bg-red-500/20 text-gray-400 hover:text-red-400' 
                        : 'hover:bg-red-50 text-gray-600 hover:text-red-600'
                    } transition-colors`}
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredItems.length === 0 && (
          <div className="text-center py-12">
            <Folder className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
            <h3 className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              No items found
            </h3>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {searchQuery ? 'Try adjusting your search query' : 'Create your first file or folder to get started'}
            </p>
          </div>
        )}

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className={`p-6 rounded-xl ${
              isDark ? 'bg-gray-900 border border-white/10' : 'bg-white border border-gray-200'
            } w-full max-w-md mx-4`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Create New {createType === 'file' ? 'File' : 'Folder'}
              </h3>
              
              <input
                type="text"
                placeholder={`${createType === 'file' ? 'File' : 'Folder'} name`}
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border ${
                  isDark 
                    ? 'bg-white/5 border-white/10 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300`}
                autoFocus
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleCreateItem();
                  }
                }}
              />
              
              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={handleCreateItem}
                  disabled={!newItemName.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  Create
                </button>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewItemName('');
                  }}
                  className={`flex-1 px-4 py-2 rounded-lg ${
                    isDark 
                      ? 'bg-white/10 hover:bg-white/20 text-white' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  } transition-colors`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};