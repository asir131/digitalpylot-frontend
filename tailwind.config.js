/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1F1F1F",
        night: "#F9F6F3",
        steel: "#E6E1DB",
        mist: "#7E7A74",
        citrus: "#FF7A3D",
        ocean: "#FFB55D",
        neon: "#FF965A",
        blush: "#E85C4A",
        cream: "#FFF7EE",
        latte: "#F3E9DD",
        cocoa: "#3D3127",
      },
      fontFamily: {
        display: ["'Outfit'", "sans-serif"],
        body: ["'Plus Jakarta Sans'", "sans-serif"],
      },
      boxShadow: {
        glow: "0 12px 30px rgba(255, 122, 61, 0.25)",
        card: "0 18px 45px rgba(40, 30, 20, 0.12)",
      },
      backgroundImage: {
        "grid-lines": "linear-gradient(rgba(45,35,28,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(45,35,28,0.06) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};
