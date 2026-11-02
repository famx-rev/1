import React from 'react';
import { NavLink } from './NavLink';
import { useTheme } from '../../contexts/ThemeContext';

interface FooterLink {
  text: string;
  path: string;
  isExternal?: boolean;
}

interface FooterSectionProps {
  title: string;
  links: FooterLink[];
}

export const FooterSection = ({ title, links }: FooterSectionProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div>
      <h4 className={`font-semibold mb-4 ${
        isDark ? 'text-white' : 'text-gray-900'
      }`}>
        {title}
      </h4>
      <ul className="space-y-2">
        {links.map((link, index) => (
          <li key={index}>
            <NavLink to={link.path} isExternal={link.isExternal}>
              {link.text}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};