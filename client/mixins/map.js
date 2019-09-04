export default {
  data: () => ({
    markerIcon: {
      layout: 'default#imageWithContent',
      imageHref: '/img/map/icon2.svg',
      imageSize: [34, 47],
      imageOffset: [-17, -47],
      content: '<img style="margin-left: -3px; margin-top: -3px; width: 38px; height: 38px;" src="/img/map/kegl.svg">',
      // content: '<div style="border-radius: 50%; overflow: hidden; background: white; width: 32px; height: 32px;"><img style="width: 100%; height: 100%;" src="/placeholders/demo-logo-map.png"></div>',
      contentOffset: [1, 1],
      contentLayout: `<div>$[properties.iconContent]</div>`
    }
  }),
  methods: {
    getMarkerIcon (point) {
      if (point.img) {
        if (point.type_point_map === 1) {
          return { ...this.markerIcon,
            content: `<img style="margin-left: -3px; margin-top: -3px; width: 38px; height: 38px;" src="${point.img}">`
          }
        } else {
          return {
            ...this.markerIcon,
            content: `<div style="border-radius: 50%; overflow: hidden; background: white; width: 32px; height: 32px;"><img style="width: 100%; height: 100%;" src="${point.img}"></div>`
          }
        }
      }
      return this.markerIcon
    },
    balloonTemplatePoint (point, key) {
      if (!point.products || point.products.length === 0) {
        return '<div class="map-point">Акций не найдено</div>'
      }

      let id = Math.ceil(1e8 * Math.random())
      let res = ''
      for (let i in point.products) {
        let product = point.products[i]
        let logo = ''
        if (product.organization_logo) {
          logo = `<div class="map-point__logo__wrapper" style="background-color: ${product.organization_color || 'white'};">
          <img src="${product.organization_logo}">
        </div>`
        }
        res += `<div class="map-point__product">
  <div class="map-point__logo">
    ${logo}
  </div>
  <a href="/products/${product.id}" target="_blank" class="map-point__name">${product.name}</a>
  </div>`
      }

      let product = point.products[0]
      let saleHtml = ''
      if (product.currency_id === 3) {
        saleHtml = `<div id="mp-sale-${id}" class="map-point__sale map-point__sale--present"><img class="w-100 h-auto" src="/img/products/sale-present-card.svg"></div>`
      } else {
        if (product.value) {
          let sale = product.currency_id === 1 ? product.value + '%' : product.value + '₽'

          saleHtml = `<div id="mp-sale-${id}" class="map-point__sale">${sale}</div>`
        }
      }

      let priceHtml = ''
      if (product.origin_price) {
        let price = (product.origin_price).toLocaleString('ru') + '&nbsp;₽'
        price = price.replaceAll(' ', '&nbsp;')
        priceHtml = `<div id="mp-price-${id}" class="map-point__price">${price}</div>`
      }

      let count = point.products.length

      let arrowsHtml = ''
      let countHtml = ''

      if (count > 1) {
        arrowsHtml = `<div id="mp-left-${id}" class="map-point__left" onclick="AV01UMPS({ inc: -1, id: ${id}, count: ${count}, key: ${key} })"></div>
<div id="mp-right-${id}" class="map-point__right active" onclick="AV01UMPS({ inc: 1, id: ${id}, count: ${count}, key: ${key} })"></div>`
        countHtml = `<span id="mp-slide-${id}">1</span>/${count}&#160;акций`
      }

      return `<div class="map-point__wrapper"><div class="map-point">${saleHtml}${priceHtml}${arrowsHtml}
<div id="mp-products-${id}" class="map-point__products"><div id="mp-products-box-${id}" class="map-point__products-box">${res}</div></div>
<div class="map-point__products-count">${countHtml}</div>
</div></div>`
    }
  }
}
