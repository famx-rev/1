import React from 'react';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface SocialLink {
  icon: React.ElementType;
  href: string;
  label: string;
}

export const SocialLinks = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const socialLinks: SocialLink[] = [
    { icon: Github, href: 'https://github.com', label: 'GitHub' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Mail, href: 'mailto:contact@example.com', label: 'Email' }
  ];

  return (
    <div className="flex space-x-4">
      {socialLinks.map((social, i) => (
        <a
          key={i}
          href={social.href}
          className={`${
            isDark
              ? 'text-gray-400 hover:text-white'
              : 'text-gray-600 hover:text-gray-900'
          } transition-all duration-300`}
          aria-label={social.label}
          target="_blank"
          rel="noopener noreferrer"
        >
          <social.icon className="w-5 h-5" />
        </a>
      ))}
    </div>
  );
};