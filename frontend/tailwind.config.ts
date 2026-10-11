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
        brand: {
          navy: "#102A36",
          darkSurface: "#173746",
          lightBg: "#F5F7F4",
          surface: "#FFFFFF",
          deepTeal: "#0D7377",
          teal: "#159A91",
          mint: "#A8D8CB",
          ivory: "#F5F0E6",
          coral: "#E47D62",
          amber: "#E8B86D",
          slate: "#607D8B",
          text: "#172F3B",
          textMuted: "#526570",
          border: "#DCE5E2",
        },
        dim: {
          economic: "#4777A8",
          health: "#159A91",
          social: "#D9A441",
          environmental: "#6B9D78",
        },
      },
      fontFamily: {
        serif: ["var(--font-dm-serif)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
