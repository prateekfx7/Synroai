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
        clay: {
          canvas: "#fffaf0",
          surface: "#faf5e8",
          card: "#f5f0e0",
          strong: "#ebe6d6",
          dark: "#0a1a1a",
          darkElevated: "#1a2a2a",
          hairline: "#e5e5e5",
          hairlineSoft: "#f0f0f0",
          ink: "#0a0a0a",
          body: "#3a3a3a",
          muted: "#6a6a6a",
          teal: "#1a3a3a",
          pink: "#ff4d8b",
          lavender: "#b8a4ed",
          peach: "#ffb084",
          ochre: "#e8b94a",
          mint: "#a4d4c5",
          coral: "#ff6b5a",
        },
        warehouse: {
          dark: "#0b0f19",
          panel: "#111827",
          border: "#1f2937",
          shelf: "#1e293b",
          aisle: "#0f172a",
        }
      },
      fontFamily: {
        sans: ['Helvetica', 'sans-serif'],
        bold: ['Helvetica-Bold', 'Helvetica', 'sans-serif'],
        heading: ['Helvetica-Bold', 'Helvetica', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;
