// state
import Vue from 'vue'
import axios from 'axios'

export const state = () => {
  let interval = []
  for (let i = 0; i < 24; i++) {
    let t = (i < 10) ? '0' + i : i
    interval.push(t + ':00', t + ':10', t + ':20', t + ':30', t + ':40', t + ':50')
  }
  return {
    previousRoute: [],
    pattern: 'data:image/gif;base64,R0lGODlhCgAIAIABAN3d3f///yH5BAEAAAEALAAAAAAKAAgAAAINjAOnyJv2oJOrVXrzKQA7',
    '1920x700': '/placeholders/96x35-1920x700.gif',
    daysOfTheWeek: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
    timezones: [],
    reactData: {},
    pageNamesBreadcrumb: {},
    defaultTimezone: 2,
    defaultOperationModeSelected: {
      mon: {
        start: '07:00',
        end: '20:00',
        active: true
      },
      tue: {
        start: '07:00',
        end: '20:00',
        active: true
      },
      wed: {
        start: '07:00',
        end: '20:00',
        active: true
      },
      thu: {
        start: '07:00',
        end: '20:00',
        active: true
      },
      fri: {
        start: '07:00',
        end: '20:00',
        active: true
      },
      sat: {
        start: '07:00',
        end: '20:00',
        active: true
      },
      sun: {
        start: '07:00',
        end: '20:00',
        active: true
      }
    },
    operationMode: {
      interval: interval,
      default: {
        start: '07:00',
        end: '20:00',
        active: true
      },
      data: {
        mon: {
          label: 'Понедельник'
        },
        tue: {
          label: 'Вторник'
        },
        wed: {
          label: 'Среда'
        },
        thu: {
          label: 'Четверг'
        },
        fri: {
          label: 'Пятница'
        },
        sat: {
          label: 'Суббота'
        },
        sun: {
          label: 'Воскресенье'
        }
      }
    },
    interval,
    addresses: []
  }
}

// getters
export const getters = {
  getPreviousRoute: state => state.previousRoute,
  getDaysOfTheWeek: state => state.daysOfTheWeek,
  getOperationMode: state => state.operationMode,
  getDefaultOperationModeSelected: state => state.defaultOperationModeSelected,
  getTimezones: state => state.timezones,
  getReactData: state => state.reactData,
  getAddresses: state => state.addresses,
  getPageNamesBreadcrumb: state => state.pageNamesBreadcrumb,
  getDefaultTimezone: state => state.defaultTimezone,
  getDefaultTimeSelect: state => state.operationMode.default,
  getInterval: (state) => {
    return state.interval
  }
}
// mutations
export const mutations = {
  ADD_PREVIOUS_ROUTE (state, fun) {
    state.previousRoute.push(fun)
  },
  SET_PREVIOUS_ROUTE (state, value) {
    state.previousRoute = value
  },
  SET_ADDRESSES (state, value) {
    state.addresses = value
  },
  SET_TIMEZONES (state, value) {
    state.timezones = value
  },
  SET_DEFAULT_TIMEZONE (state, value) {
    state.defaultTimezone = value
  },
  SET_PAGE_NAMES_BREADCRUMB (state, value) {
    state.pageNamesBreadcrumb = value
  },
  SET_REACT_DATA (state, data) {
    for (let param in data) {
      if (!state.reactData[param]) {
        Vue.set(state.reactData, param, {})
      }
      for (let id in data[param]) {
        Vue.set(state.reactData[param], Number(id), data[param][id])
      }
    }
  }
}

// actions
export const actions = {
  setPageNamesBreadcrumb ({ commit }, value) {
    commit('SET_PAGE_NAMES_BREADCRUMB', value)
  },
  addPreviousRoute ({ commit, dispatch }, fun) {
    commit('ADD_PREVIOUS_ROUTE', fun)
  },
  runPreviousRoute ({ state, commit }) {
    if (state.previousRoute.length !== 0) {
      for (let i in state.previousRoute) {
        state.previousRoute[i]()
      }
      commit('SET_PREVIOUS_ROUTE', [])
    }
  },
  async fetchTimezones ({ state, commit, dispatch }) {
    if (state.timezones.length === 0) {
      try {
        const { data } = await axios.get('timezones')
        commit('SET_TIMEZONES', data.list.data)
        commit('SET_DEFAULT_TIMEZONE', data.list.default)
      } catch (e) {
        console.log('error fetchTimezones', e)
      }
    }
  },
  async fetchReactData ({ commit, dispatch, state }, params) {
    try {
      const { data } = await axios.get('react-data', {
        params
      })
      commit('SET_REACT_DATA', data)
    } catch (e) {
      console.log('error fetchReactData', e)
    }
  },
  async fetchAddresses ({ commit }, params) {
    try {
      let { data } = await axios({
        method: 'POST',
        url: 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address',
        data: { 'query': params.query, 'count': params.count || 10 },
        responseType: 'json',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Token ${process.env.daDataApi}`
        }
      })
      commit('SET_ADDRESSES', data.suggestions)
    } catch (e) {
      console.log(e)
    }
  }
}
