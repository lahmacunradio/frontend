
export default {
  components: true,
  server: {
    port: 3333, // default: 3000
    host: 'localhost' // default: localhost
  },
  /*
  ** Headers of the page
  */
  head: {
    title: 'Lahmacun Radio',
    titleTemplate: '%s | Lahmacun Radio',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Budapest online radio and more' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap' },
      // Material icons for the player
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons' },
      { rel: 'stylesheet', href: 'https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css' },

    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
    // SCSS file in the project
    '@/assets/css/globalstyles'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~/plugins/mixinCommonMethods'
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/nuxt-tailwindcss
    '@nuxtjs/tailwindcss'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/axios'
  ],
  axios: {
    // proxyHeaders: false
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    },
    babel: {
      plugins: [
        '@babel/plugin-proposal-optional-chaining'
      ]
    }
  }
}