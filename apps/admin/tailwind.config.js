/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F0F7FF',
          100: '#E0EFFF',
          200: '#B9DDFF',
          500: '#0080FF',
          600: '#0062CC',
          700: '#004B9E',
          800: '#003F85',
          900: '#06356F',
        },
      },
    },
  },
  plugins: [],
};
