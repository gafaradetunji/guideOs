/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
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
          50: '#eef4ff',
          100: '#d9e6ff',
          200: '#bcd3ff',
          300: '#8fb6ff',
          400: '#5b8dff',
          500: '#3463ff',
          600: '#1f43f5',
          700: '#1731e1',
          800: '#182ab6',
          900: '#1a2a8f',
        },
        accent: {
          50: '#fef0ea',
          100: '#fedccb',
          200: '#fdb693',
          300: '#fb8a5c',
          400: '#f9622f',
          500: '#e84a18',
          600: '#c63712',
          700: '#9d2a11',
          800: '#7e2415',
          900: '#5c1d12',
        },
      },
      boxShadow: {
        card: '0 1px 2px 0 rgba(15,16,19,0.04), 0 1px 3px 0 rgba(15,16,19,0.06)',
        cardlg: '0 4px 12px -2px rgba(15,16,19,0.06), 0 2px 6px -2px rgba(15,16,19,0.04)',
        pop: '0 8px 28px -4px rgba(15,16,19,0.18), 0 4px 10px -4px rgba(15,16,19,0.08)',
        ring: '0 0 0 1px rgba(15,16,19,0.06)',
      },
      borderRadius: {
        xl: '10px',
        '2xl': '14px',
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
