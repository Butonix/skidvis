// state
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
    defaultTimezone: 2,
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
    interval
  }
}

// getters
export const getters = {
  getPreviousRoute: state => state.previousRoute,
  getDaysOfTheWeek: state => state.daysOfTheWeek,
  getOperationMode: state => state.operationMode,
  getTimezones: state => state.timezones,
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
  SET_TIMEZONES (state, value) {
    state.timezones = value
  },
  SET_DEFAULT_TIMEZONE (state, value) {
    state.defaultTimezone = value
  }
}

// actions
export const actions = {
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
  async fetchTimezones ({ commit, dispatch }) {
    try {
      const { data } = await axios.get('management/timezones')
      commit('SET_TIMEZONES', data.data)
      commit('SET_DEFAULT_TIMEZONE', data.default)
    } catch (e) {
      console.log('error fetchTimezones', e)
    }
  }
}
