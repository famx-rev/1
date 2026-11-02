import React, { useState } from 'react';
import { ArrowLeft, CreditCard as Edit2, Save, Trash2, ExternalLink, Code, Shield, Activity, Download, Star, Tag, Server, Globe, Terminal, Copy, Check, Book } from 'lucide-react';
import { useTheme } from '../../../../contexts/ThemeContext';

interface ProductDetailsProps {
  productId: string;
  onBack: () => void;
}

export const ProductDetails = ({ productId, onBack }: ProductDetailsProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'docs' | 'usage'>('overview');
  const [copied, setCopied] = useState(false);

  // Mock product data - replace with actual API call
  const product = {
    id: '1',
    name: 'Authentication API',
    description: 'Complete authentication solution with OAuth, JWT, and social logins',
    type: 'api',
    price: '49.99',
    rating: 4.8,
    downloads: '2.3k',
    status: 'published',
    visibility: 'public',
    author: {
      name: 'John Doe',
      id: '123'
    },
    category: 'Security',
    tags: ['auth', 'oauth', 'jwt'],
    apiEndpoint: '/api/v1/auth',
    documentation: `
# Authentication API

## Overview
This API provides a complete authentication solution for your applications.

## Features
- OAuth 2.0 Integration
- JWT Token Management
- Social Login Support
- Two-Factor Authentication

## Getting Started
\`\`\`javascript
const auth = new AuthAPI({
  apiKey: 'your-api-key'
});

const response = await auth.login({
  email: 'user@example.com',
  password: 'password'
});
\`\`\`
    `,
    usage: {
      total: 15234,
      today: 523,
      avgLatency: '120ms',
      successRate: '99.9%'
    }
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'api':
        return <Server className="w-6 h-6" />;
      case 'website':
        return <Globe className="w-6 h-6" />;
      case 'service':
        return <Terminal className="w-6 h-6" />;
      default:
        return <Code className="w-6 h-6" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
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
          <div>
            <h1 className={`text-2xl font-bold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {product.name}
            </h1>
            <div className="flex items-center gap-2">
              <span className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                by {product.author.name}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                product.visibility === 'public'
                  ? isDark
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-green-100 text-green-800'
                  : isDark
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : 'bg-yellow-100 text-yellow-800'
              }`}>
                {product.visibility}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`p-2 rounded-lg ${
              isDark
                ? 'hover:bg-white/10 text-gray-400 hover:text-white'
                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
            }`}
          >
            <Edit2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className={`flex rounded-lg p-1 ${
        isDark ? 'bg-white/5' : 'bg-gray-100'
      }`}>
        {[
          { id: 'overview', label: 'Overview', icon: Code },
          { id: 'docs', label: 'Documentation', icon: Book },
          { id: 'usage', label: 'Usage & Analytics', icon: Activity }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg flex-1
              transition-all duration-300
              ${activeTab === tab.id
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
      <div className={`p-6 rounded-xl border ${
        isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
      }`}>
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl bg-${
                product.type === 'api' ? 'blue' :
                product.type === 'website' ? 'purple' :
                'green'
              }-500/10`}>
                {getTypeIcon(product.type)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {product.category}
                  </span>
                  <span className="text-sm text-yellow-500 flex items-center gap-1">
                    <Star className="w-4 h-4 fill-current" />
                    {product.rating}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className={`text-lg font-semibold mb-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Description
              </h3>
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                {product.description}
              </p>
            </div>

            <div>
              <h3 className={`text-lg font-semibold mb-2 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <span
                    key={index}
                    className={`px-2 py-1 rounded-full text-xs ${
                      isDark
                        ? 'bg-white/10 text-gray-300'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {product.apiEndpoint && (
              <div>
                <h3 className={`text-lg font-semibold mb-2 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  API Endpoint
                </h3>
                <div className="flex gap-2">
                  <div className={`flex-1 px-4 py-2 rounded-lg font-mono text-sm ${
                    isDark ? 'bg-black/30' : 'bg-gray-50'
                  }`}>
                    {product.apiEndpoint}
                  </div>
                  <button
                    onClick={() => handleCopy(product.apiEndpoint)}
                    className={`px-3 rounded-lg ${
                      isDark
                        ? 'bg-white/10 hover:bg-white/20 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                    }`}
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-white/10">
              <div className="flex items-center gap-3">
                <Tag className={`w-5 h-5 ${
                  isDark ? 'text-green-400' : 'text-green-600'
                }`} />
                <span className={`text-2xl font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  ${product.price}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Download className={`w-5 h-5 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`} />
                  <span className={`font-medium ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {product.downloads} downloads
                  </span>
                </div>
                <button className={`
                  flex items-center gap-2 px-6 py-2 rounded-lg
                  transition-all duration-300
                  ${isDark
                    ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }
                `}>
                  Purchase
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'docs' && (
          <div className="prose max-w-none dark:prose-invert">
            <div className={`p-6 rounded-lg ${
              isDark ? 'bg-black/30' : 'bg-gray-50'
            }`}>
              <pre className="whitespace-pre-wrap">
                {product.documentation}
              </pre>
            </div>
          </div>
        )}

        {activeTab === 'usage' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className={`p-6 rounded-xl ${
                isDark ? 'bg-white/5' : 'bg-gray-50'
              }`}>
                <h4 className={`text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Total Requests
                </h4>
                <p className={`text-2xl font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {product.usage.total.toLocaleString()}
                </p>
              </div>

              <div className={`p-6 rounded-xl ${
                isDark ? 'bg-white/5' : 'bg-gray-50'
              }`}>
                <h4 className={`text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Today's Requests
                </h4>
                <p className={`text-2xl font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {product.usage.today.toLocaleString()}
                </p>
              </div>

              <div className={`p-6 rounded-xl ${
                isDark ? 'bg-white/5' : 'bg-gray-50'
              }`}>
                <h4 className={`text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Avg. Latency
                </h4>
                <p className={`text-2xl font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {product.usage.avgLatency}
                </p>
              </div>

              <div className={`p-6 rounded-xl ${
                isDark ? 'bg-white/5' : 'bg-gray-50'
              }`}>
                <h4 className={`text-sm font-medium mb-2 ${
                  isDark ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Success Rate
                </h4>
                <p className={`text-2xl font-bold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {product.usage.successRate}
                </p>
              </div>
            </div>

            {/* Add charts and detailed analytics here */}
          </div>
        )}
      </div>
    </div>
  );
};