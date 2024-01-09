/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.svelte', './src/**/*.html'],
  darkMode: false,
  theme: {
    extend: {}
  },
  variants: {
    extend: {
      textOverflow: ['ellipsis']
    }
  },
  plugins: []
};
