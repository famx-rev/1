import React, { useState } from 'react';
import { Save, X, Code, Eye, Plus, Trash2, Image, Palette, ListOrdered as BorderAll } from 'lucide-react';
import { useTheme } from '../../../../contexts/ThemeContext';

interface FormEditorProps {
  formType: 'signup' | 'verification' | 'referral';
  initialData: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}

export const FormEditor = ({ formType, initialData, onSave, onCancel }: FormEditorProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [formData, setFormData] = useState(initialData || getDefaultFormData(formType));
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const borderStyles = [
    { label: 'Default', value: 'border-white/10' },
    { label: 'Solid', value: 'border-white/20' },
    { label: 'Dashed', value: 'border-dashed border-white/15' },
    { label: 'Transparent', value: 'border-transparent' }
  ];

  const blurOptions = [
    { label: 'None', value: '' },
    { label: 'Light', value: 'backdrop-blur-sm' },
    { label: 'Medium', value: 'backdrop-blur-md' },
    { label: 'Strong', value: 'backdrop-blur-lg' }
  ];

  function getDefaultFormData(type: string) {
    const baseData = {
      custom: {
        html: '',
        css: '',
        js: ''
      },
      borderStyle: 'border-white/10',
      blurEffect: 'backdrop-blur-md',
      backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
      backgroundOpacity: 0.26
    };

    switch (type) {
      case 'signup':
        return {
          ...baseData,
          title: 'Join the Waitlist',
          description: 'Sign up to get early access',
          logo: '',
          buttonText: 'Join Now',
          successMessage: 'Thanks for joining! We\'ll keep you updated.',
          fields: [
            { type: 'email', label: 'Email', required: true }
          ]
        };
      case 'verification':
        return {
          ...baseData,
          subject: 'Verify your email',
          body: 'Thanks for joining our waitlist! Please verify your email to secure your spot.',
          buttonText: 'Verify Email'
        };
      case 'referral':
        return {
          ...baseData,
          title: 'Invite Friends',
          description: 'Share with friends to move up the waitlist',
          shareText: 'Join me on the waitlist!',
          rewardText: 'Get 5 spots higher for each referral'
        };
      default:
        return baseData;
    }
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStyleChange = (type: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const handleCustomCodeChange = (type: 'html' | 'css' | 'js', value: string) => {
    setFormData(prev => ({
      ...prev,
      custom: {
        ...prev.custom,
        [type]: value
      }
    }));
  };

  const renderPreview = () => {
    const { custom } = formData;
    const combinedHtml = `
      <style>${custom.css}</style>
      ${custom.html}
      <script>${custom.js}</script>
    `;

    return (
      <div className="border rounded-lg p-4 bg-white">
        <div dangerouslySetInnerHTML={{ __html: combinedHtml }} />
      </div>
    );
  };

  const renderStyleOptions = () => (
    <div className="space-y-6 pt-6 border-t border-gray-200 dark:border-white/10">
      <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Style Options
      </h4>
      
      {/* Background Color with Preview */}
      <div className="space-y-2">
        <label className={`flex items-center justify-between text-sm font-medium ${
          isDark ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Background Color
          <div className="flex items-center gap-2">
            <div 
              className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600"
              style={{ backgroundColor: formData.backgroundColor }}
            />
            <input
              type="color"
              value={formData.backgroundColor}
              onChange={(e) => handleInputChange('backgroundColor', e.target.value)}
              className="w-8 h-8 p-0 border-0 rounded cursor-pointer"
            />
          </div>
        </label>
        
        {/* Background Opacity Slider */}
        <div className="space-y-1">
          <label className={`block text-sm font-medium ${
            isDark ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Background Opacity: {formData.backgroundOpacity}
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={formData.backgroundOpacity}
            onChange={(e) => handleInputChange('backgroundOpacity', parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        <div className={`p-4 rounded-lg transition-colors ${
          isDark ? 'bg-white/5' : 'bg-gray-50'
        }`} style={{ 
          backgroundColor: `${formData.backgroundColor}${Math.round(formData.backgroundOpacity * 255).toString(16).padStart(2, '0')}` 
        }}>
          Preview
        </div>
      </div>

      {/* Border Style */}
      <div className="space-y-2">
        <label className={`block text-sm font-medium ${
          isDark ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Border Style
        </label>
        <div className="grid grid-cols-2 gap-2">
          {borderStyles.map((style) => (
            <button
              key={style.value}
              onClick={() => handleStyleChange('borderStyle', style.value)}
              className={`px-4 py-2 rounded-lg border transition-all ${
                formData.borderStyle === style.value
                  ? isDark
                    ? 'bg-white/10 text-white'
                    : 'bg-blue-50 text-blue-600 border-blue-200'
                  : isDark
                    ? 'bg-white/5 hover:bg-white/10 text-gray-300'
                    : 'bg-white hover:bg-gray-50 text-gray-600'
              } ${style.value}`}
            >
              {style.label}
            </button>
          ))}
        </div>
      </div>

      {/* Blur Effect */}
      <div className="space-y-2">
        <label className={`block text-sm font-medium ${
          isDark ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Blur Effect
        </label>
        <div className="grid grid-cols-2 gap-2">
          {blurOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleStyleChange('blurEffect', option.value)}
              className={`px-4 py-2 rounded-lg border transition-all ${
                formData.blurEffect === option.value
                  ? isDark
                    ? 'bg-white/10 text-white'
                    : 'bg-blue-50 text-blue-600 border-blue-200'
                  : isDark
                    ? 'bg-white/5 hover:bg-white/10 text-gray-300'
                    : 'bg-white hover:bg-gray-50 text-gray-600'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderFields = () => {
    switch (formType) {
      case 'signup':
        return (
          <>
            <FormField
              label="Form Title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
            />
            <FormField
              label="Description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              type="textarea"
            />
            <FormField
              label="Logo URL"
              value={formData.logo}
              onChange={(e) => handleInputChange('logo', e.target.value)}
              placeholder="https://example.com/logo.png"
            />
            <FormField
              label="Button Text"
              value={formData.buttonText}
              onChange={(e) => handleInputChange('buttonText', e.target.value)}
            />
            <FormField
              label="Success Message"
              value={formData.successMessage}
              onChange={(e) => handleInputChange('successMessage', e.target.value)}
              type="textarea"
            />
            {renderStyleOptions()}
          </>
        );
      case 'verification':
        return (
          <>
            <FormField
              label="Email Subject"
              value={formData.subject}
              onChange={(e) => handleInputChange('subject', e.target.value)}
            />
            <FormField
              label="Email Body"
              value={formData.body}
              onChange={(e) => handleInputChange('body', e.target.value)}
              type="textarea"
            />
            <FormField
              label="Button Text"
              value={formData.buttonText}
              onChange={(e) => handleInputChange('buttonText', e.target.value)}
            />
          </>
        );
      case 'referral':
        return (
          <>
            <FormField
              label="Page Title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
            />
            <FormField
              label="Description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              type="textarea"
            />
            <FormField
              label="Share Text"
              value={formData.shareText}
              onChange={(e) => handleInputChange('shareText', e.target.value)}
            />
            <FormField
              label="Reward Text"
              value={formData.rewardText}
              onChange={(e) => handleInputChange('rewardText', e.target.value)}
            />
          </>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className={`w-full max-w-2xl p-6 rounded-xl ${
        isDark ? 'bg-gray-900' : 'bg-white'
      } max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-xl font-semibold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Edit {formType.charAt(0).toUpperCase() + formType.slice(1)} Form
          </h3>
          <button
            onClick={onCancel}
            className={`p-2 rounded-lg ${
              isDark
                ? 'hover:bg-white/10 text-gray-400 hover:text-white'
                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {renderFields()}

          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg w-full ${
              isDark
                ? 'bg-white/5 hover:bg-white/10 text-white'
                : 'bg-gray-50 hover:bg-gray-100 text-gray-900'
            }`}
          >
            <Code className="w-4 h-4" />
            {showAdvanced ? 'Hide' : 'Show'} Advanced Options
          </button>

          {showAdvanced && (
            <div className="space-y-4 mt-6 pt-6 border-t border-gray-200 dark:border-white/10">
              <div className="flex justify-between items-center">
                <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Advanced Customization
                </h4>
                <button
                  onClick={() => setPreviewMode(!previewMode)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
                    isDark
                      ? 'bg-white/10 hover:bg-white/20 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  }`}
                >
                  {previewMode ? <Code className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  {previewMode ? 'Edit' : 'Preview'}
                </button>
              </div>

              {previewMode ? renderPreview() : (
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      HTML
                    </label>
                    <textarea
                      value={formData.custom.html}
                      onChange={(e) => handleCustomCodeChange('html', e.target.value)}
                      rows={6}
                      className={`w-full px-4 py-2 rounded-lg border font-mono ${
                        isDark
                          ? 'bg-white/5 border-white/10 text-white'
                          : 'bg-white border-gray-200 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                      placeholder="<div class='custom-form'>...</div>"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      CSS
                    </label>
                    <textarea
                      value={formData.custom.css}
                      onChange={(e) => handleCustomCodeChange('css', e.target.value)}
                      rows={6}
                      className={`w-full px-4 py-2 rounded-lg border font-mono ${
                        isDark
                          ? 'bg-white/5 border-white/10 text-white'
                          : 'bg-white border-gray-200 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                      placeholder=".custom-form { ... }"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      JavaScript
                    </label>
                    <textarea
                      value={formData.custom.js}
                      onChange={(e) => handleCustomCodeChange('js', e.target.value)}
                      rows={6}
                      className={`w-full px-4 py-2 rounded-lg border font-mono ${
                        isDark
                          ? 'bg-white/5 border-white/10 text-white'
                          : 'bg-white border-gray-200 text-gray-900'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
                      placeholder="document.querySelector('.custom-form')..."
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-white/10">
            <button
              onClick={onCancel}
              className={`px-4 py-2 rounded-lg ${
                isDark
                  ? 'bg-white/10 hover:bg-white/20 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
              }`}
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(formData)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                isDark
                  ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface FormFieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: 'text' | 'textarea';
  placeholder?: string;
}

const FormField = ({ label, value, onChange, type = 'text', placeholder }: FormFieldProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div>
      <label className={`block text-sm font-medium mb-2 ${
        isDark ? 'text-gray-300' : 'text-gray-700'
      }`}>
        {label}
      </label>
      {type === 'textarea' ? (
        <textarea
          value={value}
          onChange={onChange}
          rows={4}
          placeholder={placeholder}
          className={`w-full px-4 py-2 rounded-lg border ${
            isDark
              ? 'bg-white/5 border-white/10 text-white'
              : 'bg-white border-gray-200 text-gray-900'
          } focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full px-4 py-2 rounded-lg border ${
            isDark
              ? 'bg-white/5 border-white/10 text-white'
              : 'bg-white border-gray-200 text-gray-900'
          } focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
        />
      )}
    </div>
  );
};