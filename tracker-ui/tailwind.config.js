/* tailwind.config.js */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface:  '#121212',        // base dark
        surfaceLight: '#FFFFFF',    // base light
        accent:   '#b91c1c',        // desaturated red (CTAs)
        brand:    '#6366f1',        // indigo for charts/icons
        accent2:  '#d97706',        // optional gold
        textHigh:'#E0E0E0',         // 87 % emphasis
        textMed: '#999999',         // 60 % emphasis
      },
      boxShadow: {
        elevation1: '0 1px 2px 0 rgba(255,255,255,0.04)',
        elevation2: '0 2px 4px 0 rgba(255,255,255,0.06)',
        elevation3: '0 4px 8px 0 rgba(255,255,255,0.08)',
        insetCard: 'inset 0 0 0 1px rgba(255,255,255,0.04)',
        cardHover: '0 8px 24px rgba(0,0,0,0.4)',
      },
      borderRadius: { 
        card: '1rem',
        app: '20px',
      },
      spacing: { card: '1.5rem' },  // 24 px
    },
  },
  plugins: [],
};
