import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        /* Brick Theme */
        brickDark: "hsl(var(--brick-dark))",
        brickOutline: "hsl(var(--brick-outline))",
        brickOutlineAlt: "hsl(var(--brick-outline-alt))",

        /* Core Tailwind Variables Updated for Poster Theme */
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        /* Neon Green (from uploaded image) */
        primary: {
          DEFAULT: "#35C574",
          foreground: "#ffffff",
        },

        /* Secondary, destructive, muted etc. remain same */
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },

        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        neonPulse: {
          "0%, 100%": {
            boxShadow:
              "0 0 5px #35C574, 0 0 15px #35C574, 0 0 30px #35C574",
          },
          "50%": {
            boxShadow:
              "0 0 10px #35C574, 0 0 20px #35C574, 0 0 40px #35C574",
          },
        },
        glowFlicker: {
          "0%, 19.999%, 22%, 62.999%, 64%, 100%": { opacity: "1" },
          "20%, 21.999%, 63%, 63.999%": { opacity: "0.4" },
        },
        brickScroll: {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "0 60px" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        grid: {
          "0%": { transform: "translateY(-50%)" },
          "100%": { transform: "translateY(0)" },
        },
        "border-beam": {
          "100%": {
            "offset-distance": "100%",
          },
        },
        gradient: {
          to: {
            backgroundPosition: "var(--bg-size) 0",
          },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(calc(-100% - var(--gap)))" },
        },
        "marquee-vertical": {
          from: { transform: "translateY(0)" },
          to: { transform: "translateY(calc(-100% - var(--gap)))" },
        },
      },
      animation: {
        neonPulse: "neonPulse 2s ease-in-out infinite",
        glowFlicker: "glowFlicker 3s infinite",
        brickScroll: "brickScroll 30s linear infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        grid: "grid 15s linear infinite",
        gradient: "gradient 8s linear infinite",
        "border-beam": "border-beam calc(var(--duration)*1s) infinite linear",
        marquee: "marquee var(--duration) linear infinite",
        "marquee-vertical":
          "marquee-vertical var(--duration) linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
