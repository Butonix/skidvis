import Cookies from 'js-cookie'
import { cookieFromRequest } from '~/utils'

export const actions = {
  nuxtServerInit ({ commit }, { req }) {
    const token = cookieFromRequest(req, 'token')
    if (token) {
      commit('auth/SET_TOKEN', token)
    }

    let city = cookieFromRequest(req, 'city', true)
    if (city) {
      commit('auth/SET_CITY', city)
    }

    let wishlist = cookieFromRequest(req, 'wishlist', true)
    if (wishlist) {
      commit('auth/SET_WISHLIST', wishlist)
    }

    const locale = cookieFromRequest(req, 'locale')
    if (locale) {
      commit('lang/SET_LOCALE', { locale })
    }
  },

  nuxtClientInit ({ commit }) {
    const token = Cookies.get('token')
    if (token) {
      commit('auth/SET_TOKEN', token)
    }

    const city = Cookies.getJSON('city')
    if (city) {
      commit('auth/SET_CITY', city)
    }

    const wishlist = Cookies.getJSON('wishlist')
    if (wishlist) {
      commit('auth/SET_WISHLIST', wishlist)
    }

    const locale = Cookies.get('locale')
    if (locale) {
      commit('lang/SET_LOCALE', { locale })
    }
  }
}
