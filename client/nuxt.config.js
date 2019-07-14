// import fs from 'fs'

require('dotenv').config()

const polyfills = [
  'Promise',
  'Object.assign',
  'Object.values',
  'Array.prototype.find',
  'Array.prototype.findIndex',
  'Array.prototype.includes',
  'String.prototype.includes',
  'String.prototype.startsWith',
  'String.prototype.endsWith'
]

module.exports = {
  // mode: 'spa',
  srcDir: __dirname,
  server: {
    // https: {
    //   key: fs.readFileSync('/etc/letsencrypt/live/skidvis.ru/privkey.pem', 'utf8'),
    //   cert: fs.readFileSync('/etc/letsencrypt/live/skidvis.ru/cert.pem', 'utf8'),
    //   ca: fs.readFileSync('/etc/letsencrypt/live/skidvis.ru/chain.pem', 'utf8')
    // },
    port: 3000, // default: 3000
    host: '5.45.80.118' // default: localhost
  },
  env: {
    apiUrl: process.env.APP_URL || 'http://api.laravel-nuxt.test',
    appName: process.env.APP_NAME || 'Laravel-Nuxt',
    appLocale: process.env.APP_LOCALE || 'ru',
    daDataApi: process.env.DADATA_API || '',
    githubAuth: !!process.env.GITHUB_CLIENT_ID
  },

  head: {
    title: process.env.APP_NAME,
    titleTemplate: '%s - ' + process.env.APP_NAME,
    bodyAttrs: {
      class: 'theme-default'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    script: [
      { src: `https://cdn.polyfill.io/v2/polyfill.min.js?features=${polyfills.join(',')}` }
    ]
  },

  loading: { color: '#007bff' },

  router: {
    middleware: ['locale', 'check-auth']
  },

  css: [
    { src: '~assets/sass/app.scss', lang: 'scss' }
  ],

  plugins: [
    '~plugins/modifiedUtils',
    '~components/global',
    '~plugins/i18n',
    '~plugins/vform',
    '~plugins/axios',
    '~plugins/fontawesome',
    '~plugins/tooltip',
    '~plugins/modal',
    '~plugins/breadcrumbs',
    { src: '~plugins/lazyload', ssr: true },
    { src: '~plugins/color-picker', ssr: false },
    { src: '~plugins/vue-quill-editor', ssr: false },
    { src: '~plugins/vue-picture-input', ssr: false }
    // '~plugins/nuxt-client-init',
    // { src: '~plugins/bootstrap', ssr: false }
  ],

  modules: [
    '@nuxtjs/router',
    'vue-sweetalert2/nuxt',
    '~/modules/spa'
  ],

  build: {
    extractCSS: true
  }
}
