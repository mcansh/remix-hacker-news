/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    fontSize: {
      subtext: "7pt",
      admin: "8.5pt",
      comment: "9pt",
      base: "10pt",
    },
    fontFamily: {
      sans: ["Verdana", "Geneva", "sans-serif"],
    },
    colors: {
      primary: "#ff6600",
      bg: "#f6f6ef",
      default: "#828282",
      black: "#000000",
      white: "#ffffff",
    },
  },
  plugins: [],
};
