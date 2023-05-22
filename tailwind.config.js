/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'class': {
          0: '#ef4444',
          1: '#f59e0b',
          2: '#22c55e',
          3: '#0ea5e9',
          4: '#8b5cf6',
          5: '#ec4899',
        },
      },
    },
  },
  plugins: [require("daisyui")],
}

