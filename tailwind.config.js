/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#C8B209",
        darkblack: "#FFBF00",
        gluongold: "#F3B619",
        purplemist: "#24222C",
        cowboy: "#bd8a0a",
        textprimary: "#878494",
        darkgrey: "#2B2935",
        neutraldark: "#35333F",
      },
    },
  },
  plugins: [],
};
