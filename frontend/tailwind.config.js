/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        gray: {
          950: '#060610',
          900: '#0d0d1a',
          800: '#141428',
          700: '#1e1e35',
          600: '#2a2a45',
          500: '#4a4a6a',
          400: '#7070a0',
          300: '#a0a0c0',
          200: '#c8c8e0',
          100: '#e8e8f0',
          50:  '#f5f5fa',
        },
        emerald: {
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
        },
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
