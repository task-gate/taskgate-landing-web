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
        bg: "#ffffff",
        'bg-secondary': "#f7f6f3",
        'bg-tertiary': "#f1f0ee",
        primary: "#37352f",
        secondary: "#787774",
        accent: "#2383e2",
        'accent-hover': "#1a6dbd",
        border: "#e9e9e7",
        'notion-red': "#e03e3e",
        'notion-orange': "#d9730d",
        'notion-yellow': "#dfab01",
        'notion-green': "#0f7b6c",
        'notion-blue': "#2383e2",
        'notion-purple': "#9065b0",
        'notion-pink': "#c14c8a",
        'notion-gray': "#787774",
        // Dark mode
        'dark-bg': "#191919",
        'dark-bg-secondary': "#2f2f2f",
        'dark-primary': "#e6e6e6",
        'dark-secondary': "#9b9a97",
        'dark-border': "#3f3f3f",
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
