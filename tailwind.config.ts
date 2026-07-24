import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Shared Bluewater tokens (kept in sync with next-public).
        brand: {
          navy: "#002348",
          azure: "#6EB0D9",
          ink: "#455160",
          paper: "#FAFBFC",
          pearl: "#FFFFFF",
          hairline: "#E5E9EE",
        },
        // Private client space palette: a deep blue field with a very light
        // content surface underneath it.
        portal: {
          deep: "#00102E", // darkest end of the header gradient
          navy: "#002348", // brand navy
          blue: "#0A3D8F", // mid gradient
          bright: "#1C5FBF", // lightest end / hover accents
          mist: "#F4F7FB", // page background under the header
        },
        status: {
          active: "#3DDC84",
          completed: "#F5B942",
        },
      },
      fontFamily: {
        // Real brand faces, self-hosted in /public/fonts (see fonts.css).
        display: ['"Century Gothic"', "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        body: ['"Gotham Pro"', '"Gotham"', "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      backgroundImage: {
        // The signature header/hero field. The vertical stripe artwork is
        // layered on top of this in the Stripes component.
        "portal-field":
          "linear-gradient(100deg, #0A3D8F 0%, #052A63 45%, #00102E 100%)",
      },
      boxShadow: {
        card: "0 6px 24px -10px rgb(0 18 46 / 0.25), 0 2px 8px -4px rgb(0 18 46 / 0.12)",
        "card-hover": "0 14px 40px -12px rgb(0 18 46 / 0.32), 0 4px 12px -6px rgb(0 18 46 / 0.16)",
      },
      keyframes: {
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "drawer-in": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 200ms ease-out",
        "slide-up": "slide-up 320ms cubic-bezier(0.22, 1, 0.36, 1)",
        "drawer-in": "drawer-in 260ms cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
