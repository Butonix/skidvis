import axios from 'axios'
import Cookies from 'js-cookie'

// state
export const state = () => ({
  defaultUser: {
    city: { id: 3, name: 'Санкт-Петербург' },
    wishlist: []
  },
  user: {
    city: { id: 3, name: 'Санкт-Петербург' },
    wishlist: []
  },
  token: null,
  cities: []
})

// getters
export const getters = {
  user: state => state.user,
  token: state => state.token,
  city: state => state.user.city,
  wishCount: state => state.user.wishlist.length,
  cities: state => state.cities,
  check: state => !!state.user.id
}

// mutations
export const mutations = {
  SET_CITY (state, city) {
    state.user.city = city
  },
  SET_CITIES (state, cities) {
    state.cities = cities
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
    state.user = { ...state.defaultUser }
    state.token = null
  },

  UPDATE_USER (state, { user }) {
    state.user = user
  }
}

// actions
export const actions = {
  async setCity ({ commit, getters }, value) {
    let oldCity = getters.city
    commit('SET_CITY', value)
    try {
      const { data } = await axios.post('user/city', {
        city_id: value.id
      })
      console.log(data)
    } catch (e) {
      commit('SET_CITY', oldCity)
    }
  },
  saveToken ({ commit, dispatch }, { token, remember }) {
    commit('SET_TOKEN', token)

    Cookies.set('token', token, { expires: remember ? 365 : 365 })
  },

  async fetchUser ({ commit }) {
    try {
      const { data } = await axios.get('user')
      console.log(data)
      commit('FETCH_USER_SUCCESS', data)
    } catch (e) {
      Cookies.remove('token')

      commit('FETCH_USER_FAILURE')
    }
  },

  async fetchCities ({ commit, getters }) {
    if (getters.cities.length === 0) {
      try {
        const { data } = await axios.get('cities')
        commit('SET_CITIES', data.list)
      } catch (e) {
        console.log(e)
      }
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
