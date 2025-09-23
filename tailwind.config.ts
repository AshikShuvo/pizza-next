import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'ringside-compressed': ['var(--font-ringside-compressed)', 'sans-serif'],
        'ringside-narrow': ['var(--font-ringside-narrow)', 'sans-serif'],
      },
      colors: {
        'peppes-red': 'var(--Peppes-Red)',
        'glowing-red': 'var(--Glowing-Red)',
        'coal': 'var(--Coal)',
        'light-bg': 'var(--Light-BG)',
        'pure-black': 'var(--Pure-Black)',
        'white': 'var(--White)',
      },
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        '3xl': '1920px',
      },
    },
  },
  plugins: [],
};

export default config;
