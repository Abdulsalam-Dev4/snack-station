/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fdf2f2",
          100: "#fce7e7",
          200: "#f8c1c1",
          300: "#f49b9b",
          400: "#ef5e5e",
          500: "#e02020",
          600: "#c41414",
          700: "#9f1010",
          800: "#7d0f0f",
          900: "#610d0d",
        },
      },
      boxShadow: {
        card: "0 8px 20px rgba(0,0,0,0.12)",
        soft: "0 4px 12px rgba(0,0,0,0.08)",
      },
      borderRadius: {
        xlg: "1.25rem",
      },
    },
  },
  plugins: [],
}

