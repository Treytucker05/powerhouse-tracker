/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: 'class',  theme: { 
    extend: {
      colors: {
        surface: '#121212',       // card / page bg
        accent:  '#b91c1c',       // red CTA
        brand:   '#6366f1',       // indigo charts / icons
        textHi:  '#E0E0E0',
        
        // PowerHouse Premium Color Palette
        'primary-black': '#0A0A0A',
        'rich-black': '#1C1C1C',
        'true-black': '#000',
        'primary-red': '#DC2626',
        'accent-red': '#EF4444',
        'dark-red': '#991B1B',
        'pure-white': '#FFF',
        'off-white': '#FAFAFA',
        'light-gray': '#F3F4F6',
        
        // Legacy support
        'textHigh': '#E0E0E0',
        primary: '#DC2626',
        offwhite:'#FAFAFA',
        black:   '#000000',
        
        // Define full red color palette for Tailwind v4 compatibility
        red: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        // PowerHouse brand colors
        powerhouse: {
          red: '#DC2626',
          'dark-red': '#991B1B',
          'accent-red': '#EF4444',
          black: '#0A0A0A',
          'rich-black': '#1C1C1C',
          gray: '#374151',
        },
        // Full gray palette for compatibility
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        // Full green palette for volume indicators
        green: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        // Full yellow palette for MEV lines
        yellow: {
          50: '#fefce8',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        }
      },
      container: {
        center: true,
        padding: { DEFAULT: "1rem", sm: "2rem", lg: "4rem", xl: "5rem" },
      },
      boxShadow: {
        lg: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
        xl: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
        insetCard: "inset 0 0 0 1px rgba(255,255,255,0.06)",
        cardHover: "0 8px 24px rgba(0,0,0,0.4)",
      },
      borderRadius: {
        card: "1rem",
        button: "0.5rem",
        badge: "0.375rem",
      },
      spacing: {
        card: "1.5rem",
        "card-sm": "1rem",
        "card-lg": "2rem",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "pulse-glow": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      fontFamily: {
        'premium': ['Inter', 'Segoe UI', 'Roboto', 'system-ui', '-apple-system', 'sans-serif'],
        'mono': ['JetBrains Mono', 'Monaco', 'Cascadia Code', 'monospace'],
      },
      utilities: {
        '.text-premium': {
          fontFamily: '"Inter", "Segoe UI", "Roboto", system-ui, -apple-system, sans-serif',
          fontWeight: '500',
          letterSpacing: '-0.02em',
          lineHeight: '1.5',
        },
        '.text-premium-heading': {
          fontFamily: '"Inter", "Segoe UI", "Roboto", system-ui, -apple-system, sans-serif',
          fontWeight: '700',
          letterSpacing: '-0.03em',
          lineHeight: '1.2',
          background: 'linear-gradient(135deg, #FFF 0%, #FAFAFA 100%)',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'background-clip': 'text',
        },
        '.text-premium-accent': {
          color: '#EF4444',
          fontWeight: '600',
          textShadow: '0 0 10px rgba(239, 68, 68, 0.3)',
        },
        '.text-premium-secondary': {
          color: '#6B7280',
          opacity: '0.8',
          fontSize: '0.9em',
        },
        '.bg-premium': {
          background: 'linear-gradient(135deg, #1C1C1C 0%, #0A0A0A 100%)',
        },
        '.bg-premium-glass': {
          background: 'rgba(28, 28, 28, 0.8)',
          backdropFilter: 'blur(20px)',
          '-webkit-backdrop-filter': 'blur(20px)',
        },
        '.border-premium': {
          border: '1px solid rgba(220, 38, 38, 0.2)',
        },
        '.shadow-premium': {
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        },
        '.shadow-premium-lg': {
          boxShadow: '0 16px 48px rgba(0, 0, 0, 0.4), 0 0 30px rgba(220, 38, 38, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        },
        '.glow-red': {
          boxShadow: '0 0 20px rgba(220, 38, 38, 0.4)',
        },
        '.glow-red-lg': {
          boxShadow: '0 0 40px rgba(220, 38, 38, 0.5)',
        },
      }
    }
  },
  plugins: [],
  safelist: [
    // Heatmap colors for volume visualization
    'bg-green-100',
    'bg-green-200', 
    'bg-green-300',
    'bg-green-400',
    'bg-green-500',
    'bg-green-600',
    'bg-green-700',
    'bg-green-800',
    'bg-green-900',
    // Dark mode heatmap colors
    'dark:bg-green-100',
    'dark:bg-green-200',
    'dark:bg-green-300', 
    'dark:bg-green-400',
    'dark:bg-green-500',
    'dark:bg-green-600',
    'dark:bg-green-700',
    'dark:bg-green-800',
    'dark:bg-green-900',
    // Red colors for deload indicators
    'bg-red-100',
    'bg-red-200',
    'bg-red-300',
    'bg-red-400',
    'bg-red-500',
    'bg-red-600',
    'bg-red-700',
    'bg-red-800',
    'bg-red-900',
    'dark:bg-red-100',
    'dark:bg-red-200',
    'dark:bg-red-300',
    'dark:bg-red-400',
    'dark:bg-red-500',
    'dark:bg-red-600',
    'dark:bg-red-700',
    'dark:bg-red-800',
    'dark:bg-red-900',
    // Yellow colors for warnings
    'bg-yellow-100',
    'bg-yellow-200',
    'bg-yellow-300',
    'bg-yellow-400',
    'bg-yellow-500',
    'bg-yellow-600',
    'bg-yellow-700',
    'bg-yellow-800',
    'bg-yellow-900',
    'dark:bg-yellow-100',
    'dark:bg-yellow-200', 
    'dark:bg-yellow-300',
    'dark:bg-yellow-400',
    'dark:bg-yellow-500',
    'dark:bg-yellow-600',
    'dark:bg-yellow-700',
    'dark:bg-yellow-800',
    'dark:bg-yellow-900'
  ]
};
