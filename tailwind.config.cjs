module.exports = {
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#ff6600",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
