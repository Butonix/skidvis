import axios from 'axios'
import Vue from 'vue'
import { isEqual } from 'lodash'
import Cookies from 'js-cookie'
import moment from 'moment'

// state
export const state = () => ({
  user: {
    city: {
      id: 3,
      name: 'Санкт-Петербург',
      latitude: 59.939131,
      longitude: 30.3159
    },
    wishlist: []
  },
  isAdministrator: false,
  isManagement: false,
  token: null,
  cities: [],
  articles: {},
  blog: {
    status: false
  }
})

// getters
export const getters = {
  blog: state => state.blog,
  articles: state => state.articles,
  user: state => state.user,
  token: state => state.token,
  city: state => state.user.city,
  wishlist: state => (state.user.wishlist) ? state.user.wishlist : [],
  wishCount: state => (state.user.wishlist) ? state.user.wishlist.length : 0,
  cities: state => state.cities,
  check: state => !!state.user.id,
  isAdministrator: state => state.isAdministrator,
  isManagement: state => state.isManagement
}

// mutations
export const mutations = {
  SET_ARTICLES (state, articles) {
    state.articles = articles
  },
  ADD_ARTICLE (state, id) {
    state.articles[id] = Number(moment().format('x'))
  },
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
    state.isAdministrator = false
    state.isManagement = false
    for (let i in user.roles) {
      let role = user.roles[i]
      switch (role.name) {
        case 'super_administrator':
          state.isAdministrator = true
          state.isManagement = true
          break
        case 'administrator':
          state.isAdministrator = true
          break
        case 'management':
          state.isManagement = true
          break
      }
    }
  },

  FETCH_USER_FAILURE (state) {
    state.token = null
  },

  LOGOUT (state) {
    state.user.wishlist = []
    state.user.id = null
    state.token = null
    state.isAdministrator = false
    state.isManagement = false
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
  },

  SET_BLOG (state, blog) {
    state.blog = blog
  }
}

// actions
export const actions = {
  async fetchBlog ({ getters, commit }) {
    try {
      let { data } = await axios.get(`articles/latest`)
      commit('SET_BLOG', {
        status: data.status
      })
    } catch (e) {
      console.log(e)
    }
  },
  getArticlesArray ({ getters, dispatch }) {
    let articlesObj = {}
    let articles = []
    for (let i in getters.articles) {
      try {
        if (getters.articles[i] >= (Number(moment().format('x')) - 86400000)) {
          articlesObj[i] = getters.articles[i]
          let id = Number(i)
          if (!Number.isNaN(id)) {
            articles.push(id)
          }
        }
      } catch (e) {
      }
    }
    dispatch('saveArticle', articlesObj)
    return articles
  },
  addArticle ({ commit, getters, dispatch }, id) {
    commit('ADD_ARTICLE', id)
    dispatch('saveArticle')
  },
  saveArticle ({ commit, getters, dispatch }, articles) {
    if (!articles) {
      articles = getters.articles
    }
    commit('SET_ARTICLES', articles)
    Cookies.set('articles', articles, { expires: 1 })
  },
  async postWishlist ({ getters }) {
    Cookies.set('wishlist', getters.wishlist, { expires: 365 })
  },
  async pushInWishlist ({ commit, getters, dispatch }, id) {
    if (getters.wishlist.indexOf(id) === -1) {
      commit('PUSH_IN_WISHLIST', id)
      dispatch('postWishlist')

      if (getters.check) {
        try {
          await axios.post(`products/${id}/marked`)
        } catch (e) {
          console.log(e)
        }
      }
    }
  },
  async removeFromWishlist ({ commit, getters, dispatch }, id) {
    let index = getters.wishlist.indexOf(id)

    if (index !== -1) {
      commit('REMOVE_FROM_WISHLIST', index)
      dispatch('postWishlist')

      if (getters.check) {
        try {
          await axios.delete(`products/${id}/marked`)
        } catch (e) {
          console.log(e)
        }
      }
    }
  },
  async setCity ({ commit, getters }, city) {
    if (!(city instanceof Object)) {
      try {
        let { data } = await axios.get('cities/' + city)
        city = data
      } catch (e) {
        return true
      }
    }

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

    let user = { ...((data.user) ? data.user : data) }

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

    if (!isEqual(data.wishlist, newUser.wishlist)) {
      try {
        await axios.post('user/wishlist', {
          products: newUser.wishlist
        })
        const res = await axios.get('user/wishlist', {
          params: {
            responseTypeId: 2
          }
        })
        if (res.data.list) {
          commit('SET_WISHLIST', res.data.list)
        }
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
