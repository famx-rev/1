/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'fade-in': 'fadeIn 200ms ease-out',
        'slide-in-from-bottom-2': 'slideInFromBottom2 200ms ease-out',
      },
      keyframes: {
        glow: {
          '0%': {
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
          },
          '100%': {
            boxShadow: '0 0 40px rgba(59, 130, 246, 0.6)',
          },
        },
        float: {
          '0%, 100%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(-20px)',
          },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInFromBottom2: {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      transitionTimingFunction: {
        'supabase': 'cubic-bezier(0.2, 0, 0, 1)',
        'sidebar': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};