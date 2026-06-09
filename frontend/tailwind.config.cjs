/** Sistema de diseño EstadiaPro: teal de confianza + coral cálido. */
module.exports = {
  content: ['./src/views/**/*.pug', './src/public/js/**/*.js'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A',
          950: '#042F2E',
        },
        coral: {
          50: '#FFF1F2',
          100: '#FFE4E6',
          200: '#FECDD3',
          300: '#FDA4AF',
          400: '#FB7185',
          500: '#FF5A5F',
          600: '#E14B50',
          700: '#BE123C',
        },
        ink: {
          DEFAULT: '#0B1B19',
          soft: '#334155',
          muted: '#64748B',
        },
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 4px 24px -8px rgba(15, 118, 110, 0.18)',
        card: '0 10px 40px -12px rgba(11, 27, 25, 0.18)',
        float: '0 24px 60px -20px rgba(11, 27, 25, 0.32)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'aurora': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(4%, -4%) scale(1.1)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out both',
        'aurora': 'aurora 12s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
