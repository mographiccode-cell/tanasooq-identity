/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './js/**/*.js'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"KO Sans"', 'system-ui', 'sans-serif'],
        medium: ['"KO Sans Medium"', 'system-ui', 'sans-serif'],
        semibold: ['"KO Sans SemiBold"', 'system-ui', 'sans-serif'],
        bold: ['"KO Sans Bold"', 'system-ui', 'sans-serif'],
        light: ['"KO Sans Light"', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#F6F3FB',
          100: '#EDE7F7',
          200: '#DBCFEE',
          300: '#C0ADDE',
          400: '#A184CB',
          500: '#8363B5',
          600: '#6B4CA0',
          700: '#553A96',
          800: '#48307C',
          900: '#3A2763',
          950: '#22163D'
        },
        accent: {
          50: '#FCF0F8',
          100: '#F8DFF0',
          200: '#F1BFE0',
          300: '#E695C9',
          400: '#DA66AE',
          500: '#C84297',
          600: '#B12C91',
          700: '#93247A',
          800: '#791F64',
          900: '#5E1B50',
          950: '#3A0F32'
        },
        night: {
          50: '#F4F1FA',
          100: '#E7E1F2',
          200: '#CFC3E5',
          300: '#AC9ACF',
          400: '#866AB4',
          500: '#684C97',
          600: '#53397C',
          700: '#432C64',
          800: '#36234F',
          900: '#2A1A3F',
          950: '#1A1028'
        }
      },
      boxShadow: {
        soft: '0 20px 60px -20px rgba(85, 58, 150, 0.25)',
        glow: '0 0 0 1px rgba(255,255,255,0.06), 0 30px 80px -30px rgba(177, 44, 145, 0.4)',
        card: '0 2px 8px rgba(42, 26, 63, 0.06), 0 24px 60px -24px rgba(85, 58, 150, 0.18)'
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #553A96 0%, #6B4CA0 45%, #B12C91 100%)',
        'radial-fade': 'radial-gradient(1200px 600px at 85% -10%, rgba(177,44,145,0.14), transparent 60%), radial-gradient(900px 500px at 10% 110%, rgba(85,58,150,0.16), transparent 60%)'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' }
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        blob: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(30px, -40px) scale(1.1)' },
          '66%': { transform: 'translate(-25px, 25px) scale(0.95)' }
        }
      },
      animation: {
        float: 'float 7s ease-in-out infinite',
        fadeUp: 'fadeUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
        blob: 'blob 14s ease-in-out infinite'
      }
    }
  },
  plugins: []
};
