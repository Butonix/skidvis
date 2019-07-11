import Vue from 'vue'
import { sortBy } from 'lodash'
// state
export const state = () => ({
  search: '',
  sortBy: 'name',
  items: [
    {
      id: 1,
      name: 'Формула кино',
      description: 'Создал модератор Константин Константинопольский 29 июня 2019',
      logo: {
        src: '/placeholders/1920x700.jpg'
      },
    },
    {
      id: 2,
      name: 'Формула кино Формула кино Формула кино Формула кино ',
      description: 'Создал модератор Константин Константинопольский 29 июня 2019 Создал модератор Константин Константинопольский 29 июня 2019',
      logo: {
        src: '/placeholders/demo.jpg'
      },
    },
    {
      id: 3,
      name: 'Формула кино Формула кино Формула кино Формула кино ',
      description: 'Создал модератор Константин Константинопольский 29 июня 2019 Создал модератор Константин Константинопольский 29 июня 2019',
      logo: {
        src: '/placeholders/logo.svg'
      },
    },
  ]
})

// getters
export const getters = {
  getSearch: (state) => state.search,
  getItems: (state) => sortBy(state.items, ['name']),
  getSortBy: (state) => state.sortBy,
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
}

// actions
export const actions = {
  setSearch ({ commit }, value) {
    commit('SET_SEARCH', value)
  },
  setSortBy ({ commit }, value) {
    commit('SET_SORT_BY', value)
  }
}
