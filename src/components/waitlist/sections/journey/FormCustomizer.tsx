import React from 'react';
import { Plus, Trash2, Move, Type, Check, Image } from 'lucide-react';
import { useTheme } from '../../../../contexts/ThemeContext';

interface FormCustomizerProps {
  formData: any;
  onUpdate: (data: any) => void;
}

export const FormCustomizer = ({ formData, onUpdate }: FormCustomizerProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const addElement = (type: string) => {
    const newElement = {
      id: Date.now(),
      type,
      content: '',
      styles: {},
    };

    onUpdate({
      ...formData,
      elements: [...(formData.elements || []), newElement],
    });
  };

  const updateElement = (id: number, updates: any) => {
    const elements = formData.elements?.map((el: any) =>
      el.id === id ? { ...el, ...updates } : el
    );

    onUpdate({
      ...formData,
      elements,
    });
  };

  const removeElement = (id: number) => {
    const elements = formData.elements?.filter((el: any) => el.id !== id);
    onUpdate({
      ...formData,
      elements,
    });
  };

  return (
    <div className="space-y-6">
      {/* Element Toolbar */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { icon: Type, label: 'Text' },
          { icon: Image, label: 'Image' },
          { icon: Check, label: 'Checkbox' },
        ].map(({ icon: Icon, label }) => (
          <button
            key={label}
            onClick={() => addElement(label.toLowerCase())}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap
              ${isDark
                ? 'bg-white/10 hover:bg-white/20 text-white'
                : 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-900'
              }
            `}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Elements List */}
      <div className="space-y-4">
        {formData.elements?.map((element: any) => (
          <div
            key={element.id}
            className={`
              group relative p-4 rounded-lg border
              ${isDark
                ? 'bg-white/5 border-white/10'
                : 'bg-white border-gray-200'
              }
            `}
          >
            {/* Element Controls */}
            <div className="absolute right-2 top-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => removeElement(element.id)}
                className={`p-1 rounded-lg ${
                  isDark
                    ? 'bg-white/10 hover:bg-white/20 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                className={`p-1 rounded-lg cursor-move ${
                  isDark
                    ? 'bg-white/10 hover:bg-white/20 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }`}
              >
                <Move className="w-4 h-4" />
              </button>
            </div>

            {/* Element Editor */}
            <div className="space-y-4">
              <input
                type="text"
                value={element.content}
                onChange={(e) => updateElement(element.id, { content: e.target.value })}
                className={`
                  w-full px-4 py-2 rounded-lg border
                  ${isDark
                    ? 'bg-white/5 border-white/10 text-white'
                    : 'bg-white border-gray-200 text-gray-900'
                  }
                  focus:outline-none focus:ring-2 focus:ring-blue-500/50
                `}
                placeholder={`Enter ${element.type} content...`}
              />

              {/* Style Controls */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Font Size
                  </label>
                  <select
                    value={element.styles?.fontSize || '16px'}
                    onChange={(e) => updateElement(element.id, {
                      styles: { ...element.styles, fontSize: e.target.value }
                    })}
                    className={`
                      w-full px-3 py-1.5 rounded-lg border
                      ${isDark
                        ? 'bg-white/5 border-white/10 text-white'
                        : 'bg-white border-gray-200 text-gray-900'
                      }
                    `}
                  >
                    {['12px', '14px', '16px', '18px', '20px', '24px'].map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Color
                  </label>
                  <input
                    type="color"
                    value={element.styles?.color || '#000000'}
                    onChange={(e) => updateElement(element.id, {
                      styles: { ...element.styles, color: e.target.value }
                    })}
                    className="w-full h-8 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Add Element Button */}
        <button
          onClick={() => addElement('text')}
          className={`
            flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg border-2 border-dashed
            ${isDark
              ? 'border-white/10 hover:border-white/20 text-white'
              : 'border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-900'
            }
          `}
        >
          <Plus className="w-5 h-5" />
          Add Element
        </button>
      </div>
    </div>
  );
};