/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        surface: '#121212',      // dark bg  ─ bg-surface
        accent : '#b91c1c',      // red      ─ text-accent / border-accent
        brand  : '#6366f1',      // indigo   ─ hover:text-brand
        textHi : '#E0E0E0',      // light text
      },
      boxShadow: {
        insetCard: 'inset 0 0 0 1px rgba(255,255,255,0.06)',
        cardHover: '0 8px 24px rgba(0,0,0,0.4)',
      },
      borderRadius: { card: '1rem' },      // rounded-card
    },
  },
  plugins: [],
};