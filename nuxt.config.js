import colors from "vuetify/es5/util/colors";

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Target: https://go.nuxtjs.dev/config-target
  target: "static",

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: "%s - nuxt-app-firebase",
    title: "nuxt-app-firebase",
    htmlAttrs: {
      lang: "en",
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
      { name: "format-detection", content: "telephone=no" },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    script: [
      {
        src:
          "https://maps.googleapis.com/maps/api/js?language=es&libraries=places&key=" +
          process.env.GOOGLE_API_KEY,
        async: true,
        defer: true,
      },
    ],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: "~/plugins/notifications-ssr", ssr: true },
    { src: "~/plugins/notifications-client", ssr: false },
    { src: "~/plugins/vue2-filters" },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    "@nuxtjs/vuetify",
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    "@nuxtjs/i18n",
    "@nuxtjs/firebase",
    "@nuxtjs/axios",
    "nuxt-clipboard2",
  ],
  axios: {
    proxyHeaders: false,
    credentials: false,
  },
  firebase: {
    // options
    config: {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
      measurementId: process.env.FIREBASE_MEASUREMENT_ID,
    },
    services: {
      auth: {
        initialize: {
          onAuthStateChangedAction: "onAuthStateChangedAction",
          onAuthStateChangedMutation: "ON_AUTH_STATE_CHANGED_MUTATION",
        },
        ssr: false, // default
      },
      firestore: true,
    },
  },
  i18n: {
    /* module options */
    vueI18nLoader: true,
    strategy: "no_prefix",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "root", // recommended
    },
    locales: [
      {
        code: "en",
        name: "English",
      },
      {
        code: "es",
        name: "Español",
      },
    ],
    defaultLocale: "es",
    vueI18n: {
      fallbackLocale: "es",
      messages: {
        en: {
          welcome: "Welcome",
        },
        es: {
          welcome: "Bienvenido",
        },
      },
    },
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ["~/assets/variables.scss"],
    theme: {
      themes: {
        dark: {
          primary: colors.indigo.darken1,
          accent: colors.indigo.accent1,
          secondary: colors.indigo.lighten3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.teal.lighten1,
        },
        light: {
          primary: colors.indigo.darken1,
          accent: colors.indigo.accent1,
          secondary: colors.indigo.lighten3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.teal.lighten1,
        },
      },
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
};
