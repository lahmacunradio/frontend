/*
** TailwindCSS Configuration File
**
** Docs: https://tailwindcss.com/docs/configuration
** Default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
*/
module.exports = {
  purge: [
    './components/**/*.{vue,js}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}'
  ],
  theme: {
    screens: {
      xsm: '380px',
      sm: '576px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px'
    },
    minWidth: {
      0: '0',
      '1/4': '25%',
      '1/3': '33%',
      '1/2': '50%',
      '3/4': '75%',
      full: '100%'
    }
  },
  variants: {},
  plugins: []
}
