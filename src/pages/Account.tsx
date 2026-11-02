import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Mail, Building2, Phone, Shield, 
  Save, AlertCircle, CheckCircle, Loader
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { authService } from '../services/auth.service';
import { InputField } from '../components/InputField';

interface UserProfile {
  id: string;
  username: string;
  email: string;
  company?: string;
  phone?: string;
}

interface UpdateResponse {
  success: boolean;
  message: string;
}

export const Account = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    company: '',
    phone: '',
  });

  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = authService.getToken();
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('https://api-eight-navy-68.vercel.app/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const data = await response.json();
      setProfile(data.user);
      setFormData({
        username: data.user.username || '',
        email: data.user.email || '',
        company: data.user.company || '',
        phone: data.user.phone || '',
      });
    } catch (error) {
      setError('Failed to load profile data');
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsSaving(true);

    try {
      const token = authService.getToken();
      const response = await fetch('https://api-eight-navy-68.vercel.app/api/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data: UpdateResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      setSuccessMessage('Profile updated successfully');
      setProfile({ ...profile!, ...formData });
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black pt-24 pb-12 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className={`text-4xl font-bold mb-4 ${
            isDark ? 'text-white dark-glow' : 'text-gray-900'
          }`}>
            Account Settings
          </h1>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            Manage your account information and preferences
          </p>
        </div>

        {/* Main Content */}
        <div className={`relative p-8 rounded-2xl backdrop-blur-sm border ${
          isDark
            ? 'bg-white/5 border-white/10'
            : 'bg-white border-gray-200 shadow-xl'
        }`}>
          {/* Background Effects */}
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-blue-500/20 rounded-full filter blur-3xl animate-pulse" />
          <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-purple-500/20 rounded-full filter blur-3xl animate-pulse delay-1000" />

          {/* Status Messages */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <p className="text-green-600 dark:text-green-400">{successMessage}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="relative space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                label="Username"
                name="username"
                type="text"
                icon={<User className="w-5 h-5" />}
                value={formData.username}
                onChange={handleChange}
                required
              />

              <InputField
                label="Email Address"
                name="email"
                type="email"
                icon={<Mail className="w-5 h-5" />}
                value={formData.email}
                onChange={handleChange}
                required
              />

              <InputField
                label="Company"
                name="company"
                type="text"
                icon={<Building2 className="w-5 h-5" />}
                value={formData.company}
                onChange={handleChange}
              />

              <InputField
                label="Phone Number"
                name="phone"
                type="tel"
                icon={<Phone className="w-5 h-5" />}
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            {/* Security Section */}
            <div className={`mt-8 p-4 rounded-xl ${
              isDark ? 'bg-white/5' : 'bg-gray-50'
            }`}>
              <div className="flex items-center gap-3 mb-4">
                <Shield className={`w-5 h-5 ${
                  isDark ? 'text-blue-400' : 'text-blue-600'
                }`} />
                <h3 className={`font-semibold ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Security
                </h3>
              </div>
              <p className={`text-sm ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Your account is protected with password authentication. 
                For enhanced security, we recommend regularly updating your password 
                and enabling two-factor authentication when available.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSaving}
              className={`group relative w-full px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                isDark
                  ? 'bg-white/10 hover:bg-white/20 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              } disabled:opacity-50`}
            >
              <span className="absolute inset-0 rounded-xl overflow-hidden">
                <span className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </span>
              <span className="relative flex items-center justify-center gap-2">
                {isSaving ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Save Changes
                    <Save className="w-5 h-5" />
                  </>
                )}
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};