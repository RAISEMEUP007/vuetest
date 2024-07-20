// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  build: {
    transpile: ['vuetify'],
  },
  modules: [
    '@sidebase/nuxt-auth',
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
    //...
  ],
  typescript: {
    tsConfig: {
      "extends": "./.nuxt/tsconfig.json"
    }
  },
  auth: { 
    isEnabled: true,
    disableServerSideAuth: false,
    baseURL: process.env.BASE_URL,
    provider: {
      type: 'local',
      token: {
        maxAgeInSeconds: 60*60*24
      },
      endpoints: {
        signIn: { path: "api/user/login", method: "post" },
      }
      // trustHost: false,
      // defaultProvider: '',
      // addDefaultCallbackUrl: true
    },
    sessionRefresh: {
        enablePeriodically: true,
        enableOnWindowFocus: true,
    }
  },

  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
})
