import Vue from 'vue'
import YmapPlugin from '../utils/yandex-map/index.js'

Vue.use(YmapPlugin, {
  apiKey: process.env.apiMapsYandex,
  lang: 'ru_RU',
  coordorder: 'latlong',
  version: '2.1'
})
