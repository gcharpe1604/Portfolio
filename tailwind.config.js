/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        border: "hsl(var(--border))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        accent: "hsl(var(--accent))",
        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 60px rgba(45, 212, 191, 0.16)",
        "card-glow": "0 24px 80px rgba(0, 0, 0, 0.42)",
      },
      backgroundImage: {
        "radial-grid":
          "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)",
      },
      animation: {
        "aurora-shift": "aurora-shift 18s ease-in-out infinite alternate",
        "pulse-soft": "pulse-soft 5s ease-in-out infinite",
      },
      keyframes: {
        "aurora-shift": {
          "0%": { transform: "translate3d(-8%, -4%, 0) scale(1)" },
          "50%": { transform: "translate3d(7%, 5%, 0) scale(1.08)" },
          "100%": { transform: "translate3d(4%, -7%, 0) scale(0.98)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "0.45" },
          "50%": { opacity: "0.78" },
        },
      },
    },
  },
  plugins: [],
};
