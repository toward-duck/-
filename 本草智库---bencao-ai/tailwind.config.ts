import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        tcm: {
          50: '#f4f7f5',
          100: '#e3ebe6',
          200: '#c5d9ce',
          300: '#9abbad',
          400: '#719888',
          500: '#527c6b',
          600: '#3f6254',
          700: '#344f44',
          800: '#2b3f37',
          900: '#25352f',
        },
        paper: '#fdfbf7', // Parchment color
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', 'SimSun', 'STSong', 'serif'],
        sans: ['system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
