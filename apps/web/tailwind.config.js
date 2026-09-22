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
          300: '#7CC2FF',
          400: '#36A2FF',
          500: '#0080FF',
          600: '#0062CC',
          700: '#004B9E',
          800: '#003F85',
          900: '#06356F',
          950: '#042147',
        },
        navy: {
          800: '#0D1B2A',
          900: '#0A1420',
          950: '#060D15',
        },
        steel: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
        },
        frost: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          500: '#10B981',
          600: '#059669',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 25px -5px rgba(0, 128, 255, 0.25)',
        'glow-lg': '0 0 40px -10px rgba(0, 128, 255, 0.35)',
        'premium': '0 20px 40px -15px rgba(0, 0, 0, 0.07)',
      },
    },
  },
  plugins: [],
};
