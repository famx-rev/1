import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { FooterSection } from './navigation/FooterSection';
import { SocialLinks } from './navigation/SocialLinks';
import { Code } from 'lucide-react';

export const Footer = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const footerSections = [
    { 
      title: 'Product', 
      links: [
        { text: 'Documentation', path: '/documentation' },
        { text: 'API Reference', path: '/documentation#api-reference' },
        { text: 'Pricing', path: '#pricing' },
        { text: 'Security', path: '/documentation#security' }
      ]
    },
    { 
      title: 'Company', 
      links: [
        { text: 'About', path: '/about' },
        { text: 'Contact', path: '/contact' },
        { text: 'Careers', path: '/careers' },
        { text: 'Blog', path: '/blog' }
      ] 
    },
    { 
      title: 'Resources', 
      links: [
        { text: 'Community', path: 'https://discord.com', isExternal: true },
        { text: 'GitHub', path: 'https://github.com', isExternal: true },
        { text: 'Terms', path: '/terms' },
        { text: 'Privacy', path: '/privacy' }
      ] 
    }
  ];

  return (
    <footer className={`relative pt-16 pb-8 ${
      isDark 
        ? 'bg-black/40 border-t border-white/10' 
        : 'bg-gray-50/80 border-t border-gray-200'
    }`}>
      <div className={`absolute inset-0 ${
        isDark
          ? 'bg-gradient-to-b from-transparent to-blue-500/5'
          : 'bg-gradient-to-b from-transparent to-blue-100/20'
      }`} />
      
      <div className="relative container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${
                isDark ? 'bg-white/10' : 'bg-blue-50'
              }`}>
                <Code className={`w-6 h-6 ${
                  isDark ? 'text-blue-400' : 'text-blue-600'
                }`} />
              </div>
              <h3 className={`text-2xl font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Cloud<span className={
                  isDark ? 'text-blue-400' : 'text-blue-600'
                }>Platform</span>
              </h3>
            </div>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              Building the future of cloud computing
            </p>
            <SocialLinks />
          </div>

          {/* Footer Sections */}
          {footerSections.map((section, i) => (
            <FooterSection
              key={i}
              title={section.title}
              links={section.links}
            />
          ))}
        </div>

        <div className={`mt-16 pt-8 ${
          isDark 
            ? 'border-t border-white/10 text-gray-400' 
            : 'border-t border-gray-200 text-gray-600'
        } text-center`}>
          <p>© {new Date().getFullYear()} CloudPlatform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};