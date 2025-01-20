/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      height: {
        '135vh': '135vh',
      },
      fontFamily: {
        nunito: ['"Nunito", serif'],
      }
    },
  },
  plugins: [],
}