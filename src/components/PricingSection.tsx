import React from 'react';
import { NeonCard } from './NeonCard';
import { Cpu, Cloud, Database, Shield } from 'lucide-react';

export const PricingSection = () => {
  const features = [
    {
      title: 'Compute',
      description: 'Scalable compute resources with automatic load balancing',
      icon: <Cpu className="w-6 h-6 dark:text-blue-400 text-blue-600" />,
      glowColor: 'bg-blue-500',
      lightGlowColor: 'bg-blue-200'
    },
    {
      title: 'Storage',
      description: 'High-performance distributed storage solutions',
      icon: <Database className="w-6 h-6 dark:text-purple-400 text-purple-600" />,
      glowColor: 'bg-purple-500',
      lightGlowColor: 'bg-purple-200'
    },
    {
      title: 'Networking',
      description: 'Global edge network with ultra-low latency',
      icon: <Cloud className="w-6 h-6 dark:text-indigo-400 text-indigo-600" />,
      glowColor: 'bg-indigo-500',
      lightGlowColor: 'bg-indigo-200'
    },
    {
      title: 'Security',
      description: 'Enterprise-grade security and compliance',
      icon: <Shield className="w-6 h-6 dark:text-green-400 text-green-600" />,
      glowColor: 'bg-green-500',
      lightGlowColor: 'bg-green-200'
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold dark:text-white text-gray-900 mb-4">
            Platform Features
          </h2>
          <p className="dark:text-gray-400 text-gray-600 max-w-2xl mx-auto">
            Everything you need to build and scale your applications
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, i) => (
            <NeonCard key={i} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};