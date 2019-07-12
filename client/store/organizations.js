import Vue from 'vue'
import axios from 'axios'
import { sortBy } from 'lodash'

// state
export const state = () => ({
  search: '',
  sortBy: 'name',
  currentPage: 1,
  perPage: 11,
  items: {
    data: [
      // {
      //   id: 1,
      //   name: 'Формула кино',
      //   description: 'Создал модератор Константин Константинопольский 29 июня 2019',
      //   link: 'http://',
      //   logo: {
      //     color: '#000000',
      //     src: '/placeholders/1920x700.jpg'
      //   }
      // },
      // {
      //   id: 2,
      //   name: 'Формула кино Формула кино Формула кино Формула кино ',
      //   description: 'Создал модератор Константин Константинопольский 29 июня 2019 Создал модератор Константин Константинопольский 29 июня 2019',
      //   logo: {
      //     src: '/placeholders/demo.jpg'
      //   }
      // },
      // {
      //   id: 3,
      //   name: 'Формула кино Формула кино Формула кино Формула кино ',
      //   description: 'Создал модератор Константин Константинопольский 29 июня 2019 Создал модератор Константин Константинопольский 29 июня 2019',
      //   logo: {
      //     src: '/placeholders/logo.svg'
      //   }
      // }
    ]
  }
})

// getters
export const getters = {
  getSearch: (state) => state.search,
  getItemsLength: (state) => state.items.data ? state.items.data.length : 0,
  getData: (state) => state.items ? state.items : {},
  getItems: (state) => state.items.data ? sortBy(state.items.data, ['name']) : [],
  getSortBy: (state) => state.sortBy
}

// mutations
export const mutations = {
  SET_SEARCH (state, value) {
    Vue.set(state, 'search', value)
  },
  SET_SORT_BY (state, value) {
    Vue.set(state, 'search', value)
  },
  SET_ITEMS (state, value) {
    Vue.set(state, 'items', value)
  },
  SET_CURRENT_PAGE (state, value) {
    Vue.set(state, 'currentPage', Number(value))
  },
  FETCH_DATA_SUCCESS (state, value) {
    console.log(value)
    Vue.set(state, 'items', value)
  }
}

// actions
export const actions = {
  setSearch ({ commit, dispatch }, value) {
    commit('SET_SEARCH', value)
    dispatch('fetchItems')
  },
  async fetchItems ({ commit, state }) {
    try {
      const { data } = await axios.get('/1/management/organizations', {
        params: {
          perPage: state.perPage,
          page: state.currentPage,
          search: state.search,
        }
      })
      commit('FETCH_DATA_SUCCESS', data)
    } catch (e) {
      console.log('FETCH_USER_FAILURE')

      // commit('FETCH_USER_FAILURE')
    }
    console.log('organizations/fetchItems')
  },
  setSortBy ({ commit }, value) {
    commit('SET_SORT_BY', value)
  },
  setCurrentPage ({ commit, dispatch }, value) {
    console.log(value)
    // commit('SET_CURRENT_PAGE', value)
    // dispatch('fetchItems')
  }
}
