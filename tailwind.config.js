/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        'dm-sans': ['DM Sans', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'hero': ['48px', { lineHeight: '1.2', fontWeight: '700' }],
        'section-title': ['32px', { lineHeight: '1.3', fontWeight: '700' }],
        'card-title': ['24px', { lineHeight: '1.3', fontWeight: '500' }],
        'subsection-title': ['20px', { lineHeight: '1.3', fontWeight: '500' }],
        'body-lg': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'body-md': ['16px', { lineHeight: '1.5', fontWeight: '500' }],
        'button': ['15px', { lineHeight: '1.4', fontWeight: '500' }],
        'caption': ['13px', { lineHeight: '1.4', fontWeight: '400' }],
      },
    },
  },
  plugins: [],
  keyframes: {
    'fade-in': {
      '0%': { opacity: '0', transform: 'scale(0.95)' },
      '100%': { opacity: '1', transform: 'scale(1)' },
    },
  },
  animation: {
    'fade-in': 'fade-in 0.25s ease-out forwards',
  },
};
