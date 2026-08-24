/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "Microsoft YaHei", "PingFang SC", "system-ui", "sans-serif"]
      },
      boxShadow: {
        medical: "0 18px 45px rgba(30, 95, 180, 0.12)"
      }
    }
  },
  plugins: []
};
