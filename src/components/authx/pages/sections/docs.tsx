import React, { useState } from 'react';
import { 
  Book, Search, ArrowRight, Code, Shield, 
  Zap, Globe, Terminal, Copy, Check,
  FileText, ExternalLink
} from 'lucide-react';
import { useTheme } from '../../../../contexts/ThemeContext';

export const Docs = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCommand, setCopiedCommand] = useState(false);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCommand(true);
      setTimeout(() => setCopiedCommand(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const sections = [
    {
      title: 'Getting Started',
      icon: Book,
      color: 'blue',
      description: 'Learn the basics and get up and running quickly',
      links: ['Quick Start', 'Installation', 'Configuration']
    },
    {
      title: 'Authentication',
      icon: Shield,
      color: 'purple',
      description: 'Implement secure user authentication',
      links: ['OAuth', 'JWT', 'Sessions']
    },
    {
      title: 'API Reference',
      icon: Code,
      color: 'green',
      description: 'Detailed API documentation and examples',
      links: ['Endpoints', 'Parameters', 'Responses']
    }
  ];

  const guides = [
    {
      title: 'User Management',
      description: 'Learn how to manage users and roles',
      icon: Globe,
      color: 'indigo'
    },
    {
      title: 'Security Best Practices',
      description: 'Keep your application secure',
      icon: Shield,
      color: 'red'
    },
    {
      title: 'Performance Tips',
      description: 'Optimize your application',
      icon: Zap,
      color: 'yellow'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className={`
        relative p-8 rounded-2xl overflow-hidden
        ${isDark
          ? 'bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 border border-white/10'
          : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
        }
      `}>
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-grid-white/10" />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10" />
        </div>

        <div className="relative">
          <h1 className={`text-3xl font-bold mb-4 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Documentation
          </h1>
          <p className={`text-lg mb-6 ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Everything you need to build something amazing
          </p>

          <div className="relative max-w-2xl">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <input
              type="text"
              placeholder="Search documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`
                w-full pl-12 pr-4 py-3 rounded-xl border
                transition-all duration-300
                ${isDark
                  ? 'bg-white/5 border-white/10 text-white placeholder-gray-400'
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                }
                focus:outline-none focus:ring-2 focus:ring-blue-500/50
              `}
            />
          </div>
        </div>
      </div>

      {/* Main Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sections.map((section, index) => (
          <div
            key={index}
            className={`
              group p-6 rounded-xl border
              transition-all duration-300 transform hover:scale-[1.02]
              ${isDark
                ? 'bg-white/5 border-white/10 hover:bg-white/10'
                : 'bg-white border-gray-200 hover:shadow-xl'
              }
            `}
          >
            <div className={`p-3 rounded-lg bg-${section.color}-500/10 mb-4 inline-block`}>
              <section.icon className={`w-6 h-6 text-${section.color}-500`} />
            </div>
            
            <h3 className={`text-xl font-semibold mb-2 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {section.title}
            </h3>
            
            <p className={`mb-4 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {section.description}
            </p>

            <ul className="space-y-2">
              {section.links.map((link, i) => (
                <li key={i}>
                  <a
                    href="#"
                    className={`
                      flex items-center gap-2 text-sm
                      transition-colors duration-300
                      ${isDark
                        ? 'text-gray-300 hover:text-white'
                        : 'text-gray-600 hover:text-gray-900'
                      }
                    `}
                  >
                    <ArrowRight className="w-4 h-4" />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Code Example */}
      <div className={`
        p-6 rounded-xl border
        ${isDark
          ? 'bg-white/5 border-white/10'
          : 'bg-white border-gray-200'
        }
      `}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-xl font-semibold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Quick Start
          </h3>
          <button
            onClick={() => handleCopy('npm install @authx/core')}
            className={`p-2 rounded-lg ${
              isDark
                ? 'hover:bg-white/10'
                : 'hover:bg-gray-100'
            }`}
          >
            {copiedCommand ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>

        <div className={`
          p-4 rounded-lg font-mono text-sm
          ${isDark ? 'bg-black/30' : 'bg-gray-900'}
        `}>
          <code className="text-white">
            npm install @authx/core
          </code>
        </div>
      </div>

      {/* Guides Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {guides.map((guide, index) => (
          <a
            key={index}
            href="#"
            className={`
              group p-6 rounded-xl border
              transition-all duration-300 transform hover:scale-[1.02]
              ${isDark
                ? 'bg-white/5 border-white/10 hover:bg-white/10'
                : 'bg-white border-gray-200 hover:shadow-xl'
              }
            `}
          >
            <div className={`p-3 rounded-lg bg-${guide.color}-500/10 mb-4 inline-block`}>
              <guide.icon className={`w-6 h-6 text-${guide.color}-500`} />
            </div>
            
            <h3 className={`text-lg font-semibold mb-2 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {guide.title}
            </h3>
            
            <p className={`text-sm mb-4 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {guide.description}
            </p>

            <div className={`
              flex items-center gap-2 text-sm font-medium
              ${isDark ? 'text-blue-400' : 'text-blue-600'}
            `}>
              Read More
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};