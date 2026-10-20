import type { Config } from "tailwindcss";

const config: Config = {
  important: '#ippbook',
  corePlugins: { preflight: false },
  content: [
    "./ippbook/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gothic: {
          950: "#06070a",
          900: "#0c0e14",
          850: "#12151f",
          800: "#181d2a",
        },
        mahogany: {
          950: "#140804",
          900: "#220e07",
          800: "#36180c",
          700: "#4d2312",
        },
        amberGlow: {
          300: "#fde68a",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
        },
        pumpkin: {
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
        },
        parchment: {
          100: "#fbf6ea",
          200: "#f5edd6",
          300: "#ebdcb9",
          400: "#ddc89e",
          500: "#c7ac7e",
          ink: "#24170d",
          faded: "#5c432d",
        }
      },
      fontFamily: {
        heading: ["var(--font-cinzel)", "Cinzel", "serif"],
        decorative: ["var(--font-medieval)", "Cinzel Decorative", "serif"],
        book: ["var(--font-crimson)", "Crimson Pro", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Plus Jakarta Sans", "sans-serif"],
      },
      boxShadow: {
        "lantern": "0 0 45px 15px rgba(245, 158, 11, 0.35)",
        "candle": "0 0 25px 8px rgba(251, 191, 36, 0.4)",
        "pumpkin": "0 0 35px 10px rgba(234, 88, 12, 0.45)",
        "book-heavy": "0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 40px rgba(217, 119, 6, 0.2)",
        "page-curl": "inset 10px 0 20px -5px rgba(0,0,0,0.3), inset -10px 0 20px -5px rgba(0,0,0,0.3)",
      },
      keyframes: {
        flame: {
          "0%, 100%": { transform: "scale(1) rotate(-1deg)", opacity: "0.9" },
          "25%": { transform: "scale(1.08, 0.95) rotate(1.5deg)", opacity: "1" },
          "50%": { transform: "scale(0.96, 1.05) rotate(-0.5deg)", opacity: "0.85" },
          "75%": { transform: "scale(1.04, 0.98) rotate(1deg)", opacity: "0.95" },
        },
        ambientPulse: {
          "0%, 100%": { opacity: "0.45", transform: "scale(1)" },
          "50%": { opacity: "0.65", transform: "scale(1.03)" },
        },
        gentleFloat: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        glowPulse: {
          "0%, 100%": { filter: "drop-shadow(0 0 15px rgba(245, 158, 11, 0.4))" },
          "50%": { filter: "drop-shadow(0 0 28px rgba(245, 158, 11, 0.75))" },
        }
      },
      animation: {
        flame: "flame 2.4s ease-in-out infinite",
        "flame-fast": "flame 1.6s ease-in-out infinite",
        "flame-slow": "flame 3.2s ease-in-out infinite",
        ambientPulse: "ambientPulse 5s ease-in-out infinite",
        gentleFloat: "gentleFloat 4s ease-in-out infinite",
        glowPulse: "glowPulse 3s ease-in-out infinite",
      }
    },
  },
  plugins: [],
};
export default config;
