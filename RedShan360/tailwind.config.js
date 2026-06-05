/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'rose': '#e8b4b8',
        'cream': '#fcf9f8',
        'dusty-rose': '#8c5e5e',
        'dark-rose': '#7d4d50',
        'luxury-cream': '#FAF8F6',
        'luxury-beige': '#f4f0ed',
      },
      fontFamily: {
        playfair: ['Playfair Display', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'lg': '8px',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'lg': '0 4px 20px rgba(0, 0, 0, 0.12)',
      },
    },
  },
  plugins: [],
}
