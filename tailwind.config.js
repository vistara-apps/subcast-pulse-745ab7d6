
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(220 100% 50%)',
        accent: 'hsl(190 70% 60%)',
        bg: 'hsl(220 20% 15%)',
        surface: 'hsl(220 20% 20%)',
        text: 'hsl(220 10% 85%)',
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
      },
      spacing: {
        'sm': '8px',
        'md': '12px',
        'lg': '20px',
      },
      boxShadow: {
        'card': '0 4px 12px hsla(220, 20%, 5%, 0.2)',
      },
      animation: {
        'fast': 'ease-out 100ms',
        'base': 'ease-out 200ms',
      },
    },
  },
  plugins: [],
};
