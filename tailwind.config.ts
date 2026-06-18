import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ART OF KOREA — Korean landscape palette
        background: "#F4F7FA",        // cool off-white, like sky edge
        "background-soft": "#E4EEF5", // soft sky blue
        accent: "#A8C9DF",            // sky blue from the illustration
        "accent-dark": "#6A90AA",     // deeper wave blue
        "light-gray": "#D8E2EA",      // mountain outline gray
        "text-gray": "#5E7282",       // muted blue-gray
        ink: "#1E2D3D",               // deep navy (darkest wave)
        "ink-soft": "#3A506B",        // softer navy
        "sky": "#B8D4E4",             // hero sky blue
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Helvetica", "Arial", "sans-serif"],
        display: ["var(--font-display)", "Impact", "sans-serif"],
        borel: ["var(--font-borel)", "cursive"],
      },
      letterSpacing: {
        widest2: "0.25em",
      },
      maxWidth: {
        content: "1200px",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInSlow: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        dropdownOpen: {
          "0%": { opacity: "0", transform: "scaleY(0)" },
          "100%": { opacity: "1", transform: "scaleY(1)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 1s ease-out forwards",
        fadeInSlow: "fadeInSlow 1.6s ease-out forwards",
        dropdownOpen: "dropdownOpen 0.18s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
