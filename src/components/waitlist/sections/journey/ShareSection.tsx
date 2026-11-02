import React, { useState } from 'react';
import { Share2, Globe, Code, Copy, Check, ExternalLink } from 'lucide-react';
import { useTheme } from '../../../../contexts/ThemeContext';

interface ShareSectionProps {
  projectId: string;
}

export const ShareSection = ({ projectId }: ShareSectionProps) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [copied, setCopied] = useState<'url' | 'embed' | null>(null);

  const baseUrl = window.location.origin;
  const publicUrl = `${baseUrl}/p/${projectId}`;
  const embedCode = `<iframe src="${publicUrl}" width="100%" height="600" frameborder="0"></iframe>`;

  const handleCopy = async (text: string, type: 'url' | 'embed') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className={`p-6 rounded-xl border ${
      isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-2 rounded-lg ${
          isDark ? 'bg-blue-500/20' : 'bg-blue-50'
        }`}>
          <Share2 className={isDark ? 'text-blue-400' : 'text-blue-600'} />
        </div>
        <h2 className={`text-xl font-semibold ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          Share Your Waitlist
        </h2>
      </div>

      <div className="space-y-6">
        {/* Public URL */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className={`text-sm font-medium ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Public URL
            </label>
            <a
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-1 text-sm ${
                isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'
              }`}
            >
              View live <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <div className="flex gap-2">
            <div className={`flex-1 px-4 py-2 rounded-lg ${
              isDark ? 'bg-white/5' : 'bg-gray-50'
            }`}>
              <code className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                {publicUrl}
              </code>
            </div>
            <button
              onClick={() => handleCopy(publicUrl, 'url')}
              className={`px-3 rounded-lg flex items-center gap-2 ${
                isDark
                  ? 'bg-white/10 hover:bg-white/20 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
              }`}
            >
              {copied === 'url' ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Embed Code */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className={`text-sm font-medium ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Embed Code
            </label>
            <span className={`text-xs ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Add to your website
            </span>
          </div>
          <div className="flex gap-2">
            <div className={`flex-1 px-4 py-2 rounded-lg font-mono text-sm overflow-x-auto ${
              isDark ? 'bg-white/5' : 'bg-gray-50'
            }`}>
              <code className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                {embedCode}
              </code>
            </div>
            <button
              onClick={() => handleCopy(embedCode, 'embed')}
              className={`px-3 rounded-lg flex items-center gap-2 ${
                isDark
                  ? 'bg-white/10 hover:bg-white/20 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
              }`}
            >
              {copied === 'embed' ? (
                <Check className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Preview */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className={`text-sm font-medium ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Preview
            </label>
          </div>
          <div className={`rounded-lg border overflow-hidden ${
            isDark ? 'border-white/10' : 'border-gray-200'
          }`}>
            <iframe
              src={publicUrl}
              width="100%"
              height="400"
              frameBorder="0"
              title="Waitlist Preview"
            />
          </div>
        </div>
      </div>
    </div>
  );
};