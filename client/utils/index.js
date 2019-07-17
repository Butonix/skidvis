
/**
 * Get cookie from request.
 *
 * @param  {Object} req
 * @param  {String} key
 * @return {String|undefined}
 */
export function cookieFromRequest (req, key) {
  if (!req.headers.cookie) {
    return
  }

  const cookie = req.headers.cookie.split(';').find(
    c => c.trim().startsWith(`${key}=`)
  )

  if (cookie) {
    return cookie.split('=')[1]
  }
}

/**
 * https://router.vuejs.org/en/advanced/scroll-behavior.html
 */
export function scrollBehavior (to, from, savedPosition) {
  if (savedPosition) {
    return savedPosition
  }

  let position = {}

  if (to.matched.length < 2) {
    position = { x: 0, y: 0 }
  } else if (to.matched.some(r => r.components.default.options.scrollToTop)) {
    position = { x: 0, y: 0 }
  } if (to.hash) {
    position = { selector: to.hash }
  }

  return position
}

export function getQueryData ({ query, defaultData }) {
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

export function watchList (axios, indexApiUrl, type) {
  const CancelToken = axios.CancelToken
  let cancelRequest
  return function () {
    if (cancelRequest) {
      cancelRequest()
    }
    switch (type) {
      case 'search':
        this.params.page = 1
        break
    }
    let params = getQueryData({ query: this.params })
    this.$router.push({ name: this.$route.name,
      query: params
    })
    axios.get(indexApiUrl, {
      params,
      cancelToken: new CancelToken(function executor (c) {
        // An executor function receives a cancel function as a parameter
        cancelRequest = c
      })
    }).then(({ data }) => {
      switch (type) {
        case 'delete':
          if (data.data.length === 0 && this.params.page > 1) {
            this.params.page++
            return
          }
          if (data.data.length === 0 && this.params.search !== '') {
            this.params.search = ''
            return
          }
          break
        case 'page':
          if (data.data.length === 0 && this.params.search !== '') {
            this.params.search = ''
            return
          }
          break
      }
      this.$set(this, 'list', data)
    }).catch((e) => {
    })
  }
}
