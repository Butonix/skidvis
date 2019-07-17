import axios from 'axios'

// state
export const state = () => ({
})

// getters
export const getters = {
}

// mutations
export const mutations = {
}

// actions
export const actions = {
  getQueryData (context, { query, defaultData }){
    let res = {
      page: 1,
      perPage: 11,
      search: '',
      orderingDir: 'desc',
      ordering: 'name',
      ...defaultData
    }
    if (query.page) {
      res.page = Number(query.page)
    }
    if (query.perPage) {
      res.perPage = Number(query.perPage)
    }
    if (query.search) {
      res.search = query.search
    }
    if (query.ordering) {
      res.ordering = query.ordering
    }
    if (query.orderingDir) {
      res.orderingDir = query.orderingDir
    }
    return res
  }
}



