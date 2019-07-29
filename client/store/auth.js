import axios from 'axios'
import Cookies from 'js-cookie'

// state
export const state = () => ({
  user: {
    wishlist: []
  },
  token: null,
  city: 1,
  wishCount: 22,
  cityName: 'Петропавловск-Камчатский',
  cities: [
    { value: 1, label: 'Петропавловск-Камчатский' },
    { value: 2, label: 'Петропавловск-Камчатский' },
    { value: 3, label: 'Петропавловск-Камчатский' },
    { value: 4, label: 'Петропавловск-Камчатский' },
    { value: 5, label: 'Петропавловск-Камчатский' }
  ]
})

// getters
export const getters = {
  user: state => state.user,
  token: state => state.token,
  city: state => state.city,
  wishCount: state => state.user.wishlist.length,
  cityName: state => state.cityName,
  cities: state => state.cities,
  check: state => !!state.user.id
}

// mutations
export const mutations = {
  SET_CITY (state, city) {
    state.city = city
  },
  SET_TOKEN (state, token) {
    state.token = token
  },

  FETCH_USER_SUCCESS (state, user) {
    state.user = user
  },

  FETCH_USER_FAILURE (state) {
    state.token = null
  },

  LOGOUT (state) {
    state.user = null
    state.token = null
  },

  UPDATE_USER (state, { user }) {
    state.user = user
  }
}

// actions
export const actions = {
  setCity ({ commit }, value) {
    commit('SET_CITY', value)
  },
  saveToken ({ commit, dispatch }, { token, remember }) {
    commit('SET_TOKEN', token)

    Cookies.set('token', token, { expires: remember ? 365 : 365 })
  },

  async fetchUser ({ commit }) {
    try {
      const { data } = await axios.get('/user')
      console.log(data)
      commit('FETCH_USER_SUCCESS', data)
    } catch (e) {
      Cookies.remove('token')

      commit('FETCH_USER_FAILURE')
    }
  },

  updateUser ({ commit }, payload) {
    commit('UPDATE_USER', payload)
  },

  async logout ({ commit }) {
    try {
      await axios.post('/logout')
    } catch (e) { }

    Cookies.remove('token')

    commit('LOGOUT')
  },

  async fetchOauthUrl (ctx, { provider }) {
    const { data } = await axios.post(`/oauth/${provider}`)

    return data.url
  }
}
