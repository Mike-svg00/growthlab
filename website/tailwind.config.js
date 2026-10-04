/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: { DEFAULT: "#f4f1ec", dark: "#ebe6de" },
        ink: { DEFAULT: "#1c1917", muted: "#6b6560", faint: "#9c958d" },
        accent: { DEFAULT: "#7d4e57", light: "#ebe0e2", soft: "#c9a0a8" },
        line: { DEFAULT: "#d8d2c9", dashed: "#b8aea3" },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', "Georgia", "serif"],
        sans: ['"Manrope"', "system-ui", "sans-serif"],
      },
      maxWidth: {
        site: "72rem",
      },
    },
  },
  plugins: [],
};
