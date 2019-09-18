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

    let bookmarks = cookieFromRequest(req, 'bookmarks', true)
    if (bookmarks) {
      commit('auth/SET_BOOKMARKS', bookmarks)
    }

    let articles = cookieFromRequest(req, 'articles', true)
    if (articles) {
      commit('auth/SET_ARTICLES', articles)
    }

    let products = cookieFromRequest(req, 'products', true)
    if (products) {
      commit('auth/SET_PRODUCTS', products)
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

    const bookmarks = Cookies.getJSON('bookmarks')
    if (bookmarks) {
      commit('auth/SET_BOOKMARKS', bookmarks)
    }

    const articles = Cookies.getJSON('articles')
    if (articles) {
      commit('auth/SET_ARTICLES', articles)
    }

    const products = Cookies.getJSON('products')
    if (products) {
      commit('auth/SET_PRODUCTS', products)
    }

    const locale = Cookies.get('locale')
    if (locale) {
      commit('lang/SET_LOCALE', { locale })
    }
  }
}
