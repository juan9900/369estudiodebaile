import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true, // Centers the container with mx-auto
      padding: {
        DEFAULT: "1rem", // Default padding
        sm: "2rem",
        lg: "4rem",
        xl: "5rem",
        "2xl": "6rem",
      },
      screens: {
        // Overrides default screen sizes *only* for the container
        sm: "600px",
        md: "728px",
        lg: "984px",
        xl: "1240px",
        "2xl": "1496px",
      },
    },
    extend: {
      fontSize: {
        heroTitle: [
          "50px",
          {
            fontWeight: 800,
          },
        ],
      },
      fontFamily: {
        montserrat: ["var(--font-montserrat)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
        archivo: ["var(--font-archivo)", "sans-serif"],
        mono: ["var(--font-ibm-plex-mono)", "monospace"],
      },
      colors: {
        textColor: {
          DEFAULT: "#222222",
        },
        // Rediseño 2026 — paleta editorial (ver design_handoff_369_rediseno/README.md)
        vino: {
          DEFAULT: "#8E1C2E",
          hover: "#6E1423",
        },
        ink: {
          DEFAULT: "#16120F",
          soft: "#38312E",
        },
        muted2: {
          DEFAULT: "#57504C",
          2: "#6B615D",
          3: "#8A807B",
        },
        line: {
          DEFAULT: "#E7E1DE",
          soft: "#F0EBE8",
          2: "#DCD5D1",
        },
        track: "#EDE7E4",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: " #8b1e2d",
          dark: " #6f1824",
          darker: " #53121b",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        light: "hsl(var(--light))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backgroundImage: {
        bannerImg: "url(/images/hero.webp)",
        blackOverlay:
          "radial-gradient(circle, rgba(0,0,0,.8) 100%, rgba(0,0,0,0) 100%)",
      },
      animation: {
        marquee: "marquee 25s linear infinite",
        "spin-slow": "spin 8s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
