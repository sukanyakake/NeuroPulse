/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // 💡 This scans all your pages and components
  ],
  theme: {
    extend: {
      // You can add custom colors or animations here if needed
    },
  },
  plugins: [],
};
