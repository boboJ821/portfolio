/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#2A0944',
        'secondary': '#9336B4',
        'accent': '#FF26B9',
        'neutral': '#F2F2F2',
        purple: {
          400: '#9F7AEA',
          500: '#805AD5',
        },
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
    },
  },
  plugins: [],
} 