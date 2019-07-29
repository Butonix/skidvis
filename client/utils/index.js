
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

export function watchList (axios, keyApiUrl, type) {
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
    if (!this[keyApiUrl]) {
      this.$route.back()
      return
    }
    axios.get(this[keyApiUrl], {
      params,
      cancelToken: new CancelToken(function executor (c) {
        // An executor function receives a cancel function as a parameter
        cancelRequest = c
      })
    }).then(({ data }) => {
      switch (type) {
        case 'delete':
          if (data.list.data.length === 0 && this.params.page > 1) {
            this.params.page++
            return
          }
          if (data.list.data.length === 0 && this.params.search !== '') {
            this.params.search = ''
            return
          }
          break
        case 'page':
          if (data.list.data.length === 0 && this.params.search !== '') {
            this.params.search = ''
            return
          }
          break
      }
      this.$set(this, 'collection', data)
    }).catch((e) => {
    })
  }
}

export function $callToast (data, toast) {
  let typeClass = 'toast-alert toast-alert--' + data.type
  let message = ''
  if (data.title) {
    message += `<div class="toast-alert-title">${data.title}</div>`
  }
  if (data.text) {
    message += `<div class="toast-alert-text">${data.text}</div>`
  }
  const setup = {
    mode: 'queue',
    transition: 'slide-down',
    horizontalPosition: 'center',
    className: typeClass,
    duration: 2000,
    ...data
  }

  return (toast) ? toast(message, setup) : this.$toast(message, setup)
}

/**
 * @param  {Object} options
 * @return {Window}
 */
export function openWindow (url, title, options = {}) {
  if (typeof url === 'object') {
    options = url
    url = ''
  }

  options = { url, title, width: 600, height: 720, ...options }

  const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screen.left
  const dualScreenTop = window.screenTop !== undefined ? window.screenTop : window.screen.top
  const width = window.innerWidth || document.documentElement.clientWidth || window.screen.width
  const height = window.innerHeight || document.documentElement.clientHeight || window.screen.height

  options.left = ((width / 2) - (options.width / 2)) + dualScreenLeft
  options.top = ((height / 2) - (options.height / 2)) + dualScreenTop

  const optionsStr = Object.keys(options).reduce((acc, key) => {
    acc.push(`${key}=${options[key]}`)
    return acc
  }, []).join(',')

  const newWindow = window.open(url, title, optionsStr)

  if (window.focus) {
    newWindow.focus()
  }

  return newWindow
}
