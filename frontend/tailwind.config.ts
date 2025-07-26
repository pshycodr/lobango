/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'rich-black-fogra-29': 'hsl(210, 26%, 7%)',
        'champagne-pink-20': 'hsla(23, 61%, 86%, 0.2)',
        'independence-30': 'hsla(245, 17%, 29%, 0.3)',
        'gray-x-11-gray': 'hsl(0, 0%, 73%)',
        'champagne-pink': 'hsl(23, 61%, 86%)',
        'spanish-gray': 'hsl(0, 0%, 60%)',
        'sonic-silver': 'hsl(0, 0%, 47%)',
        'deep-saffron': 'hsl(32, 100%, 59%)',
        'dark-orange': 'hsl(28, 100%, 58%)',
        'desert-sand': 'hsl(23, 49%, 82%)',
        'isabelline': 'hsl(38, 44%, 96%)',
        'gainsboro': 'hsl(0, 0%, 87%)',
        'tangerine': 'hsl(31, 84%, 50%)',
        'cinnabar': 'hsl(3, 90%, 55%)',
        'black-95': 'hsla(0, 0%, 0%, 0.95)',
        'cultured': 'hsl(0, 0%, 93%)',
        white: 'hsl(0, 0%, 100%)',
        black: 'hsl(0, 0%, 0%)',
        onyx: 'hsl(0, 0%, 27%)',
      },
      fontFamily: {
        rubik: ['Rubik', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
        shadows: ['"Shadows Into Light"', 'cursive'],
      },
      fontSize: {
        'fs-1': '3.2rem',
        'fs-2': '2.2rem',
        'fs-3': '1.8rem',
        'fs-4': '1.4rem',
        'fs-5': '1.2rem',
      },
      fontWeight: {
        500: '500',
        600: '600',
        700: '700',
      },
      spacing: {
        'section': '60px',
      },
      boxShadow: {
        'shadow-1': '0 1px 4px hsla(0, 0%, 0%, 0.2)',
        'shadow-2': '0 1px 2px hsla(0, 0%, 0%, 0.2)',
      },
      transitionTimingFunction: {
        'ease-1': 'ease',
        'ease-2': 'ease',
      },
      transitionDuration: {
        'dur-1': '250ms',
        'dur-2': '500ms',
      },
      clipPath: {
        'clip-1': 'polygon(0 40%, 100% 0%, 100% 100%, 0 100%)',
        'clip-2': 'polygon(0 0%, 100% 0%, 100% 100%, 0 100%)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
