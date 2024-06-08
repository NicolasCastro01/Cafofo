import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/@core/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      keyframes: {
        showMessageByAll: {
          "0%": { transform: 'translateX(-100px)' },
          "50%": { transform: 'translateX(100px)' },
          "100%": { transform: 'translateX(0)' }
        },
        showMessageByUser: {
          "0%": { transform: 'translateX(100px)' },
          "50%": { transform: 'translateX(-100px)' },
          "100%": { transform: 'translateX(0)' }
        }
      },
      animation: {
        showMessageByAll: "showMessageByAll 400ms ease-in-out forwards",
        showMessageByUser: "showMessageByUser 400ms ease-in-out forwards"
      }
    },
  },
  plugins: [],
};
export default config;
