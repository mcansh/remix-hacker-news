module.exports = {
  apps: [
    {
      name: "Remix",
      script: "remix run",
      ignore_watch: ["."],
    },
    {
      name: "Tailwind",
      script: "tailwindcss --output ./app/styles/tailwind.css --watch",
      ignore_watch: ["."],
    },
  ],
};
