import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Loader, AlertCircle, Sun, Moon } from 'lucide-react';
import { waitlistPublicApi, WaitlistForms } from './api';
import { PublicSignup } from './PublicSignup';
import { SuccessMessage } from './SuccessMessage';

export const PublicWaitlist = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [forms, setForms] = useState<WaitlistForms | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  useEffect(() => {
    fetchForms();
  }, [projectId]);

  const fetchForms = async () => {
    if (!projectId) return;

    try {
      const data = await waitlistPublicApi.getForms(projectId);
      setForms(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load waitlist');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (email: string) => {
    if (!projectId) return;

    try {
      await waitlistPublicApi.joinWaitlist(projectId, email);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join waitlist');
      throw err;
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
        isDark ? 'bg-black' : 'bg-white'
      }`}>
        <Loader className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
        isDark ? 'bg-black' : 'bg-white'
      }`}>
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className={`text-2xl font-bold mb-2 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Something went wrong
          </h1>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (!forms?.signup_form) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${
        isDark ? 'bg-black' : 'bg-white'
      }`}>
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h1 className={`text-2xl font-bold mb-2 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Waitlist Not Available
          </h1>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            This waitlist is not currently accepting signups.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
      isDark ? 'bg-black' : 'bg-white'
    }`}>
      {success ? (
        <SuccessMessage 
          message={forms.signup_form.successMessage} 
          isDark={isDark}
        />
      ) : (
        <PublicSignup 
          formData={forms.signup_form} 
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};