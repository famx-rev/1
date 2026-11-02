import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Shield, FileText, Info } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const pages = {
  about: {
    title: 'About Us',
    icon: Info,
    content: (
      <>
        <p className="mb-6">
          CloudPlatform is a cutting-edge cloud computing solution designed to empower developers and businesses with scalable, reliable, and secure infrastructure services.
        </p>
        <p className="mb-6">
          Founded in 2024, we've been at the forefront of cloud technology innovation, providing state-of-the-art solutions that help businesses transform their digital presence and operational efficiency.
        </p>
        <h3 className="text-xl font-semibold mb-4">Our Mission</h3>
        <p className="mb-6">
          To democratize cloud computing by making enterprise-grade infrastructure accessible to businesses of all sizes, enabling innovation and growth in the digital age.
        </p>
        <h3 className="text-xl font-semibold mb-4">Our Values</h3>
        <ul className="list-disc list-inside mb-6 space-y-2">
          <li>Innovation in everything we do</li>
          <li>Security as our top priority</li>
          <li>Reliability you can count on</li>
          <li>Customer success at our core</li>
        </ul>
      </>
    )
  },
  terms: {
    title: 'Terms of Service',
    icon: FileText,
    content: (
      <>
        <p className="mb-6">
          By accessing and using CloudPlatform's services, you agree to be bound by these Terms of Service. Please read them carefully.
        </p>
        <h3 className="text-xl font-semibold mb-4">1. Service Usage</h3>
        <p className="mb-6">
          You agree to use our services only for lawful purposes and in accordance with these Terms. You are responsible for maintaining the security of your account credentials.
        </p>
        <h3 className="text-xl font-semibold mb-4">2. User Responsibilities</h3>
        <p className="mb-6">
          Users must comply with all applicable laws and regulations. Any misuse of our services may result in immediate termination of your account.
        </p>
        <h3 className="text-xl font-semibold mb-4">3. Service Availability</h3>
        <p className="mb-6">
          While we strive for 99.9% uptime, we do not guarantee uninterrupted access to our services. Scheduled maintenance will be communicated in advance.
        </p>
        <h3 className="text-xl font-semibold mb-4">4. Modifications</h3>
        <p className="mb-6">
          We reserve the right to modify these terms at any time. Continued use of our services constitutes acceptance of any modifications.
        </p>
      </>
    )
  },
  privacy: {
    title: 'Privacy Policy',
    icon: Shield,
    content: (
      <>
        <p className="mb-6">
          Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information.
        </p>
        <h3 className="text-xl font-semibold mb-4">1. Information Collection</h3>
        <p className="mb-6">
          We collect information you provide directly to us, including account details, usage data, and communications with our support team.
        </p>
        <h3 className="text-xl font-semibold mb-4">2. Data Usage</h3>
        <p className="mb-6">
          We use collected information to provide and improve our services, communicate with users, and ensure platform security.
        </p>
        <h3 className="text-xl font-semibold mb-4">3. Data Protection</h3>
        <p className="mb-6">
          We implement industry-standard security measures to protect your data from unauthorized access, disclosure, or misuse.
        </p>
        <h3 className="text-xl font-semibold mb-4">4. Your Rights</h3>
        <p className="mb-6">
          You have the right to access, correct, or delete your personal information. Contact our support team to exercise these rights.
        </p>
      </>
    )
  }
};

export const LegalPages = () => {
  const { pageId } = useParams<{ pageId: keyof typeof pages }>();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const page = pages[pageId as keyof typeof pages];
  const Icon = page?.icon;

  return (
    <div className="min-h-screen bg-white dark:bg-black pt-24 pb-12 px-4 transition-colors duration-300">
      <div className="max-w-3xl mx-auto">
        <div className="bg-gray-50/80 dark:bg-white/5 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-white/10">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link
              to="/"
              className={`p-2 rounded-lg ${
                isDark
                  ? 'hover:bg-white/10 text-gray-400 hover:text-white'
                  : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
              } transition-colors`}
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3">
              {Icon && (
                <Icon className={`w-6 h-6 ${
                  isDark ? 'text-blue-400' : 'text-blue-600'
                }`} />
              )}
              <h1 className={`text-2xl font-bold ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {page?.title}
              </h1>
            </div>
          </div>

          {/* Content */}
          <div className={`prose max-w-none ${
            isDark ? 'prose-invert' : ''
          } ${
            isDark
              ? 'text-gray-300'
              : 'text-gray-600'
          }`}>
            {page?.content}
          </div>
        </div>
      </div>
    </div>
  );
};