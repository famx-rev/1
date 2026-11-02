import React from 'react';
import { useTheme } from '../../../../contexts/ThemeContext';
import { FormPreview } from './FormPreview';
import { FormCustomizer } from './FormCustomizer';

interface SignupFormProps {
  formData: any;
  onUpdate: (data: any) => void;
}

export const SignupForm = ({ formData, onUpdate }: SignupFormProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = React.useState<'edit' | 'preview'>('edit');

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className={`flex rounded-lg p-1 ${
        isDark ? 'bg-white/5' : 'bg-gray-100'
      }`}>
        {['edit', 'preview'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as 'edit' | 'preview')}
            className={`
              flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-300
              ${activeTab === tab
                ? isDark
                  ? 'bg-white/10 text-white'
                  : 'bg-white text-gray-900 shadow'
                : isDark
                  ? 'text-gray-400 hover:text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }
            `}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'edit' ? (
        <FormCustomizer
          formData={formData}
          onUpdate={onUpdate}
        />
      ) : (
        <FormPreview formData={formData} />
      )}
    </div>
  );
};