/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'navy-dark': '#0A2540',
        'navy-muted': '#1E3A5F',
        'ice-cyan': '#c6f7ff',
        'ice-cyan-light': '#e8fbff',
        'ice-cyan-dark': '#0ea5e9',
        'slate-body': '#475569',
        'surface-light': '#F8FAFC',
        'surface-alt': '#F1F5F9',
      },
      fontFamily: {
        headline: ['Outfit', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
        body: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        mono: ['Space Grotesk', 'monospace'],
      },
      borderRadius: {
        'card': '1.5rem',
        'pill': '9999px',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 7s ease-in-out 2s infinite',
        'pulse-glow': 'pulseGlow 4s ease-in-out infinite',
        'scanline': 'scanline 3s linear infinite',
        'shimmer': 'shimmer 2.5s infinite',
        'ecg-draw': 'ecg 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-12px) rotate(1deg)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.08)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        ecg: {
          '0%': { strokeDashoffset: '200' },
          '100%': { strokeDashoffset: '0' },
        },
      },
    },
  },
  plugins: [],
};
