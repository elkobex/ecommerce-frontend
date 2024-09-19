const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: colors.green,
        customVerde: '#ADFFA2',
        customAmarillo: '#FFF7A7'
      }
    },
  },
  plugins: [],
}