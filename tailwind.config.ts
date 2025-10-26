import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#E8F4F8", // Chrysler Chrome
          50: "#F5FAFB",
          100: "#E8F4F8",
          200: "#D1E9F1",
          300: "#BADEEA",
          400: "#A3D3E3",
          500: "#8CC8DC",
          600: "#75BDD5",
          700: "#5EB2CE",
          800: "#47A7C7",
          900: "#309CC0",
        },
        secondary: {
          DEFAULT: "#A8D8E8", // Empire Sky
          50: "#F0F8FB",
          100: "#E1F1F7",
          200: "#C3E3EF",
          300: "#A8D8E8",
          400: "#8ACDE0",
          500: "#6CC2D8",
          600: "#4EB7D0",
          700: "#30ACC8",
          800: "#2890A7",
          900: "#207486",
        },
        accent: {
          DEFAULT: "#6FC7B6", // Liberty Copper
          50: "#F0FAF8",
          100: "#E1F5F1",
          200: "#C3EBE3",
          300: "#A5E1D5",
          400: "#87D7C7",
          500: "#6FC7B6",
          600: "#51BDA9",
          700: "#429A8A",
          800: "#33776B",
          900: "#24544C",
        },
        success: {
          DEFAULT: "#5A8F4F", // Central Green
          50: "#F2F7F1",
          100: "#E5EFE3",
          200: "#CBDFC7",
          300: "#B1CFAB",
          400: "#97BF8F",
          500: "#7DAF73",
          600: "#5A8F4F",
          700: "#4A7540",
          800: "#3A5B31",
          900: "#2A4122",
        },
      },
      borderRadius: {
        xl: "16px",
        "2xl": "20px",
        "3xl": "24px",
        "4xl": "32px",
      },
      boxShadow: {
        soft: "0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)",
        float: "0 10px 30px -5px rgba(0, 0, 0, 0.1), 0 20px 40px -10px rgba(0, 0, 0, 0.08)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
