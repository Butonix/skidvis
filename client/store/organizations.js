import Vue from 'vue'
import axios from 'axios'

// state
export const state = () => ({
  search: '',
  sortBy: 'name',
  page: 1,
  perPage: 11,
  items: {
  }
})

// getters
export const getters = {
  getSearch: (state) => state.search,
  getPage: (state) => state.page,
  getPageCount: (state) => (state.items.total) ? Math.ceil(state.items.total / state.perPage) : 0,
  getItemsLength: (state) => state.items.data ? state.items.data.length : 0,
  getItems: (state) => state.items.data ? state.items.data : [],
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
  SET_PAGE (state, value) {
    Vue.set(state, 'page', value)
  },
  SET_CURRENT_PAGE (state, value) {
    Vue.set(state, 'currentPage', Number(value))
  },
  FETCH_DATA_SUCCESS (state, value) {
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
          page: state.page,
          search: state.search,
        }
      })
      console.log(data);
      commit('FETCH_DATA_SUCCESS', data)
    } catch (e) {
      console.log('FETCH_USER_FAILURE')

      // commit('FETCH_USER_FAILURE')
    }
  },
  setSortBy ({ commit }, value) {
    commit('SET_SORT_BY', value)
  },
  setPage ({ commit, dispatch }, value) {
    commit('SET_PAGE', value)
    dispatch('fetchItems')
  }
}
