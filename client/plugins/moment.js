import Vue from 'vue'
import VueMoment from 'vue-moment'
import Ru from 'moment/locale/ru'
import moment from 'moment'

moment.updateLocale('ru', Ru)

Vue.use(VueMoment, {
  moment
})
