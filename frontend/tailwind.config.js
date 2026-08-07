/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#050505",
        card: "#101010",
        border: "#232323",

        gold: "#D4AF37",
        goldLight: "#E8C878",
        goldDark: "#B8860B",

        text: "#FFFFFF",
        muted: "#B0B0B0",
      },

      borderRadius: {
        xl: "20px",
      },

      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },

      boxShadow: {
        glow: "0 0 30px rgba(212,175,55,0.25)",
      },
    },
  },
  plugins: [],
}