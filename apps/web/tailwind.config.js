/** @type {import('tailwindcss').Config} */
module.exports = {
  ...require("config/tailwind.config"),
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "../../packages/ui/**/*.{js,ts,jsx,tsx}",
  ],
};
