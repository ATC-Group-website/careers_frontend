/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  corePlugins: {
    preflight: false,
  },
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#EB1F2F",
        grayTitle: "#848484",
        grayPar: "#888888",
      },
    },
  },
  plugins: [require('tailwindcss-primeui')],
}

