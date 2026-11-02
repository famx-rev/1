import React from 'react';
import { useTheme } from '../../../../contexts/ThemeContext';

interface FormPreviewProps {
  formData: any;
}

export const FormPreview = ({ formData }: FormPreviewProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const renderElement = (element: any) => {
    const styles = {
      ...element.styles,
      transition: 'all 0.3s ease',
    };

    switch (element.type) {
      case 'text':
        return (
          <p style={styles} className="break-words">
            {element.content}
          </p>
        );
      case 'image':
        return (
          <img
            src={element.content}
            alt="Preview"
            style={styles}
            className="max-w-full h-auto rounded-lg"
          />
        );
      case 'checkbox':
        return (
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded border-gray-300" />
            <span style={styles}>{element.content}</span>
          </label>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`
      p-6 rounded-lg border
      ${isDark
        ? 'bg-white/5 border-white/10'
        : 'bg-white border-gray-200'
      }
    `}>
      <div className="space-y-4">
        {formData.elements?.map((element: any) => (
          <div key={element.id}>
            {renderElement(element)}
          </div>
        ))}
      </div>

      {(!formData.elements || formData.elements.length === 0) && (
        <div className={`
          text-center py-8
          ${isDark ? 'text-gray-400' : 'text-gray-600'}
        `}>
          Add elements to preview your form
        </div>
      )}
    </div>
  );
};