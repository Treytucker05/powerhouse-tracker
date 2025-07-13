module.exports = {
  plugins: [
    require('@tailwindcss/postcss')({   // Tailwind v4 PostCSS bridge
      config: './tailwind.config.cjs',  // points to your Tailwind config
    }),
    require('autoprefixer'),
  ],
};
