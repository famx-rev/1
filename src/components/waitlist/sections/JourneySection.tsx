import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CreditCard as Edit2, Loader, AlertCircle, Check, Copy, Eye, ExternalLink } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';
import { FormEditor } from './journey/FormEditor';
import { ShareSection } from './journey/ShareSection';

interface FormData {
  signup_form?: any;
  verification_form?: any;
  referral_form?: any;
}

export const JourneySection = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [isEditing, setIsEditing] = useState(false);
  const [editingForm, setEditingForm] = useState<'signup' | 'verification' | 'referral' | null>(null);
  const [formData, setFormData] = useState<FormData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFullShare, setShowFullShare] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchForms();
  }, [projectId]);

  const fetchForms = async () => {
    try {
      const response = await fetch(`https://api-eight-navy-68.vercel.app/api/waitlist/${projectId}/forms`);
      if (!response.ok) throw new Error('Failed to fetch forms');
      const data = await response.json();
      setFormData(data.forms);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load forms');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (formType: 'signup' | 'verification' | 'referral') => {
    setEditingForm(formType);
    setIsEditing(true);
  };

  const handleSave = async (formType: string, updatedForm: any) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://api-eight-navy-68.vercel.app/api/waitlist/${projectId}/forms`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          [`${formType}_form`]: updatedForm
        })
      });

      if (!response.ok) throw new Error('Failed to update form');
      
      await fetchForms();
      setIsEditing(false);
      setEditingForm(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update form');
    }
  };

  const baseUrl = window.location.origin;
  const publicUrl = `${baseUrl}/p/${projectId}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
        <AlertCircle className="w-5 h-5 text-red-500" />
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  const steps = [
    {
      id: 'signup',
      name: 'Sign Up Form',
      description: 'The form where people sign up to your project.',
      form: formData.signup_form
    },
    {
      id: 'verification',
      name: 'Verification Email',
      description: 'Email sent to verify user\'s email address.',
      form: formData.verification_form
    },
    {
      id: 'referral',
      name: 'Referral Page',
      description: 'Where people can check their current rank and invite friends.',
      form: formData.referral_form
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className={`text-2xl font-bold ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          Share Your Waitlist
        </h2>
      </div>

      {/* Simplified Share Card */}
      <div className={`p-6 rounded-xl border ${
        isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
      }`}>
        <div className="space-y-6">
          {/* Public URL */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className={`text-sm font-medium ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Public URL
              </label>
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
                onClick={handleCopy}
                className={`px-3 rounded-lg flex items-center gap-2 ${
                  isDark
                    ? 'bg-white/10 hover:bg-white/20 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }`}
                title="Copy URL"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={() => setShowFullShare(!showFullShare)}
                className={`px-3 rounded-lg flex items-center gap-2 ${
                  isDark
                    ? 'bg-white/10 hover:bg-white/20 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }`}
                title={showFullShare ? 'Hide preview' : 'Show preview'}
              >
                <Eye className="w-4 h-4" />
              </button>
              <a
                href={publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`px-3 rounded-lg flex items-center gap-2 ${
                  isDark
                    ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400'
                    : 'bg-blue-100 hover:bg-blue-200 text-blue-600'
                }`}
                title="View live"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Full Share Section */}
          {showFullShare && projectId && (
            <div className="pt-6 border-t border-gray-200 dark:border-white/10">
              <ShareSection projectId={projectId} />
            </div>
          )}
        </div>
      </div>

      {/* Forms Grid */}
      <div className="grid gap-6">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`p-6 rounded-xl border ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className={`text-xl font-semibold mb-2 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {step.name}
                </h3>
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                  {step.description}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(step.id as any)}
                  className={`p-2 rounded-lg ${
                    isDark
                      ? 'hover:bg-white/10 text-gray-400 hover:text-white'
                      : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Form Editor Modal */}
      {isEditing && editingForm && (
        <FormEditor
          formType={editingForm}
          initialData={formData[`${editingForm}_form`]}
          onSave={(updatedForm) => handleSave(editingForm, updatedForm)}
          onCancel={() => {
            setIsEditing(false);
            setEditingForm(null);
          }}
        />
      )}
    </div>
  );
};