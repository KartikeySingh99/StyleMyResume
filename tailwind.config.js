/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0077B6",
        secondary: "#03045E",
        color1: "#00B4D8",
        logo: "#023E8A"
      },
      fontFamily: {
        heading: ['Lobster', 'sans-serif'],
        Oswald:["Oswald", 'sans-serif'],
        Inter:["Inter", 'sans-serif']
      }
    },
  },
  plugins: [],
}

