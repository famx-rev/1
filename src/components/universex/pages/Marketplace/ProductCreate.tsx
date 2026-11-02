import React, { useState } from 'react';
import { 
  ArrowLeft, Save, Globe, Server, 
  Terminal, AlertCircle, Plus, Trash2, Loader
} from 'lucide-react';
import { useTheme } from '../../../../contexts/ThemeContext';
import { ProductData, productApi } from './api';

interface ProductCreateProps {
  onBack: () => void;
  onSuccess?: () => void;
  initialData?: ProductData;
  isEditing?: boolean;
  productId?: string;
}

export const ProductCreate = ({ 
  onBack, 
  onSuccess, 
  initialData, 
  isEditing = false,
  productId 
}: ProductCreateProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ProductData>(initialData || {
    name: '',
    description: '',
    type: 'api',
    price: '',
    category: '',
    tags: [],
    visibility: 'private',
    documentation: '',
    apiEndpoint: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isEditing && productId) {
        await productApi.updateProduct(productId, formData);
      } else {
        await productApi.createProduct(formData);
      }
      
      if (onSuccess) {
        onSuccess();
      }
      onBack();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save product');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTagAdd = () => {
    const tag = prompt('Enter tag name:');
    if (tag) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const handleTagRemove = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-hidden">
      <div className={`
        relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-xl
        ${isDark
          ? 'bg-gradient-to-br from-gray-900 to-gray-800 border border-white/10'
          : 'bg-white'
        }
        transform transition-all duration-300
      `}>
        {/* Header - Fixed at top */}
        <div className={`
          sticky top-0 z-10 px-6 py-4 border-b
          ${isDark ? 'border-white/10 bg-gray-900' : 'border-gray-200 bg-white'}
        `}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className={`p-2 rounded-lg ${
                  isDark
                    ? 'hover:bg-white/10 text-gray-400 hover:text-white'
                    : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                }`}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h2 className={`text-xl font-semibold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {isEditing ? 'Edit Product' : 'Create New Product'}
              </h2>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Product Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark
                      ? 'bg-white/5 border-white/10 text-white'
                      : 'bg-white border-gray-200 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as ProductData['type'] })}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark
                      ? 'bg-white/5 border-white/10 text-white'
                      : 'bg-white border-gray-200 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                >
                  <option value="api">API</option>
                  <option value="website">Website</option>
                  <option value="service">Service</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark
                      ? 'bg-white/5 border-white/10 text-white'
                      : 'bg-white border-gray-200 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Price (USD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark
                      ? 'bg-white/5 border-white/10 text-white'
                      : 'bg-white border-gray-200 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                  required
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDark
                    ? 'bg-white/5 border-white/10 text-white'
                    : 'bg-white border-gray-200 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm ${
                      isDark
                        ? 'bg-white/10 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleTagRemove(index)}
                      className="hover:text-red-500"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <button
                type="button"
                onClick={handleTagAdd}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${
                  isDark
                    ? 'bg-white/10 hover:bg-white/20 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }`}
              >
                <Plus className="w-4 h-4" />
                Add Tag
              </button>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Visibility
              </label>
              <select
                value={formData.visibility}
                onChange={(e) => setFormData({ ...formData, visibility: e.target.value as 'private' | 'public' })}
                className={`w-full px-4 py-2 rounded-lg border ${
                  isDark
                    ? 'bg-white/5 border-white/10 text-white'
                    : 'bg-white border-gray-200 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
              >
                <option value="private">Private</option>
                <option value="public">Public</option>
              </select>
            </div>

            {/* Documentation */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Documentation (Markdown)
              </label>
              <textarea
                value={formData.documentation}
                onChange={(e) => setFormData({ ...formData, documentation: e.target.value })}
                rows={8}
                className={`w-full px-4 py-2 rounded-lg border font-mono ${
                  isDark
                    ? 'bg-white/5 border-white/10 text-white'
                    : 'bg-white border-gray-200 text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
              />
            </div>

            {/* API Endpoint (if type is API) */}
            {formData.type === 'api' && (
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  API Endpoint
                </label>
                <input
                  type="text"
                  value={formData.apiEndpoint}
                  onChange={(e) => setFormData({ ...formData, apiEndpoint: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark
                      ? 'bg-white/5 border-white/10 text-white'
                      : 'bg-white border-gray-200 text-gray-900'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                  placeholder="/api/v1/your-endpoint"
                />
              </div>
            )}
          </form>
        </div>

        {/* Footer - Fixed at bottom */}
        <div className={`
          sticky bottom-0 z-10 px-6 py-4 border-t
          ${isDark ? 'border-white/10 bg-gray-900' : 'border-gray-200 bg-white'}
        `}>
          <div className="flex justify-end gap-3">
            <button
              onClick={onBack}
              className={`px-4 py-2 rounded-lg ${
                isDark
                  ? 'bg-white/10 hover:bg-white/20 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                isDark
                  ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              } disabled:opacity-50`}
            >
              {isLoading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};