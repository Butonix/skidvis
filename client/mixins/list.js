import { cloneDeep } from 'lodash'

export default function constructor ({
  axios,
  globalNamespace, apiUrl, pathResponse = null, pathTotal = null, apiQuery = {}, urlQuery = {},
  allowedParams = [], buildWatchers = null
}) {
  let gN = globalNamespace
  if (!gN || !apiUrl) {
    throw new Error()
  }

  let actionTypes = {
    PAGINATE: 'PAGINATE',
    LOADMORE: 'LOADMORE'
  }
  let beforeTypes = {
    SEARCH: 'SEARCH'
  }
  let afterTypes = {
    DELETE: 'DELETE'
  }
  const CancelToken = axios.CancelToken
  let cancelRequest

  function getFromPath (data, path) {
    if (!path) {
      return data
    }
    let res = -1
    try {
      let th = path.split('.')
      res = cloneDeep(data)
      for (let i in th) {
        let item = th[i]
        res = res[item]
      }
    } catch (e) {
      res = -1
    }
    return res
  }

  function getWatcher ({ type = '' }) {
    return function () {
      if (cancelRequest) {
        cancelRequest()
      }
      switch (type) {
        case beforeTypes.SEARCH:
          this[gN].urlQuery.page = 1
          break
      }
      this.$goToQuery(this[gN].urlQuery)

      this[gN].loadingList = true
      this[gN].loadedList = false
      axios.get(this[gN].apiUrl, {
        params: {
          ...this[gN].apiQuery,
          ...this[gN].urlQuery
        },
        cancelToken: new CancelToken(function executor (c) {
          // An executor function receives a cancel function as a parameter
          cancelRequest = c
        })
      }).then(({ data }) => {
        let error = false
        let collection = getFromPath(data, this[gN].pathResponse)
        let total = getFromPath(data, this[gN].pathTotal)

        if (total === -1) {
          console.error('Error #LIST_1')
          error = true
        }
        if (typeof total === 'undefined') {
          console.error('Error #LIST_2')
          error = true
        }
        if (collection === -1) {
          console.error('Error #LIST_3')
          error = true
        }
        if (typeof collection === 'undefined') {
          console.error('Error #LIST_4')
          error = true
        }
        if (!error) {
          switch (this[gN].actionType) {
            case actionTypes.LOADMORE:
              this.$set(this[gN], 'collection', [...this[gN].collection, ...collection])
              this.$set(this[gN], 'actionType', actionTypes.PAGINATE)
              break
            case actionTypes.PAGINATE:
              this.$set(this[gN], 'collection', collection)
              break
          }
          switch (type) {
            case afterTypes.DELETE:
              if (this[gN].collection.length === 0 && this[gN].urlQuery.page > 1) {
                this.$set(this[gN].urlQuery, 'page', this[gN].urlQuery.page - 1)
                return
              }
              break
          }

          this[gN].total = total
        }
        this[gN].loadingList = false
        this[gN].loadedList = true
      }).catch((e) => {
        if (!axios.isCancel(e)) {
          console.log(e)
        }
      })
    }
  }

  function getUrlQuery (query = {}) {
    let r = {
      page: 1,
      perPage: 20,
      search: ''
    }
    let allowedParams_ = [ 'page', 'perPage', 'search', ...allowedParams ]
    if (query) {
      for (let i in allowedParams_) {
        let name = allowedParams_[i]
        if (typeof query[name] !== 'undefined') {
          r[name] = query[name]
        }
      }
    }
    return r
  }

  function setUrlQuery (query = {}) {
    this.$set(this[gN], 'urlQuery', getUrlQuery(query))
  }

  function watchers () {
    let watch = {
      '$route.query': function () {
        setUrlQuery.call(this, this.$route.query)
      },
      [`${gN}.urlQuery.search`]: getWatcher({ type: beforeTypes.SEARCH }),
      [`${gN}.urlQuery.page`]: getWatcher({})
    }
    if (buildWatchers) {
      watch = {
        ...watch, ...buildWatchers.call(this, { beforeTypes, getWatcher, globalNamespace })
      }
    }
    return watch
  }
  const data = {
    [gN]: {
      apiUrl,
      apiQuery,
      pathResponse,
      pathTotal,
      urlQuery: getUrlQuery(urlQuery),
      loadingList: false,
      loadedList: true,
      collection: [],
      total: 0,
      actionType: actionTypes.PAGINATE
    }
  }
  return {
    getWatcher,
    async getStartData ({ query = {}, error, defaultApiQuery = {}, defaultUrlQuery = {} }) {
      let res = { ...data }
      res[gN].apiQuery = {
        ...apiQuery,
        ...defaultApiQuery
      }
      res[gN].urlQuery = getUrlQuery({
        ...urlQuery, ...defaultUrlQuery, ...query
      })
      try {
        let { data } = await axios.get(apiUrl, {
          params: {
            ...res[gN].apiQuery,
            ...res[gN].urlQuery
          },
          cancelToken: new CancelToken(function executor (c) {
            // An executor function receives a cancel function as a parameter
            cancelRequest = c
          })
        })
        let error = false
        let collection = getFromPath(data, pathResponse)
        let total = getFromPath(data, pathTotal)

        if (total === -1) {
          console.error('Error #LIST_START_1')
          error = true
        }
        if (typeof total === 'undefined') {
          console.error('Error #LIST_START_2')
          error = true
        }
        if (!error) {
          res[gN].total = total
          res[gN].collection = collection
        }
        if (collection === -1) {
          console.error('Error #LIST_START_3')
          error = true
        }
        if (typeof collection === 'undefined') {
          console.error('Error #LIST_START_4')
          error = true
        }
        if (!error) {
          res[gN].collection = collection
        }
      } catch (e) {
        if (!axios.isCancel(e)) {
          error({ statusCode: e.response.status })
        }
      }
      return res
    },
    actionTypes,
    beforeTypes,
    afterTypes,
    mixin: {
      watch: watchers.call(this),
      data () {
        return data
      },
      computed: {
        [gN + 'ShowPaginate'] () {
          return (this[gN + 'Total'] && this[gN + 'Total'] > 1)
        },
        [gN + 'ShowLoadMore'] () {
          return (this[gN + 'ShowPaginate'] && (!this[gN + 'IsLoaded'] || this[gN + 'Page'] < this[gN + 'Pages']))
        },
        [gN + 'IsLoading'] () {
          return this[gN].loadingList
        },
        [gN + 'IsLoaded'] () {
          return this[gN].loadedList
        },
        [gN + 'Page'] () {
          return this[gN].urlQuery.page
        },
        [gN + 'Pages'] () {
          return Math.ceil(this[gN].total / this[gN].urlQuery.perPage)
        },
        [gN + 'Total'] () {
          return this[gN].total
        },
        [gN + 'Items'] () {
          return this[gN].collection
        },
        [gN + 'Params'] () {
          return {
            showPaginate: this[gN + 'ShowPaginate'],
            showLoadMore: this[gN + 'ShowLoadMore'],
            isLoading: this[gN + 'IsLoading'],
            isLoaded: this[gN + 'IsLoaded'],
            page: this[gN + 'Page'],
            pages: this[gN + 'Pages'],
            total: this[gN + 'Total'],
            items: this[gN + 'Items'],
            loadMore: this[gN + 'LoadMore'],
            goPage: this[gN + 'GoPage']
          }
        }
      },
      methods: {
        async [gN + 'LoadMore'] () {
          this[gN].actionType = actionTypes.LOADMORE
          this.$set(this[gN].urlQuery, 'page', this[gN].urlQuery.page + 1)
        },
        async [gN + 'GoPage'] (page) {
          this[gN].urlQuery.page = Number(page)
        }
      }
    }
  }
}
