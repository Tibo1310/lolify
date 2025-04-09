/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'league-blue': '#0A1428',
        'league-gold': '#C8AA6E',
        'league-teal': '#0AC8B9',
        'league-red': '#DA474B',
        'league-dark': '#010A13',
      },
    },
  },
  plugins: [],
} 