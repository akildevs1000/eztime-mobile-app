import colors from "vuetify/es5/util/colors";

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: "",
    title: "",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { hid: "description", name: "description", content: "" },
      { name: "format-detection", content: "telephone=no" },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    // { src: '~/plugins/geolocation.js', ssr: false }
    { src: "~/plugins/vue-apexchart.js", ssr: false },
    { src: "~/plugins/custom-methods", ssr: false },
    { src: "~/plugins/axios.js" },
    { src: "~/plugins/crypto.js", mode: "client" },
  ],

  target: "static",

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    "@nuxtjs/vuetify",
    "@nuxtjs/dotenv",
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    "@nuxtjs/auth-next",
    "@nuxtjs/axios",
    // https://go.nuxtjs.dev/pwa
    "@nuxtjs/pwa",
    //"nuxt-leaflet",
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    //baseURL: 'https://backend.mytime2cloud.com/api',
    // baseURL: 'https://backend.eztime.online/api',
    baseURL: process.env.BACKEND_URL,
  },

  auth: {
    strategies: {
      local: {
        endpoints: {
          login: { url: "login", method: "post", propertyName: "token" },
          logout: false,
          user: { url: "me", method: "get", propertyName: false },
        },
        maxAge: 86400, // 24 hours
      },
    },

    redirect: {
      logout: "/login",
    },
  },

  router: {
    middleware: ["auth"],
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa

  pwa: {
    manifest: {
      name: "Mytime2Cloud",
      short_name: "Mytime2Cloud",
      lang: "en",
    },
    icon: {
      source: "static/favicon.jpeg", // Path to your app icon
    },
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ["~/assets/variables.scss"],
    theme: {
      dark: false,
      themes: {
        light: {
          //primary: "#5fafa3", //green
          primary: "#6946dd", //violoet
          accent: "#d8363a",
          secondary: "#242424",
          background: "#34444c",
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
          main_bg: "#ECF0F4",
          violet: "#6946dd",
          popup_background: "#ecf0f4",
        },
      },
      // themes: {
      //   dark: {
      //     primary: colors.blue.darken2,
      //     accent: colors.grey.darken3,
      //     secondary: colors.amber.darken3,
      //     info: colors.teal.lighten1,
      //     warning: colors.amber.base,
      //     error: colors.deepOrange.accent4,
      //     success: colors.green.accent3,
      //   },
      // },
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},
  server: {
    // host: "192.168.2.192",
    port: 3002,
  },
};
