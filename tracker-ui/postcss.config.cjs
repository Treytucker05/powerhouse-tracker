module.exports = {
  plugins: {
    '@tailwindcss/postcss': {
      config: './tailwind.config.js'  // explicitly point to config
    },
    autoprefixer: {},
  },
};
