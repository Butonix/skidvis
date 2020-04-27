import Vue from 'vue'
import VueLazyload from 'vue-lazyload'

Vue.use(VueLazyload, {
  error: '/placeholders/error.svg',
  // loading: '/placeholders/loading_spinner.gif',
  loading: '/placeholders/load.gif',
  attempt: 1
})
