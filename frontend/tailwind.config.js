/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f4ff',
          100: '#dbe4ff',
          200: '#bac8ff',
          300: '#91a7ff',
          400: '#748ffc',
          500: '#5c7cfa',
          600: '#4c6ef5',
          700: '#4263eb',
          800: '#3b5bdb',
          900: '#364fc7',
        },
        accent: {
          purple: '#7c3aed',
          blue: '#3b82f6',
        },
        surface: {
          light: '#F5F7FB',
          dark: '#1a1a2e',
          card: '#ffffff',
          cardDark: '#16213e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
      },
      backgroundImage: {
        'gradient-accent': 'linear-gradient(135deg, #4c6ef5 0%, #7c3aed 100%)',
        'gradient-hero': 'linear-gradient(135deg, #f0f4ff 0%, #e8daef 50%, #f5f7fb 100%)',
      },
    },
  },
  plugins: [],
}