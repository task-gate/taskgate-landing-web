/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        tiempos: ["TiemposFine-Regular", "serif"],
        tiemposBold: ["TiemposFine-Semibold", "serif"],
        ubuntu: ["Ubuntu", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
      colors: {
        bg: "#121212",
        primary: "#3949AB", // Indigo 900 - matches your gradient start
        secondary: "#fff",
        silver: "#C0C0C0",
        "taskgate-indigo": "#3949AB", // Indigo 900
        "taskgate-purple": "#6A1B9A", // Purple 900
        "taskgate-black": "#000000", // Black
        "gradient-start": "#3949AB",
        "gradient-middle": "#6A1B9A",
        "gradient-end": "#000000",
      },
      fontSize: {
        h1: "clamp(2.5rem, 6vw, 5rem)",
        h2: "clamp(2rem, 5vw, 4rem)",
        h3: "clamp(1.5rem, 4vw, 3rem)",
        h4: "clamp(1.25rem, 3vw, 2.5rem)",
        h5: "clamp(1rem, 3vw, 2rem)",
        body: "clamp(15px, 3vw, 1rem)",
      },
      borderWidth: {
        gradient: "2px",
      },
      keyframes: {
        glow: {
          "0%, 100%": { opacity: 0.5 },
          "50%": { opacity: 1 },
        },
        typewriter: {
          "0%": { width: "0%" },
          "100%": { width: "100%" },
        },
      },
      animation: {
        glow: "glow 3s ease-in-out infinite",
        typewriter: "typewriter 2s steps(40) 1s 1 normal both",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
