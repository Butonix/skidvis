<template>
  <div>
    <div class="container mb-4">
      <search-input
        v-model="prods.urlQuery.search"
        autofocus="autofocus"
        form-class="mb-4"
      />
      <filter-list
        :fuse="prodsFS_holidays"
        :url-query="prods.urlQuery"
        :filter="prods.filters.holidays"
        btn-type="holidays"
        title="К празднику"
        name="holidays"
        @filter="prodsFilter('holidays', $event)"
        @clearfilter="prodsClearFilter('holidays')"
        @handleall="prodsHandleAll('holidays')"
      />
      <filter-list
        :fuse="prodsFS_auditories"
        :url-query="prods.urlQuery"
        :filter="prods.filters.auditories"
        btn-type="auditories"
        title="Кому"
        name="auditories"
        @filter="prodsFilter('auditories', $event)"
        @clearfilter="prodsClearFilter('auditories')"
        @handleall="prodsHandleAll('auditories')"
      />
      <filter-list
        :fuse="prodsFS_categories"
        :url-query="prods.urlQuery"
        :filter="prods.filters.categories"
        name="categories"
        @filter="prodsFilter('categories', $event)"
        @clearfilter="prodsClearFilter('categories')"
        @handleall="prodsHandleAll('categories')"
      />
      <div class="d-flex flex-column flex-xs-row justify-content-end align-items-center align-items-xs-start mt-3">
        <div class="btn btn-outline-primary btn-sm mr-xs-2 mb-3"
             @click="onOpenMap"
        >
          <span class="d-inline-block px-3">
            <map-icon />&nbsp;На&nbsp;карте
          </span>
        </div>
        <dropdown :options="orderingArray"
                  v-model="ordering"
                  class="mb-3"
                  btn-class="btn btn-sm btn-gray"
                  h-align="right"
                  placeholder="Сортировка"
        />
      </div>
    </div>
    <products
      :params="prodsParams"
    />
    <modal name="map">
      <div class="basic-modal map-modal">
        <div :class="{'active': loadingPoints}"
             class="loading-list"
        />
        <div class="close-modal" @click="$modal.pop()">
          <div class="close-modal__arrows">
            <chevron class="close-modal__arrows--right" />
            <chevron class="close-modal__arrows--left" />
          </div>
        </div>
        <no-ssr>
          <yandex-map
            v-if="getCoords"
            ref="map"
            :controls="[]"
            :coords="getCoords"
            :zoom="zoom"
            :scroll-zoom="true"
            @click="onClickMap"
            @map-was-initialized="onMapWasInitialized"
          >
            <ymap-marker
              v-for="(point, key) in getPoints"
              :layout="'islands#blueDiscountIcon'"

              :key="point.id"
              :properties="{
                iconCaption: point.name
              }"
              :balloon-template="balloonTemplatePoint(point, key)"
              :coords="[point.latitude, point.longitude]"
              :marker-id="point.id"
              :callbacks="{
                balloonopen: (e) => {
                  balloonopenMarker(e, point, key)
                },
                click: (e) => {
                  clickMarker(e, point, key)
                }
              }"
            />
          </yandex-map>
        </no-ssr>
      </div>
    </modal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import BuildList from '~/mixins/list'
import { getFavicon } from '~/utils'
import axios from 'axios'

const CancelToken = axios.CancelToken

const globalNamespace = 'prods'

const List = BuildList({
  axios,
  globalNamespace,
  apiUrl: 'products',
  pathResponse: 'list.data',
  pathTotal: 'list.total',
  allowedParams: ['city_id', 'ordering', 'orderingDir'],
  filters: {
    categories: {
      start: {
        url: 'categories',
        pathResponse: 'list.data',
        query: {
          products: 1,
          favorites: 1,
          perPage: 100000,
          orWhereIn: []
        }
      },
      fetch: {
        url: 'categories',
        pathResponse: 'list.data',
        query: {
          products: 1,
          perPage: 1000000,
          page: 1
        }
      }
    },
    holidays: {
      start: {
        url: 'holidays',
        pathResponse: 'list.data',
        query: {
          favorites: 1,
          perPage: 100000,
          orWhereIn: []
        }
      },
      fetch: {
        url: 'holidays',
        pathResponse: 'list.data',
        query: {
          perPage: 1000000,
          page: 1
        }
      }
    },
    auditories: {
      start: {
        url: 'auditories',
        pathResponse: 'list.data',
        query: {
          favorites: 1,
          perPage: 100000,
          orWhereIn: []
        }
      },
      fetch: {
        url: 'auditories',
        pathResponse: 'list.data',
        query: {
          perPage: 1000000,
          page: 1
        }
      }
    }
  },
  apiQuery: {
    is_active: 1
  },
  urlQuery: {
    ordering: 'created_at',
    orderingDir: 'desc',
    perPage: 12
  },
  buildWatchers ({ beforeTypes, getWatcher, gN }) {
    return {
      [`${gN}.urlQuery.ordering`]: function (v) {
        getWatcher({ type: beforeTypes.SEARCH }).call(this)
      },
      [`${gN}.urlQuery.orderingDir`]: function (v) {
        getWatcher({ type: beforeTypes.SEARCH }).call(this)
      },
      'ordering': function (v) {
        this[gN].urlQuery.ordering = v.ordering
        this[gN].urlQuery.orderingDir = v.orderingDir
      },
      [`${gN}.urlQuery.city_id`]: function (v) {
        if (v) {
          this.$store.dispatch('auth/setCity', v)
          getWatcher({ type: beforeTypes.SEARCH }).call(this)
        }
      },
      'city': function (v) {
        if (v && v.id) {
          this.$set(this[gN].urlQuery, 'city_id', v.id)
        }
      }
    }
  }
})

export default {
  components: {
    'FilterList': () => import('~/components/FilterList'),
    'MapIcon': () => import('~/components/Icons/MapIcon.vue'),
    'Chevron': () => import('~/components/Icons/Chevron'),
    'SearchInput': () => import('~/components/SearchInput'),
    'Dropdown': () => import('~/components/Dropdown'),
    'Products': () => import('~/components/Products')
  },
  middleware: [],
  mixins: [List.mixin],
  head () {
    return {
      title: this.$route.meta.title,
      bodyAttrs: {
        class: 'theme-default'
      },
      ...getFavicon()
    }
  },
  asyncData: async ({ params, error, app, query }) => {
    let city = app.store.getters['auth/city']

    if (typeof query.city_id !== 'undefined' && query.city_id !== city.id) {
      await app.store.dispatch('auth/setCity', query.city_id)
    }

    let data = await List.getStartData({
      query,
      defaultApiQuery: {

      },
      defaultUrlQuery: {
        city_id: city.id
      }
    })

    return data
  },
  data: () => ({
    markerIcon: {
      layout: 'default#imageWithContent',
      imageHref: '/img/map/icon2.svg',
      imageSize: [34, 47],
      imageOffset: [-17, -47],
      // content: '<img style="margin-left: -3px; margin-top: -3px; width: 38px; height: 38px;" src="https://skidvis.s3.eu-central-1.amazonaws.com/public/images/2019/08/14/5d54529e6160c.svg">',
      content: '<div style="border-radius: 50%; overflow: hidden; background: white; width: 32px; height: 32px;"><img style="width: 100%; height: 100%;" src="/placeholders/demo-logo-map.png"></div>',
      contentOffset: [1, 1],
      contentLayout: `<div>$[properties.iconContent]</div>`
    },

    loadingPoints: false,
    cancelRequestPoints: null,
    balloonopening: false,
    placemark: null,
    placemarkId: null,
    placemarkClear: true,
    map: null,
    zoom: 10,
    points: [],

    loadingList: false,
    orderingArray: [
      {
        id: 1,
        ordering: 'created_at',
        orderingDir: 'desc',
        name: 'Новые'
      },
      {
        id: 2,
        ordering: 'popularity',
        orderingDir: 'desc',
        name: 'По популярности'
      },
      {
        id: 3,
        ordering: 'reviews_count',
        orderingDir: 'desc',
        name: 'По отзывам'
      },
      {
        id: 4,
        ordering: 'name',
        orderingDir: 'asc',
        name: 'По названию'
      }
    ],
    ordering: {
      id: 1,
      ordering: 'created_at',
      orderingDir: 'desc',
      name: 'Новые'
    }
  }),
  computed: {
    ...mapGetters({
      wishlist: 'auth/wishlist',
      city: 'auth/city'
    }),
    getPoints () {
      return this.points
    },
    getCoords () {
      let res = null
      if (this.city && this.city.latitude && this.city.longitude) {
        res = [this.city.latitude, this.city.longitude]
      }
      return res
    }
  },
  methods: {
    async clickMarker (e, point, key) {
      // console.log(e, point, key)
    },
    async balloonopenMarker (e, point, key) {
      this.balloonopening = true
      setTimeout(() => {
        this.balloonopening = false
      }, 600)
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
    },
    async fetchPoints () {
      let bounds = this.map.getBounds()
      let vm = this
      if (vm.cancelRequestPoints) {
        vm.cancelRequestPoints()
      }
      this.loadingPoints = true
      this.placemarkClear = false
      try {
        let { data } = await axios.get('points/map', {
          params: {
            is_active: 1,
            latitudeMax: bounds[1][0],
            longitudeMax: bounds[1][1],
            latitudeMin: bounds[0][0],
            longitudeMin: bounds[0][1]
          },
          cancelToken: new CancelToken(function executor (c) {
            // An executor function receives a cancel function as a parameter
            vm.cancelRequestPoints = c
          })
        })
        this.points = data.list.data
        window.appPageProductsIndexVarPoints = this.points
        window.APPIVPS = window.appPageProductsIndexVarPoints
      } catch (e) {
        console.log('error', e)
      }

      this.loadingPoints = false
    },
    async onClickMap (e) {
      // this.coords = e.get('coords')
      // if (this.map) {
      //   console.log(this.map.getBounds())
      // }
      // console.log(this.$refs.map.getBounds())
    },
    async onMapWasInitialized (payload) {
      this.map = payload
      this.map.events.add('boundschange', (e) => {
        if (!this.balloonopening) {
          this.fetchPoints()
        }
      })
      await this.fetchPoints()
    },
    onOpenMap () {
      this.placemark = null
      this.$modal.push('map')
    }
  }
}
</script>

<style>
</style>
