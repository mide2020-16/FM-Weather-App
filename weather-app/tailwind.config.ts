import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"], // fixed
  theme: {
    extend: {
      colors: {
        neutral: {
          50: "#FFFFFF",
          200: "#D4D3D9",
          300: "#ACACB7",
          600: "#3C3B5E",
          700: "#302F4A",
          800: "#262540",
          900: "#02012C",
        },
        blue: {
          500: "#4658D9"
        }
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)", "sans-serif"],
        display: ["var(--font-bricolage)", "sans-serif"],
      },
      spacing: {
        // you can define custom spacing like 72: "18rem"
      },
      borderRadius: {
        0: '0px',
        4: '4px',
        6: '6px',
        8: '8px',
        10: '10px',
        12: '12px',
        16: '16px',
        20: '20px',
        24: '24px',
        full: '999px'
      },
    },
  },
  plugins: [],
};

export default config;
