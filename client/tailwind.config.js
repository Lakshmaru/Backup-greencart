/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './client/src/**/*.{js,jsx,ts,tsx}',
    './index.html',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4fbf8b',               // ✅ 500‑grade brand green
        'primary-dull': '#44ae7c',       // 🔧 named gray-variant; works as bg-primary-dull
      },
    },
  },
  plugins: [],
};
