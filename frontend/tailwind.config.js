/** @type {import('tailwindcss').Config} */

const safelistLeft = [];
const safelistBottom = [];

for (let i = 0; i <= 100; i++) {
  safelistLeft.push(`top-[${i}%]`);
  safelistBottom.push(`bottom-[${i}%]`);
  safelistLeft.push(`left-[${i}%]`);
  safelistBottom.push(`right-[${i}%]`);
  safelistBottom.push(`start-[${i}%]`);
}
const safelist = [...safelistLeft, ...safelistBottom];
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: safelist,
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        mytheme: {
          "accent": "#15AAC3",
          "primary" : "#1E3851",
        }
      }
    ]
  },
};
