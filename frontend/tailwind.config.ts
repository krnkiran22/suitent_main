import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Sui Brand Colors
        sui: {
          blue: "#4DA2FF",     // The electric blue from the "Get Started" button
          dark: "#05060A",     // Deepest black-blue background
          ocean: "#111827",    // Secondary dark for cards
          steel: "#E0E5EB",    // Primary text
          mist: "#94A3B8",     // Secondary text
          ghost: "rgba(255, 255, 255, 0.05)", // Glass effect
        },
        // Functional Colors
        success: "#22C55E",    // Green for executed trades
        error: "#EF4444",      // Red for failures
        warning: "#F59E0B",    // Amber for pending orders
      },
      backgroundImage: {
        'sui-gradient': 'linear-gradient(180deg, rgba(77,162,255,0.15) 0%, rgba(5,6,10,0) 100%)',
        'hero-glow': 'radial-gradient(circle at 50% -20%, #4DA2FF 0%, transparent 60%)',
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        mono: ['var(--font-jetbrains)'],
      },
    },
  },
  plugins: [],
};
export default config;
