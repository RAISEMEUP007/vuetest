npx nuxi@latest init pmc3

yarn add vuetify

yarn add vite-plugin-vuetify

yarn add @mdi/font

`copy vuetify.ts in plugins`

``` typescript 
// import this after install `@mdi/font` package
import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    // ... your configuration
  })
  app.vueApp.use(vuetify)
})

```

`copy in nuxt.config.ts `

``` config 
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
    //...
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
```

yarn add vuex

yarn add @sidebase/nuxt-auth

yarn add sass

yarn add moment