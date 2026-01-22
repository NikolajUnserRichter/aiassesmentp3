import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // P3 Group Corporate Colors
        p3: {
          // Primary Brand Colors
          'flying-salmon': {
            DEFAULT: '#FF7F6A',
            50: '#FFF5F3',
            100: '#FFE9E5',
            200: '#FFD4CC',
            300: '#FFBFB3',
            400: '#FF9F8F',
            500: '#FF7F6A',
            600: '#FF4F33',
            700: '#FC2000',
            800: '#C41900',
            900: '#8C1200',
          },
          'electric-blue': {
            DEFAULT: '#0000FF',
            50: '#E6E6FF',
            100: '#CCCCFF',
            200: '#9999FF',
            300: '#6666FF',
            400: '#3333FF',
            500: '#0000FF',
            600: '#0000CC',
            700: '#000099',
            800: '#000066',
            900: '#000033',
          },
          'lemon-splash': {
            DEFAULT: '#DBFF55',
            50: '#F9FFEB',
            100: '#F3FFD6',
            200: '#EBFFAD',
            300: '#E3FF84',
            400: '#DBFF5B',
            500: '#DBFF55',
            600: '#C4E64D',
            700: '#A3BF40',
            800: '#829933',
            900: '#617326',
          },
          'green-day': {
            DEFAULT: '#005B4C',
            50: '#E6F5F2',
            100: '#CCEBE5',
            200: '#99D6CB',
            300: '#66C2B1',
            400: '#33AD97',
            500: '#00997D',
            600: '#008069',
            700: '#006654',
            800: '#005B4C',
            900: '#003D33',
          },
          'midnight-blue': {
            DEFAULT: '#00002D',
            50: '#E6E6EE',
            100: '#CCCCDD',
            200: '#9999BB',
            300: '#666699',
            400: '#333377',
            500: '#000055',
            600: '#000044',
            700: '#000033',
            800: '#00002D',
            900: '#000016',
          },
          'purple-rain': {
            DEFAULT: '#6544FE',
            50: '#F0EDFF',
            100: '#E1DBFE',
            200: '#C3B7FD',
            300: '#A593FC',
            400: '#876FFB',
            500: '#6544FE',
            600: '#5136CB',
            700: '#3D2998',
            800: '#291B65',
            900: '#140E32',
          },
        },
        // Semantic Colors
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        success: {
          DEFAULT: 'var(--success)',
          foreground: 'var(--success-foreground)',
        },
        warning: {
          DEFAULT: 'var(--warning)',
          foreground: 'var(--warning-foreground)',
        },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(101, 68, 254, 0.3)',
        'glow-lg': '0 0 40px rgba(101, 68, 254, 0.4)',
        'inner-glow': 'inset 0 0 20px rgba(219, 255, 85, 0.1)',
        'card': '0 4px 6px -1px rgba(0, 0, 45, 0.1), 0 2px 4px -2px rgba(0, 0, 45, 0.1)',
        'card-hover': '0 20px 25px -5px rgba(0, 0, 45, 0.1), 0 8px 10px -6px rgba(0, 0, 45, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'fade-in-down': 'fadeInDown 0.5s ease-out',
        'slide-in-left': 'slideInLeft 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient-shift': 'gradientShift 8s ease infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'p3-gradient': 'linear-gradient(135deg, #00002D 0%, #6544FE 50%, #0000FF 100%)',
        'p3-gradient-light': 'linear-gradient(135deg, #DBFF55 0%, #F9FFEB 50%, #FFFFFF 100%)',
        'p3-mesh': 'radial-gradient(at 40% 20%, #6544FE 0px, transparent 50%), radial-gradient(at 80% 0%, #0000FF 0px, transparent 50%), radial-gradient(at 0% 50%, #005B4C 0px, transparent 50%), radial-gradient(at 80% 50%, #FF7F6A 0px, transparent 50%), radial-gradient(at 0% 100%, #DBFF55 0px, transparent 50%)',
      },
    },
  },
  plugins: [],
}

export default config
