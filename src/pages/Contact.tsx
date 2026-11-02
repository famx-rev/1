import React, { useState } from 'react';
import { Mail, MessageSquare, User, Building2, Send, Phone } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface FormData {
  name: string;
  email: string;
  company: string;
  phone: string;
  message: string;
}

export const Contact = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSubmitted(true);
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black pt-24 pb-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${
            isDark ? 'text-white dark-glow' : 'text-gray-900'
          }`}>
            Get in Touch
          </h1>
          <p className={`text-xl max-w-2xl mx-auto ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className={`relative p-8 rounded-2xl backdrop-blur-sm border ${
            isDark
              ? 'bg-white/5 border-white/10'
              : 'bg-white border-gray-200 shadow-xl'
          }`}>
            {/* Background Effects */}
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-blue-500/20 rounded-full filter blur-3xl animate-pulse" />
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-purple-500/20 rounded-full filter blur-3xl animate-pulse delay-1000" />

            {!submitted ? (
              <form onSubmit={handleSubmit} className="relative space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name Input */}
                  <div className="relative">
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Full Name
                    </label>
                    <div className="relative">
                      <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`} />
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                          isDark
                            ? 'bg-white/5 border-white/10 text-white placeholder-gray-400'
                            : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300`}
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                  {/* Email Input */}
                  <div className="relative">
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`} />
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                          isDark
                            ? 'bg-white/5 border-white/10 text-white placeholder-gray-400'
                            : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300`}
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  {/* Company Input */}
                  <div className="relative">
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Company
                    </label>
                    <div className="relative">
                      <Building2 className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`} />
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                          isDark
                            ? 'bg-white/5 border-white/10 text-white placeholder-gray-400'
                            : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300`}
                        placeholder="Company Name"
                      />
                    </div>
                  </div>

                  {/* Phone Input */}
                  <div className="relative">
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${
                        isDark ? 'text-gray-400' : 'text-gray-500'
                      }`} />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                          isDark
                            ? 'bg-white/5 border-white/10 text-white placeholder-gray-400'
                            : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300`}
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>
                </div>

                {/* Message Input */}
                <div className="relative">
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Message
                  </label>
                  <div className="relative">
                    <MessageSquare className={`absolute left-3 top-3 w-5 h-5 ${
                      isDark ? 'text-gray-400' : 'text-gray-500'
                    }`} />
                    <textarea
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                        isDark
                          ? 'bg-white/5 border-white/10 text-white placeholder-gray-400'
                          : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300`}
                      placeholder="Your message..."
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
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
                    {isSubmitting ? (
                      <span className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    ) : (
                      <>
                        Send Message
                        <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </span>
                </button>
              </form>
            ) : (
              <div className="text-center py-12">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 ${
                  isDark ? 'bg-green-500/20' : 'bg-green-100'
                }`}>
                  <Send className={`w-8 h-8 ${
                    isDark ? 'text-green-400' : 'text-green-600'
                  }`} />
                </div>
                <h3 className={`text-2xl font-bold mb-2 ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  Message Sent Successfully!
                </h3>
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                  Thank you for reaching out. We'll get back to you shortly.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};