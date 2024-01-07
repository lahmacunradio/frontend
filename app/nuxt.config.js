export default {
  components: true,
  server: {
    port: 3333, // default: 3000
    host: "0.0.0.0", // default: localhost
  },
  /*
   ** Headers of the page
   */
  head: {
    title: "Lahmacun Radio",
    titleTemplate: "%s",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content:
          "Lahmacun.hu is an online music & more radio from Budapest since 2018",
      },
      { hid: "keywords", name: "keywords", content: "budapest online radio" },
      {
        hid: "og:site_name",
        name: "og:site_name",
        content: "Lahmacun Radio Budapest",
      },
      { hid: "og:title", name: "og:title", content: "Lahmacun Radio" },
      {
        hid: "og:description",
        name: "og:description",
        content:
          "Lahmacun.hu is an online music & more radio from Budapest since 2018",
      },
      {
        hid: "og:image",
        name: "og:image",
        content: "/lahmacun-logo-share.jpg",
      },
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap",
      },
      {
        rel: "stylesheet",
        href: "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css",
      },
    ],
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: "#fff" },
  /* disable link prefetch */
  router: {
    prefetchLinks: false,
  },
  /*
   ** Global CSS
   */
  css: [
    // SCSS files in the project
    "@/assets/css/globalstyles",
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    "~/plugins/mixinCommonMethods",
    { src: "~/plugins/vuex-persist", mode: "client" },
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/nuxt-tailwindcss
    "@nuxtjs/tailwindcss",
    "@nuxtjs/style-resources",
    "@nuxtjs/moment",
    "@nuxtjs/vuetify",
    "@nuxtjs/dotenv",
  ],
  /*
   ** Nuxt.js modules
   */
  modules: ["@nuxtjs/axios", "@nuxtjs/sentry", "v-sanitize/nuxt"],
  axios: {
    // proxyHeaders: false
  },
  sentry: {
    dsn: process.env.SENTRY_DSN,
    tracing: true,
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {},
    babel: {
      plugins: ["@babel/plugin-proposal-optional-chaining"],
    },
  },
  styleResources: {
    // your settings here
    scss: ["@assets/css/_variables.scss"],
    hoistUseStatements: true,
    // Hoists the "@use" imports. Applies only to "sass", "scss" and "less". Default: false.
  },
  messages: {
    server_error: "🧐 Oh no! 🧤 Server is down 🤖",
    nuxtjs: "What happened? 🙀🐁",
    back_to_home: "🗣 Back home! 🎅🧨👉",
    server_error_details: "Server errorrrrr or unreachable 🤯",
  },
  vuetify: {
    customVariables: ["@/assets/css/banner"],
    treeShake: true,
  },
  privateRuntimeConfig: {
    subscriptionManagementUrl: process.env.SUBSCRIPTION_MANAGEMENT_URL,
    subscriptionCancelUrl: process.env.SUBSCRIPTION_CANCEL_URL,
  },
};
