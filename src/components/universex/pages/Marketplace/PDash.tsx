import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  ArrowLeft, ExternalLink, Loader, AlertCircle,
  Activity, BarChart2, Users, Settings, Book,
  TrendingUp, TrendingDown, Clock, Shield
} from 'lucide-react';
import { useTheme } from '../../../../contexts/ThemeContext';
import { Product } from './api';
import { productShowApi } from './apishow';

type Section = 'overview' | 'docs' | 'usage' | 'config';

export const PDash = () => {
  const { id } = useParams<{ id: string }>();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState<Section>('overview');

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      // Try to get from cache first
      const cached = localStorage.getItem(`product-${id}`);
      if (cached) {
        setProduct(JSON.parse(cached));
        setLoading(false);
        return;
      }

      const products = await productShowApi.getAllProducts();
      const product = products.find(p => p.id === id);
      
      if (!product) {
        const userProducts = await productShowApi.getUserProducts();
        const userProduct = userProducts.find(p => p.id === id);
        if (!userProduct) {
          throw new Error('Product not found');
        }
        setProduct(userProduct);
        localStorage.setItem(`product-${id}`, JSON.stringify(userProduct));
      } else {
        setProduct(product);
        localStorage.setItem(`product-${id}`, JSON.stringify(product));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { 
                  title: 'Total Revenue', 
                  value: '$1,234.56',
                  change: '+12.3%',
                  trend: 'up',
                  icon: BarChart2 
                },
                { 
                  title: 'Active Users', 
                  value: '256',
                  change: '+8.1%',
                  trend: 'up',
                  icon: Users 
                },
                { 
                  title: 'API Calls', 
                  value: '1.2M',
                  change: '+15.4%',
                  trend: 'up',
                  icon: Activity 
                },
                { 
                  title: 'Error Rate', 
                  value: '0.1%',
                  change: '-5.2%',
                  trend: 'down',
                  icon: Shield 
                }
              ].map((stat, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-xl border transition-all duration-300 ${
                    isDark
                      ? 'bg-white/5 border-white/10 hover:bg-white/10'
                      : 'bg-white border-gray-200 hover:shadow-lg'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {stat.title}
                      </p>
                      <div className="flex items-center gap-2">
                        <h3 className={`text-2xl font-bold ${
                          isDark ? 'text-white' : 'text-gray-900'
                        }`}>
                          {stat.value}
                        </h3>
                        <span className={`flex items-center text-sm ${
                          stat.trend === 'up'
                            ? 'text-green-500'
                            : 'text-red-500'
                        }`}>
                          {stat.trend === 'up' ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                          {stat.change}
                        </span>
                      </div>
                    </div>
                    <stat.icon className={`w-8 h-8 ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                  </div>
                </div>
              ))}
            </div>

            <div className={`p-6 rounded-xl border ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
            }`}>
              <h3 className={`text-xl font-semibold mb-6 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Recent Activity
              </h3>
              <div className="space-y-4">
                {[1, 2, 3].map((_, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg ${
                      isDark ? 'bg-white/5' : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Activity className={`w-5 h-5 ${
                          isDark ? 'text-blue-400' : 'text-blue-600'
                        }`} />
                        <div>
                          <p className={`font-medium ${
                            isDark ? 'text-white' : 'text-gray-900'
                          }`}>
                            API Request Spike
                          </p>
                          <p className={`text-sm ${
                            isDark ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            Increased traffic detected
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className={`w-4 h-4 ${
                          isDark ? 'text-gray-400' : 'text-gray-500'
                        }`} />
                        <span className={`text-sm ${
                          isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          2 minutes ago
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'docs':
        return (
          <div className={`p-6 rounded-xl border ${
            isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
          }`}>
            <div className="prose max-w-none dark:prose-invert">
              {product?.documentation ? (
                <div dangerouslySetInnerHTML={{ __html: product.documentation }} />
              ) : (
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                  No documentation available
                </p>
              )}
            </div>
          </div>
        );

      case 'usage':
        return (
          <div className="space-y-6">
            <div className={`p-6 rounded-xl border ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
            }`}>
              <h3 className={`text-xl font-semibold mb-6 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Usage Analytics
              </h3>
              <div className="h-64 flex items-center justify-center">
                <BarChart2 className={`w-8 h-8 ${
                  isDark ? 'text-gray-600' : 'text-gray-400'
                }`} />
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                  Analytics visualization would go here
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`p-6 rounded-xl border ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
              }`}>
                <h3 className={`text-xl font-semibold mb-6 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Top Users
                </h3>
                <div className="space-y-4">
                  {[1, 2, 3].map((_, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg ${
                        isDark ? 'bg-white/5' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Users className={`w-5 h-5 ${
                            isDark ? 'text-blue-400' : 'text-blue-600'
                          }`} />
                          <div>
                            <p className={`font-medium ${
                              isDark ? 'text-white' : 'text-gray-900'
                            }`}>
                              user@example.com
                            </p>
                            <p className={`text-sm ${
                              isDark ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              {Math.floor(Math.random() * 1000)} requests
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`p-6 rounded-xl border ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
              }`}>
                <h3 className={`text-xl font-semibold mb-6 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Error Distribution
                </h3>
                <div className="space-y-4">
                  {[
                    { code: '404', count: '23', type: 'Not Found' },
                    { code: '429', count: '12', type: 'Too Many Requests' },
                    { code: '500', count: '5', type: 'Server Error' }
                  ].map((error, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg ${
                        isDark ? 'bg-white/5' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`font-medium ${
                            isDark ? 'text-white' : 'text-gray-900'
                          }`}>
                            {error.code} - {error.type}
                          </p>
                          <p className={`text-sm ${
                            isDark ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {error.count} occurrences
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'config':
        return (
          <div className={`p-6 rounded-xl border ${
            isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-xl font-semibold mb-6 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              Configuration
            </h3>
            <div className="space-y-6">
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  API Endpoint
                </label>
                <input
                  type="text"
                  value={product?.apiEndpoint || ''}
                  readOnly
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark
                      ? 'bg-white/5 border-white/10 text-white'
                      : 'bg-white border-gray-200 text-gray-900'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Visibility
                </label>
                <select
                  value={product?.visibility}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark
                      ? 'bg-white/5 border-white/10 text-white'
                      : 'bg-white border-gray-200 text-gray-900'
                  }`}
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Price
                </label>
                <input
                  type="number"
                  value={product?.price}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark
                      ? 'bg-white/5 border-white/10 text-white'
                      : 'bg-white border-gray-200 text-gray-900'
                  }`}
                />
              </div>

              <button className={`
                flex items-center gap-2 px-4 py-2 rounded-lg
                ${isDark
                  ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
                }
              `}>
                Save Changes
              </button>
            </div>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex items-center gap-2 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
        <AlertCircle className="w-5 h-5 text-red-500" />
        <p className="text-red-600 dark:text-red-400">
          {error || 'Product not found'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => window.history.back()}
            className={`p-2 rounded-lg ${
              isDark
                ? 'hover:bg-white/10 text-gray-400 hover:text-white'
                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className={`text-2xl font-bold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {product.name}
            </h1>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              {product.category}
            </p>
          </div>
        </div>
        
        <a
          href={product.apiEndpoint}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            isDark
              ? 'bg-white/10 hover:bg-white/20 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          View API
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Navigation */}
      <div className={`flex rounded-lg p-1 ${
        isDark ? 'bg-white/5' : 'bg-gray-100'
      }`}>
        {[
          { id: 'overview', label: 'Overview', icon: Activity },
          { id: 'docs', label: 'Documentation', icon: Book },
          { id: 'usage', label: 'Usage', icon: BarChart2 },
          { id: 'config', label: 'Configuration', icon: Settings }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id as Section)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg flex-1
              transition-all duration-300
              ${activeSection === tab.id
                ? isDark
                  ? 'bg-white/10 text-white'
                  : 'bg-white text-gray-900 shadow'
                : isDark
                  ? 'text-gray-400 hover:text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }
            `}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {renderSection()}
    </div>
  );
};