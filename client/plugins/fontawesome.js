import Vue from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import fontawesome from '@fortawesome/fontawesome'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'

// import { } from '@fortawesome/fontawesome-free-regular/shakable.es'

import {
  faUser, faLock, faSignOutAlt, faCog, faPencilAlt, faSync
} from '@fortawesome/fontawesome-free-solid/shakable.es'

import {
  faGithub
} from '@fortawesome/fontawesome-free-brands/shakable.es'

library.add(
  faUser, faLock, faSignOutAlt, faCog, faGithub, faPencilAlt, faSync
)

fontawesome.config.autoAddCss = false

Vue.component('fa', FontAwesomeIcon)
