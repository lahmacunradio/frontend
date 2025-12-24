/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{vue,js}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}'
  ],
  theme: {
    extend: {
      screens: {
        xxsm: '330px',
        xsm: '380px',
        sm: '576px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
        xxl: '1920px'
      },
      minWidth: {
        0: '0',
        '1/4': '25%',
        '1/3': '33%',
        '1/2': '50%',
        '3/4': '75%',
        full: '100%'
      }
    }
  },
  variants: {},
  plugins: []
}
