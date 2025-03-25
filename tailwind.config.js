/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    variants: {
      extend: {
        display: ['responsive'], 
      },
    },
    screens: {
      sm: "320px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    colors: {
      green: "#22c55e",
      pink: "#d23980",
      navyBlue: "#2e3192",
      grey:"#f1f1f1",
      grey300: "#e3e3e3",
      white: "#ffffff",
      blue: "#2e81be",
      black: "#000000",
      black50: "#7a7a7a"
    },
    container: {
      center: true
    },
    fontFamily: {
      body: ['Poppins'],
    }
  },
  plugins: [],
}

