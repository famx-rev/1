import React, { useState } from 'react';
import { Search, Book, Code, Shield, Zap, ChevronRight, ExternalLink } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface DocSection {
  id: string;
  title: string;
  content: string;
  icon: React.ReactNode;
}

export const Documentation = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const sections: DocSection[] = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: <Book className="w-5 h-5" />,
      content: 'Begin your journey with our comprehensive platform. Follow our step-by-step guide to set up your environment and start building amazing applications.'
    },
    {
      id: 'api-reference',
      title: 'API Reference',
      icon: <Code className="w-5 h-5" />,
      content: 'Explore our extensive API documentation. Learn about endpoints, authentication, and best practices for integrating with our services.'
    },
    {
      id: 'security',
      title: 'Security Guide',
      icon: <Shield className="w-5 h-5" />,
      content: 'Understand our security measures and best practices. Learn how to protect your applications and implement secure authentication.'
    },
    {
      id: 'performance',
      title: 'Performance Tips',
      icon: <Zap className="w-5 h-5" />,
      content: 'Optimize your applications for maximum performance. Discover caching strategies, load balancing, and scaling techniques.'
    }
  ];

  const filteredSections = sections.filter(section =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white dark:bg-black pt-24 pb-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${
            isDark ? 'text-white dark-glow' : 'text-gray-900'
          }`}>
            Documentation
          </h1>
          <p className={`text-xl max-w-2xl mx-auto ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Everything you need to build something amazing
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative group">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <input
              type="text"
              placeholder="Search documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                isDark 
                  ? 'bg-white/5 border-white/10 text-white placeholder-gray-400 focus:border-blue-500/50'
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500 focus:border-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300`}
            />
          </div>
        </div>

        {/* Documentation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {filteredSections.map((section) => (
            <div
              key={section.id}
              className={`group relative p-6 rounded-2xl border backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] ${
                isDark
                  ? 'bg-white/5 border-white/10 hover:bg-white/10'
                  : 'bg-white border-gray-200 hover:shadow-lg'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${
                  isDark ? 'bg-white/10' : 'bg-blue-50'
                }`}>
                  {section.icon}
                </div>
                <div className="flex-1">
                  <h3 className={`text-xl font-semibold mb-2 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    {section.title}
                  </h3>
                  <p className={`mb-4 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {section.content}
                  </p>
                  <a
                    href={`#${section.id}`}
                    className={`inline-flex items-center gap-2 ${
                      isDark
                        ? 'text-blue-400 hover:text-blue-300'
                        : 'text-blue-600 hover:text-blue-500'
                    } transition-colors`}
                  >
                    Learn more
                    <ChevronRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Resources */}
        <div className={`p-8 rounded-2xl ${
          isDark
            ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10'
            : 'bg-gradient-to-br from-blue-50 to-purple-50'
        }`}>
          <h2 className={`text-2xl font-bold mb-6 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Additional Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Community Forums', link: '#' },
              { title: 'Video Tutorials', link: '#' },
              { title: 'Sample Projects', link: '#' }
            ].map((resource, index) => (
              <a
                key={index}
                href={resource.link}
                className={`group flex items-center justify-between p-4 rounded-xl ${
                  isDark
                    ? 'bg-white/5 hover:bg-white/10'
                    : 'bg-white hover:bg-gray-50'
                } border border-white/10 transition-all duration-300`}
              >
                <span className={isDark ? 'text-white' : 'text-gray-900'}>
                  {resource.title}
                </span>
                <ExternalLink className={`w-4 h-4 ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                } group-hover:translate-x-1 transition-transform`} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};