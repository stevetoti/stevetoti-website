import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        /* Brand — Navy (primary). Keeps the `deepblue` key so existing classes rebrand automatically. */
        deepblue: {
          DEFAULT: "#1E3A8A",
          50: "#EEF2FB",
          100: "#C7CEE7",
          200: "#A3B0DD",
          300: "#6678C0",
          400: "#3D55A8",
          500: "#1E3A8A",
          600: "#18306F",
          700: "#142862",
          800: "#0F1E4A",
          900: "#0A1433",
        },
        /* Brand — Gold (highlight/accent). Keeps the `vibrantorange` key for auto-rebrand. */
        vibrantorange: {
          DEFAULT: "#F59E0B",
          50: "#FEF6E7",
          100: "#FDE7B5",
          200: "#FCD98A",
          300: "#F8B947",
          400: "#F59E0B",
          500: "#D97706",
          600: "#C47E07",
          700: "#92590E",
          800: "#78480F",
          900: "#451A03",
        },
        /* Brand — Green (success). */
        brandgreen: {
          DEFAULT: "#10B981",
          100: "#D1FAE5",
          200: "#A7F3D0",
          300: "#6EE7B7",
          400: "#34D399",
          500: "#10B981",
          600: "#059669",
          700: "#047857",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "gradient-x": "gradient-x 15s ease infinite",
        "gradient-y": "gradient-y 15s ease infinite",
        "gradient-xy": "gradient-xy 15s ease infinite",
        "blob": "blob 7s infinite",
        "float": "float 6s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        "gradient-y": {
          "0%, 100%": {
            "background-size": "400% 400%",
            "background-position": "center top",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "center center",
          },
        },
        "gradient-x": {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "left center",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center",
          },
        },
        "gradient-xy": {
          "0%, 100%": {
            "background-size": "400% 400%",
            "background-position": "left center",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center",
          },
        },
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
        float: {
          "0%, 100%": {
            transform: "translateY(0px)",
          },
          "50%": {
            transform: "translateY(-20px)",
          },
        },
        glow: {
          "0%": {
            "box-shadow": "0 0 20px rgba(245, 158, 11, 0.3)",
          },
          "100%": {
            "box-shadow": "0 0 40px rgba(245, 158, 11, 0.6)",
          },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
export default config;
