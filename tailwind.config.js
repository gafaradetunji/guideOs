/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['IBM Plex Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        ink: {
          50: '#f7f8fa',
          100: '#eef0f4',
          200: '#dbdfe7',
          300: '#c0c5d1',
          400: '#8b91a3',
          500: '#606573',
          600: '#43474f',
          700: '#303138',
          800: '#1c1d22',
          900: '#0f1013',
        },
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        accent: {
          50: '#effcf6',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
      },
      boxShadow: {
        card: '0 0 0 1px rgba(15, 23, 42, 0.06), 0 10px 30px -18px rgba(15, 23, 42, 0.2)',
        cardlg: '0 0 0 1px rgba(15, 23, 42, 0.08), 0 18px 40px -24px rgba(15, 23, 42, 0.24)',
        pop: '0 0 0 1px rgba(15, 23, 42, 0.08), 0 24px 48px -24px rgba(15, 23, 42, 0.3)',
        ring: '0 0 0 1px rgba(15, 23, 42, 0.08)',
      },
      borderRadius: {
        xl: '8px',
        '2xl': '12px',
      },
      keyframes: {
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        'slide-in-right': { from: { transform: 'translateX(100%)' }, to: { transform: 'translateX(0)' } } ,
        'slide-up': { from: { transform: 'translateY(8px)', opacity: '0' }, to: { transform: 'translateY(0)', opacity: '1' } },
      },
      animation: {
        'fade-in': 'fade-in 150ms ease-out',
        'slide-in-right': 'slide-in-right 220ms cubic-bezier(0.16,1,0.3,1)',
        'slide-up': 'slide-up 180ms ease-out',
      },
    },
  },
  plugins: [],
};
