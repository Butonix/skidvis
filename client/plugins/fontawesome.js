import Vue from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import fontawesome from '@fortawesome/fontawesome'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// import { } from '@fortawesome/fontawesome-free-regular/shakable.es'

import {
  faUser, faLock, faSignOutAlt, faCog, faPencilAlt, faSync, faMapMarkerAlt, faPlus, faCheck, faTimes,
  faChevronLeft, faChevronRight, faSignInAlt, faCompass
} from '@fortawesome/fontawesome-free-solid/shakable.es'

import {
  faTrashAlt
} from '@fortawesome/fontawesome-free-regular/shakable.es'

import {
  faGithub, faVk, faOdnoklassniki, faFacebookF, faInstagram, faGoogle, faTwitter
} from '@fortawesome/fontawesome-free-brands/shakable.es'

library.add(
  faUser, faLock, faSignOutAlt, faCog, faGithub, faPencilAlt, faSync, faMapMarkerAlt, faPlus, faVk,
  faOdnoklassniki, faFacebookF, faInstagram, faCheck, faTimes, faTrashAlt, faChevronLeft, faChevronRight, faGoogle,
  faSignInAlt, faCompass, faTwitter
)

fontawesome.config.autoAddCss = false

Vue.component('fa', FontAwesomeIcon)
