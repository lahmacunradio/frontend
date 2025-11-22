import { fileURLToPath } from "url";

export default defineNuxtConfig({
  compatibilityDate: "2025-11-06",
  components: true,
  devtools: { enabled: process.env.NODE_ENV !== 'production' },
  devServer: {
    port: 3333,
    host: "0.0.0.0",
  },
  app: {
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
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "anonymous",
        },
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
  },
  css: ["@/assets/css/globalstyles.scss"],
  plugins: [
    // Ensure $axios and $config are available very early
    "~/plugins/axios",
    // App helpers
    "~/plugins/mixinCommonMethods",
    "~/plugins/pinia-persist",
    // Data hydration (uses $axios)
    "~/plugins/pinia-server",
    // SSR + client DOMPurify directive
    "~/plugins/dompurify",
    { src: "~/plugins/dompurify.client", mode: "client" },
    { src: "~/plugins/sentry.client", mode: "client" },
    "~/plugins/date-fns",
  ],
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt"],
  tailwindcss: {
    // Disable the viewer dev route to avoid deprecated handler warning
    viewer: false,
  },
  runtimeConfig: {
    // Private values (only available server-side)
    // Arcsi token kept private (also duplicated in public if intentionally exposed)
    // If this token should NOT be exposed to clients, remove it from the public section below.
    arcsiToken: process.env.ARCSI_TOKEN,
    sentryDsn: process.env.SENTRY_DSN,
    // Public values (available on client). Expose arcsiToken here ONLY if it's safe to leak (e.g. read-only token).
    // If this token grants write or privileged access, move it back to the private section and use server API proxy routes instead.
    public: {
      arcsiToken: process.env.ARCSI_TOKEN,
      // Provide sensible fallbacks if env vars are missing so UX doesn't break
      donateStripeFormUrl:
        process.env.DONATE_STRIPE_FORM_URL ||
        'https://cms.lahmacun.hu/wp-json/stripe/return_checkout_session_listener',
      membershipStripeFormUrl:
        process.env.MEMBERSHIP_STRIPE_FORM_URL ||
        'https://cms.lahmacun.hu/wp-json/stripe/return_checkout_session_membership',
      subscriptionCancelUrl:
        process.env.SUBSCRIPTION_CANCEL_URL ||
        'https://billing.stripe.com/p/login/bIYaHhfXYepr39C000',
    },
  },
  vite: {
    resolve: {
      alias: {
        // Workaround for Vite import analysis trying to resolve a Nuxt virtual module during dev
        // Nuxt provides this internally, but some Vite versions still pre-analyze the import literal.
        // Map to a harmless local stub so analysis passes; runtime uses the network manifest path.
        "#app-manifest": fileURLToPath(
          new URL("./utils/app-manifest-stub.mjs", import.meta.url)
        ),
        // Provide a compatibility shim for `ufo` to add missing `joinRelativeURL` export
        // used by generated .nuxt/paths.mjs in some Nuxt/Vite combinations.
        ufo: fileURLToPath(new URL("./utils/ufo-compat.mjs", import.meta.url)),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/css/_variables.scss" as *;',
        },
      },
    },
  }
});
