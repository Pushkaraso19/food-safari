/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Open Sans', 'sans-serif'],
        body: ['Open Sans', 'sans-serif'],
      },
      colors: {
        saffron: {
          50:  '#fff8ed',
          100: '#ffefd4',
          200: '#ffdba8',
          300: '#ffc071',
          400: '#ff9a38',
          500: '#ff7c10',
          600: '#f05f06',
          700: '#c74607',
          800: '#9e380e',
          900: '#7f300f',
        },
        slate: {
          850: '#1a2236',
          950: '#0d1221',
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease forwards',
        shimmer: 'shimmer 1.8s infinite linear',
      },
      keyframes: {
        fadeInUp: {
          from: { opacity: 0, transform: 'translateY(16px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        shimmer: {
          from: { backgroundPosition: '-200% 0' },
          to: { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
