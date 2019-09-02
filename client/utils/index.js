
export function isObject (v) {
  return v && typeof v === 'object' && v.constructor === Object
}
export function isString (v) {
  return typeof v === 'string' || v instanceof String
}
export function parseNum (n) {
  let pF = parseFloat(n)
  return (pF === n >>> 0) ? pF : n
}
export function parseReqObjs (v) {
  if (isObject(v) || Array.isArray(v)) {
    for (let i in v) {
      v[i] = parseReqObjs(v[i])
    }
    return v
  }
  if (isString(v)) {
    return parseNum(v)
  }
  return v
}

/**
 * Get cookie from request.
 *
 * @param  {Object} req
 * @param  {String} key
 * @return {String|undefined}
 */

export function cookieFromRequest (req, key, json) {
  if (!req.headers.cookie) {
    return
  }

  const cookie = req.headers.cookie.split(';').find(
    c => c.trim().startsWith(`${key}=`)
  )

  if (cookie) {
    let value = cookie.split('=')[1]
    return (json) ? JSON.parse(decodeURIComponent(value)) : value
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

export function goTo (title, url) {
  if (typeof history.pushState !== 'undefined') {
    history.pushState(null, title, url)
  } else {
    window.location.assign(url)
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

export function getWindowParams () {
  let w = window
  let d = document
  let e = d.documentElement
  let g = d.getElementsByTagName('body')[0]
  let x = w.innerWidth || e.clientWidth || g.clientWidth
  let y = w.innerHeight || e.clientHeight || g.clientHeight
  return { x, y }
}

export function fetchAddresses (axios) {
  const CancelToken = axios.CancelToken
  let cancelRequest
  return async function (params) {
    if (cancelRequest) {
      cancelRequest()
    }
    try {
      let { data } = await axios({
        method: 'POST',
        url: 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address',
        data: params,
        responseType: 'json',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Token ${process.env.daDataApi}`
        },
        cancelToken: new CancelToken(function executor (c) {
          // An executor function receives a cancel function as a parameter
          cancelRequest = c
        })
      })
      return data.suggestions
    } catch (e) {
      console.log(e)
      return []
    }
  }
}

export function mapPointSlide ({ inc = 1, id, count, key }) {
  let pageE = document.getElementById('mp-slide-' + id)
  let page = 1
  if (pageE) {
    page = Number(pageE.innerText)
    if (Number.isNaN(page)) {
      page = 1
    }
  }

  page += inc
  if (page < 1 || page > count) {
    return
  }

  try {
    let saleE = document.getElementById('mp-sale-' + id)
    let priceE = document.getElementById('mp-price-' + id)
    let boxE = document.getElementById('mp-products-box-' + id)
    let slideE = document.getElementById('mp-slide-' + id)
    let leftE = document.getElementById('mp-left-' + id)
    let rightE = document.getElementById('mp-right-' + id)

    boxE.style.setProperty('left', (-1 * 160 * (page - 1)) + 'px')

    if (page === 1) {
      leftE.classList.remove('active')
      rightE.classList.add('active')
    } else if (page === count) {
      leftE.classList.add('active')
      rightE.classList.remove('active')
    } else {
      leftE.classList.add('active')
      rightE.classList.add('active')
    }

    slideE.innerHTML = page

    let point = window.APPIVPS[key]

    let product = point.products[page - 1]
    if (product.value) {
      saleE.innerHTML = product.currency_id === 1 ? product.value + '%' : product.value + '₽'
    }

    if (product.origin_price) {
      let price = (product.origin_price).toLocaleString('ru') + '&nbsp;₽'
      price = price.replaceAll(' ', '&nbsp;')
      priceE.innerHTML = price
    }
  } catch (e) {
  }
}

export function getFavicon (type) {
  switch (type) {
    case 'blog':
      return {
        meta: [
          { name: 'msapplication-TileColor', content: '#ffffff' },
          { name: 'msapplication-config', content: '/favicon/blog/browserconfig.xml' },
          { name: 'theme-color', content: '#ffffff' }
        ],
        link: [
          { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicon/blog/apple-touch-icon.png' },
          { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon/blog/favicon-32x32.png' },
          { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon/blog/favicon-16x16.png' },
          { rel: 'manifest', href: '/favicon/blog/site.webmanifest' },
          { rel: 'mask-icon', href: '/favicon/blog/safari-pinned-tab.svg', color: '#00c2ff' },
          { rel: 'shortcut icon', href: '/favicon/blog/favicon.ico' }
        ]
      }
    case 'business':
      return {
        meta: [
          { name: 'msapplication-TileColor', content: '#ffffff' },
          { name: 'msapplication-config', content: '/favicon/business/browserconfig.xml' },
          { name: 'theme-color', content: '#ffffff' }
        ],
        link: [
          { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicon/business/apple-touch-icon.png' },
          { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon/business/favicon-32x32.png' },
          { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon/business/favicon-16x16.png' },
          { rel: 'manifest', href: '/favicon/business/site.webmanifest' },
          { rel: 'mask-icon', href: '/favicon/business/safari-pinned-tab.svg', color: '#00c2ff' },
          { rel: 'shortcut icon', href: '/favicon/business/favicon.ico' }
        ]
      }
    default:
      return {
        meta: [
          { name: 'msapplication-TileColor', content: '#ffffff' },
          { name: 'msapplication-config', content: '/favicon/default/browserconfig.xml' },
          { name: 'theme-color', content: '#ffffff' }
        ],
        link: [
          { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicon/default/apple-touch-icon.png' },
          { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon/default/favicon-32x32.png' },
          { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon/default/favicon-16x16.png' },
          { rel: 'manifest', href: '/favicon/default/site.webmanifest' },
          { rel: 'mask-icon', href: '/favicon/default/safari-pinned-tab.svg', color: '#00c2ff' },
          { rel: 'shortcut icon', href: '/favicon/default/favicon.ico' }
        ]
      }
  }
}
