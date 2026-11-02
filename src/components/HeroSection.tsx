import React from 'react';
import { RetroGrid } from './RetroGrid';
import { ArrowRight, Cloud, Shield, Zap } from 'lucide-react';
import { PricingSection } from './PricingSection';
import { Footer } from './Footer';
import { useTheme } from '../contexts/ThemeContext';

export const HeroSection = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="relative min-h-screen bg-white dark:bg-black overflow-hidden transition-colors duration-300">
      <RetroGrid />
      
      <div className="relative container mx-auto px-6 py-24">
        <div className="text-center space-y-8">
          <h1 className="text-7xl font-bold tracking-tighter">
            <span className={`relative inline-block ${
              isDark 
                ? 'fire-glow bg-gradient-to-b from-white via-white to-white/50 bg-clip-text text-transparent' 
                : 'bg-gradient-to-b from-[#ffd319] via-[#ff2975] to-[#8c1eff] bg-clip-text text-transparent'
            }`}>
              Next Generation
              <br />
              Cloud Platform
            </span>
          </h1>
          
          <p className={`text-xl max-w-2xl mx-auto backdrop-blur-sm ${
            isDark 
              ? 'text-gray-300 dark-glow-sm' 
              : 'text-gray-600'
          }`}>
            Transform your business with our cutting-edge PaaS solution. 
            Built for developers, designed for scale.
          </p>

          <div className="flex justify-center gap-6">
            <button className="group relative px-8 py-3 bg-white/10 dark:bg-white/10 rounded-lg backdrop-blur-sm hover:bg-white/20 dark:hover:bg-white/20 transition-all duration-300 border border-white/20">
              <span className={`relative z-10 flex items-center gap-2 ${
                isDark 
                  ? 'text-white dark-glow-sm' 
                  : 'text-gray-900'
              }`}>
                Get Started <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#ffd319] to-[#ff2975] opacity-0 group-hover:opacity-20 rounded-lg transition-opacity duration-300" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {[
              { icon: Cloud, title: 'Cloud Native', desc: 'Built for modern cloud infrastructure' },
              { icon: Zap, title: 'Lightning Fast', desc: 'Optimized for peak performance' },
              { icon: Shield, title: 'Enterprise Security', desc: 'Bank-grade security protocols' }
            ].map((feature, i) => (
              <div key={i} className="relative group p-6 bg-white/5 dark:bg-white/5 rounded-xl backdrop-blur-sm hover:bg-white/10 dark:hover:bg-white/10 transition-all duration-300 border border-white/10">
                <div className="absolute inset-0 bg-gradient-to-b from-[#ff2975]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                <feature.icon className={`w-8 h-8 mb-4 ${
                  isDark 
                    ? 'text-blue-400 dark-glow-sm' 
                    : 'text-[#ff2975]'
                }`} />
                <h3 className={`text-xl font-semibold mb-2 ${
                  isDark 
                    ? 'text-white dark-glow-sm' 
                    : 'text-gray-900'
                }`}>{feature.title}</h3>
                <p className={`${
                  isDark 
                    ? 'text-gray-300 dark-glow-xs' 
                    : 'text-gray-600'
                }`}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <PricingSection />
      <Footer />
    </div>
  );
};