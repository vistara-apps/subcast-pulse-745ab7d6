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
        primary: {
          50: 'hsl(220 100% 95%)',
          100: 'hsl(220 100% 90%)',
          500: 'hsl(220 100% 50%)',
          600: 'hsl(220 100% 45%)',
          700: 'hsl(220 100% 40%)',
          DEFAULT: 'hsl(220 100% 50%)',
        },
        accent: {
          50: 'hsl(190 70% 95%)',
          100: 'hsl(190 70% 85%)',
          500: 'hsl(190 70% 60%)',
          600: 'hsl(190 70% 55%)',
          DEFAULT: 'hsl(190 70% 60%)',
        },
        bg: {
          DEFAULT: 'hsl(220 20% 15%)',
          secondary: 'hsl(220 20% 12%)',
        },
        surface: {
          DEFAULT: 'hsl(220 20% 20%)',
          hover: 'hsl(220 20% 25%)',
          active: 'hsl(220 20% 30%)',
        },
        text: {
          primary: 'hsl(220 10% 95%)',
          secondary: 'hsl(220 10% 85%)',
          muted: 'hsl(220 10% 65%)',
          disabled: 'hsl(220 10% 45%)',
          DEFAULT: 'hsl(220 10% 85%)',
        },
        border: {
          DEFAULT: 'hsl(220 20% 30%)',
          hover: 'hsl(220 50% 50%)',
          focus: 'hsl(220 100% 60%)',
        },
        success: 'hsl(142 76% 36%)',
        warning: 'hsl(38 92% 50%)',
        error: 'hsl(0 84% 60%)',
      },
      borderRadius: {
        'xs': '2px',
        'sm': '6px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '20px',
      },
      spacing: {
        '0.5': '2px',
        '1.5': '6px',
        '2.5': '10px',
        '3.5': '14px',
        '4.5': '18px',
        '5.5': '22px',
        '6.5': '26px',
        '7.5': '30px',
        '8.5': '34px',
        '9.5': '38px',
        '18': '72px',
        '22': '88px',
        '26': '104px',
        '30': '120px',
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },
      fontWeight: {
        'medium': '500',
        'semibold': '600',
        'bold': '700',
        'extrabold': '800',
      },
      boxShadow: {
        'card': '0 4px 12px hsla(220, 20%, 5%, 0.3)',
        'card-hover': '0 8px 24px hsla(220, 20%, 5%, 0.4)',
        'button': '0 2px 8px hsla(220, 100%, 50%, 0.2)',
        'button-hover': '0 4px 12px hsla(220, 100%, 50%, 0.3)',
        'inner': 'inset 0 2px 4px hsla(220, 20%, 5%, 0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-subtle': 'bounceSubtle 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-2px)' },
        },
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
};
