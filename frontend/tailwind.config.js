/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        coral: {
          50: '#FFF2F1',
          100: '#FFE2E0',
          200: '#FFCAC6',
          300: '#FFA39E',
          400: '#FF7169',
          500: '#FA4338', // Reference Theme Coral Red
          600: '#E72D22',
          700: '#C21E14',
          800: '#A01D15',
          900: '#841E17',
        },
        navy: {
          900: '#14161F',
          800: '#1E202B', // Reference dark slate/navy
          700: '#2A2D3C',
          600: '#3D4256',
        },
        muted: '#8E92A4',
        canvas: '#F8F9FD',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '18px',
        '3xl': '24px',
        '4xl': '32px',
      },
      boxShadow: {
        'soft': '0 8px 30px rgba(0, 0, 0, 0.04)',
        'card': '0 12px 35px rgba(26, 38, 79, 0.06)',
        'glow': '0 10px 25px rgba(250, 67, 56, 0.35)',
      }
    },
  },
  plugins: [],
}
