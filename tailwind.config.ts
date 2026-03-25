import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      maxWidth: {
        container: '1120px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 6px 24px rgba(0,0,0,0.06)',
      },
      borderRadius: {
        card: '16px',
        btn: '12px',
      },
      colors: {
        brand: {
          DEFAULT: '#0B5FFF',
          dark: '#084acc',
          light: '#e8f0ff',
        },
      },
    },
  },
  plugins: [],
};

export default config;
