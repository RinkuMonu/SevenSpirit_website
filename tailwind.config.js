/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        night: '#0e0a26',
        cream: '#fbf6ea',
        royal: {
          50: '#f6f1ff', 100: '#ece2ff', 200: '#d9c6ff', 300: '#bc98f5', 400: '#9c6ae6',
          500: '#7e45cf', 600: '#6a31b5', 700: '#552395', 800: '#3f1a73', 900: '#2a1150',
        },
        gold: { 200: '#f6e5b0', 300: '#f1d481', 400: '#e6bb4e', 500: '#cf9f2e', 600: '#a97d1f' },
      },
      boxShadow: { gold: '0 10px 28px -8px rgba(207,159,46,.6)', soft: '0 8px 30px -12px rgba(42,17,80,.28)' },
    },
  },
  plugins: [],
};
