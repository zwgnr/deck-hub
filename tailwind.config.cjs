/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('./tailwindPreset.js')],
  darkMode: 'class',
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Helvetica Neue", "sans-serif"],
        poppins: ['Poppins', 'sans-serif'],
        //inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require("tailwindcss-radix")],
};
