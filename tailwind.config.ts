import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    container: { center: true, padding: { DEFAULT: "1rem", sm: "1.5rem", lg: "2rem" }, screens: { "2xl": "1240px" } },
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "sans-serif"],
      },
      colors: {
        ink: { DEFAULT: "#0A0F3D", 2: "#1B2150" },
        body: "#4B5375",
        muted: "#7A819E",
        line: "#E8EBF7",
        soft: "#F6F7FE",
        brand: { blue: "#2B4CF5", cyan: "#00B4FF", violet: "#7C3AED", purple: "#B23CF0", pink: "#E040C8" },
        navy: { DEFAULT: "#0E1438", 2: "#161D4A", 3: "#222A5C" },
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(90deg, #00B4FF 0%, #2B6BF7 45%, #B23CF0 100%)",
        "brand-text": "linear-gradient(90deg, #2B4CF5 0%, #6A3CF5 55%, #B23CF0 100%)",
        "cta-band": "linear-gradient(100deg, #EAF4FF 0%, #F1EEFF 55%, #F6E9FF 100%)",
        "hero-soft": "radial-gradient(1200px 500px at 80% 0%, #EEF0FF 0%, transparent 60%), linear-gradient(180deg,#F7F8FF 0%, #FFFFFF 100%)",
      },
      boxShadow: {
        card: "0 1px 2px rgba(16,24,64,.04), 0 8px 24px -12px rgba(16,24,64,.10)",
        "card-hover": "0 2px 4px rgba(16,24,64,.05), 0 18px 40px -16px rgba(43,76,245,.25)",
        glow: "0 10px 30px -10px rgba(91,76,245,.55)",
      },
      borderRadius: { xl2: "1.25rem" },
      keyframes: {
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-10px)" } },
      },
      animation: { float: "float 6s ease-in-out infinite" },
    },
  },
  plugins: [],
};
export default config;
