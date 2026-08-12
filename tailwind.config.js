/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand blue #4167ba
        brand: {
          50: '#eef2fb',
          100: '#dbe4f5',
          200: '#b7c7ea',
          300: '#8fa7dd',
          400: '#6a87cc',
          500: '#4167ba',
          600: '#37549f',
          700: '#2d4384',
          800: '#243469',
          900: '#1a264e',
          950: '#101733',
        },
        // Accent green #57bf7a
        accent: {
          50: '#eefaf2',
          100: '#d7f3e0',
          200: '#b3e6c6',
          300: '#8ad8a8',
          400: '#6fcd92',
          500: '#57bf7a',
          600: '#3ea262',
          700: '#31854f',
          800: '#286a40',
          900: '#215735',
          950: '#12301e',
        },
        // Coral red-orange #d76855
        coral: {
          50: '#fcf0ee',
          100: '#f8dcd8',
          200: '#f0b8b0',
          300: '#e79387',
          400: '#df7d6e',
          500: '#d76855',
          600: '#bf5442',
          700: '#9c4435',
          800: '#7d372c',
          900: '#652c23',
          950: '#3d1813',
        },
      },
    },
  },
  plugins: [],
}
