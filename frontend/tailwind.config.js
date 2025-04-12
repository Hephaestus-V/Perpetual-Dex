/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        'dark': '#111827', // bg-gray-900
        'card': '#1F2937', // bg-gray-800
        'card-hover': '#374151', // bg-gray-700
      },
    },
  },
  plugins: [],
} 