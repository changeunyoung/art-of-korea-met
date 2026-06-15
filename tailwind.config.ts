import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ART OF KOREA — Met Korean Gallery palette
        background: "#F8F8F8", // Primary background
        "background-soft": "#EAF2FF", // Secondary background
        accent: "#D6E3F7", // Accent blue
        "light-gray": "#E7E7E7",
        "text-gray": "#6B7280",
        ink: "#2B2B2B",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Helvetica", "Arial", "sans-serif"],
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
      },
      animation: {
        fadeIn: "fadeIn 1s ease-out forwards",
        fadeInSlow: "fadeInSlow 1.6s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
