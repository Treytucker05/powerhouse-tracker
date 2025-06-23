/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: 'class',  theme: { 
    extend: {
      colors: {
        primary: '#ff1a1a',     // bright red – filled buttons, highlights
        accent:  '#c50505',     // deeper red – borders, hovers, nav underline
        offwhite:'#f2f2f2',
        black:   '#000000',
      },
      container: {
        center: true,
        padding: { DEFAULT: "1rem", sm: "2rem", lg: "4rem", xl: "5rem" },
      },
      boxShadow: {
        lg: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
        xl: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
      },
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
