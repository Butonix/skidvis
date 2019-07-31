import axios from 'axios'
import Vue from 'vue'
import { isEqual } from 'lodash'
import Cookies from 'js-cookie'

// state
export const state = () => ({
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
  wishlist: state => (state.user.wishlist) ? state.user.wishlist : [],
  wishCount: state => (state.user.wishlist) ? state.user.wishlist.length : 0,
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
    state.user.wishlist = []
    state.user.id = null
    state.token = null
  },

  UPDATE_USER (state, { user }) {
    state.user = user
  },

  SET_WISHLIST (state, wishlist) {
    Vue.set(state.user, 'wishlist', wishlist)
  },

  PUSH_IN_WISHLIST (state, id) {
    state.user.wishlist.push(id)
  },

  REMOVE_FROM_WISHLIST (state, index) {
    Vue.delete(state.user.wishlist, index)
  }
}

// actions
export const actions = {
  async postWishlist ({ getters }) {
    Cookies.set('wishlist', getters.wishlist, { expires: 365 })

    if (getters.check) {
      try {
        await axios.post('user/wishlist', {
          products: getters.wishlist
        })
      } catch (e) {
        console.log(e)
      }
    }
  },
  async pushInWishlist ({ commit, getters, dispatch }, id) {
    if (getters.wishlist.indexOf(id) === -1) {
      commit('PUSH_IN_WISHLIST', id)
      dispatch('postWishlist')
    }
  },
  async removeFromWishlist ({ commit, getters, dispatch }, id) {
    let index = getters.wishlist.indexOf(id)

    if (index !== -1) {
      commit('REMOVE_FROM_WISHLIST', index)
      dispatch('postWishlist')
    }
  },
  async setCity ({ commit, getters }, city) {
    let oldCity = getters.city
    let check = getters.check

    commit('SET_CITY', city)

    if (city && city.id) {
      Cookies.set('city', city, { expires: 365 })
    }

    try {
      if (check) {
        await axios.post('user/city', {
          city_id: city.id
        })
      }
    } catch (e) {
      commit('SET_CITY', oldCity)
      if (oldCity && oldCity.id) {
        Cookies.set('city', oldCity, { expires: 365 })
      }
    }
  },
  saveToken ({ commit, dispatch }, { token, remember }) {
    commit('SET_TOKEN', token)

    Cookies.set('token', token, { expires: remember ? 365 : 365 })
  },

  beforeSaveUpdateUser ({ commit, dispatch, state }, { data }) {
    let city = state.user.city
    let wishlist = state.user.wishlist

    let user = (data.user) ? data.user : data

    if (city) {
      user.city = city
    }

    if (wishlist && wishlist.length) {
      user.wishlist = wishlist
    }

    if (!user.city) {
      user.city = { id: 3, name: 'Санкт-Петербург' }
    }

    if (!user.wishlist) {
      user.wishlist = []
    }

    if (data.user) {
      data.user = user
    } else {
      data = user
    }
    return data
  },

  async afterSaveUpdateUser ({ commit, dispatch }, { newData, data }) {
    let newUser = (newData.user) ? newData.user : newData

    if (data.city.id !== newUser.city.id) {
      try {
        await axios.post('user/city', {
          city_id: newUser.city.id
        })
      } catch (e) {
      }
    }

    console.log('isEqual', isEqual(data.wishlist, newUser.wishlist), data.wishlist, newUser.wishlist)

    if (!isEqual(data.wishlist, newUser.wishlist)) {
      try {
        await axios.post('user/wishlist', {
          products: newUser.wishlist
        })
      } catch (e) {
        console.log(e)
      }
    }
  },

  async fetchUser ({ commit, dispatch }) {
    try {
      const { data } = await axios.get('user')
      let newData = await dispatch('beforeSaveUpdateUser', { data })
      commit('FETCH_USER_SUCCESS', newData)
      dispatch('afterSaveUpdateUser', {
        newData,
        data
      })
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

  async updateUser ({ commit, dispatch }, data) {
    let newData = await dispatch('beforeSaveUpdateUser', { data })
    commit('UPDATE_USER', newData)
    dispatch('afterSaveUpdateUser', {
      newData,
      data
    })
  },

  async logout ({ commit }) {
    try {
      await axios.post('/logout')
    } catch (e) {
    }

    Cookies.remove('token')
    Cookies.remove('wishlist')

    commit('LOGOUT')
  },

  async fetchOauthUrl (ctx, { provider }) {
    const { data } = await axios.post(`/oauth/${provider}`)

    return data.url
  }
}
