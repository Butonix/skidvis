<template>
  <div>
    <div class="container mb-4">
      <search-input
        v-model="params.search"
        autofocus="autofocus"
        form-class="mb-4"
      />
      <div class="d-flex justify-content-between">
        <div class="text-muted small mb-2">
          К празднику
        </div>
        <div class=" mb-2">
          <a v-if="params.holidays.length" href="javascript:void(0)" class="mr-2 text-muted small cursor-pointer"
             @click="clearSelectedHolidays">
            Сбросить
          </a>
          <a href="javascript:void(0)" class="text-muted small cursor-pointer"
             @click="handleAllHolidays">
            Все
            <chevron style="transform-origin: center; transform: rotate(-90deg)" />
          </a>
        </div>
      </div>
      <categories-scroll
        :categories="getFavHolidaysSorted"
        :categories-active-ids="params.holidays"
        type="holidays"
        @clickitem="filter('holidays', $event)"
      />
      <div class="d-flex justify-content-between">
        <div class="text-muted small mb-2">
          Кому
        </div>
        <div class=" mb-2">
          <a v-if="params.auditories.length" href="javascript:void(0)" class="mr-2 text-muted small cursor-pointer"
             @click="clearSelectedAuditories">
            Сбросить
          </a>
          <a href="javascript:void(0)" class="text-muted small cursor-pointer"
             @click="handleAllAuditories">
            Все
            <chevron style="transform-origin: center; transform: rotate(-90deg)" />
          </a>
        </div>
      </div>
      <categories-scroll
        :categories="getFavAuditoriesSorted"
        :categories-active-ids="params.auditories"
        type="auditories"
        @clickitem="filter('auditories', $event)"
      />
      <div class="d-flex justify-content-between">
        <div class="text-muted small mb-2">
          Категории
        </div>
        <div class=" mb-2">
          <a v-if="params.categories.length" href="javascript:void(0)" class="mr-2 text-muted small cursor-pointer"
             @click="clearSelectedCategories">
            Сбросить
          </a>
          <a href="javascript:void(0)" class="text-muted small cursor-pointer"
             @click="handleAllCategories">
            Все
            <chevron style="transform-origin: center; transform: rotate(-90deg)" />
          </a>
        </div>
      </div>
      <categories-scroll
        :categories="getFavCategoriesSorted"
        :categories-active-ids="params.categories"
        @clickitem="filter('categories', $event)"
      />
      <div class="d-flex flex-column flex-xs-row justify-content-end align-items-center align-items-xs-start">
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
      :loading-list="loadingList"
      :items="items"
      :page-count="pageCount"
      :page="params.page"
      @setpage="params.page = $event"
    />
    <modal name="map">
      <div class="basic-modal map-modal">
        <div :class="{'active': loadingPoints}"
             class="loading-list"
        />
        <div class="close-modal" @click="$modal.pop()">
          <div class="close-modal__arrows">
            <chevron class="close-modal__arrows--left" />
            <chevron class="close-modal__arrows--right" />
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
    <modal name="save-categories">
      <div class="basic-modal categories-modal">
        <div class="position-relative">
          <div :class="{'active': loadingCategories}" class="preloader" />
          <div class="">
            Выбрано {{ params.categories.length }} из {{ getCategories.length }}
            <div class="">
              <div class="d-flex">
                <search-input
                  v-model="categoriesSearch"
                  form-class="mb-4 flex-grow-1"
                  autofocus="autofocus"
                />
                <div v-if="params.categories.length" class="pl-3">
                  <div class="btn btn-primary btn-sm"
                       @click="clearSelectedCategories">
                    Сбросить
                  </div>
                </div>
              </div>
              <categories>
                <category
                  v-for="(category, key) in categoriesSelected"
                  :active="true"
                  :key="'categories-selected-'+key"
                  :label="category.name"
                  :src-active="category.images.default.active || '/img/categories/entertainment/entertainment-default-active.svg'"
                  :src="category.images.default.normal || '/img/categories/entertainment/entertainment-default-normal.svg'"
                  @click="filter('categories', category)"
                />
                <category
                  v-for="(category, key) in getCategoriesSearchable"
                  v-if="!categoriesSelected[category.id]"
                  :key="'categories-'+key"
                  :label="category.name"
                  :src-active="category.images.default.active || '/img/categories/entertainment/entertainment-default-active.svg'"
                  :src="category.images.default.normal || '/img/categories/entertainment/entertainment-default-normal.svg'"
                  @click="filter('categories', category)"
                />
              </categories>
            </div>
          </div>
        </div>
        <div class="text-center mt-4 mt-xs-5">
          <button class="btn btn-outline-primary ml-sm-2 mb-3 mb-sm-0 btn-sm--sm"
                  @click="$modal.pop()"
          >
            Готово
          </button>
        </div>
      </div>
    </modal>
    <modal name="save-auditories">
      <div class="basic-modal categories-modal">
        <div class="position-relative">
          <div :class="{'active': loadingAuditories}" class="preloader"/>
          <div class="">
            Выбрано {{ params.auditories.length }} из {{ getAuditories.length }}
            <div class="">
              <div class="d-flex">
                <search-input
                  v-model="auditoriesSearch"
                  form-class="mb-4 flex-grow-1"
                  autofocus="autofocus"
                />
                <div v-if="params.auditories.length" class="pl-3">
                  <div class="btn btn-primary btn-sm"
                       @click="clearSelectedAuditories">
                    Сбросить
                  </div>
                </div>
              </div>
              <div class="d-flex justify-content-start align-items-start flex-wrap">
                <div v-for="(auditory, key) in auditoriesSelected"
                     :key="'auditories-selected-'+key"
                     class="btn btn-auditories active mx-1 mb-2 text-nowrap"
                     @click="filter('auditories', auditory)"
                     v-text="auditory.name"
                />
                <div v-for="(auditory, key) in getAuditoriesSearchable"
                     v-if="!auditoriesSelected[auditory.id]"
                     :key="'auditories-'+key"
                     class="btn btn-auditories mx-1 mb-2 text-nowrap"
                     @click="filter('auditories', auditory)"
                     v-text="auditory.name"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="text-center mt-4 mt-xs-5">
          <button class="btn btn-outline-primary ml-sm-2 mb-3 mb-sm-0 btn-sm--sm"
                  @click="$modal.pop()"
          >
            Готово
          </button>
        </div>
      </div>
    </modal>
    <modal name="save-holidays">
      <div class="basic-modal categories-modal">
        <div class="position-relative">
          <div :class="{'active': loadingHolidays}" class="preloader"/>
          <div class="">
            Выбрано {{ params.holidays.length }} из {{ getHolidays.length }}
            <div class="">
              <div class="d-flex">
                <search-input
                  v-model="holidaysSearch"
                  form-class="mb-4 flex-grow-1"
                  autofocus="autofocus"
                />
                <div v-if="params.holidays.length" class="pl-3">
                  <div class="btn btn-primary btn-sm"
                       @click="clearSelectedHolidays">
                    Сбросить
                  </div>
                </div>
              </div>
              <div class="d-flex justify-content-start align-items-start flex-wrap">
                <div v-for="(holiday, key) in holidaysSelected"
                     :key="'holidays-selected-'+key"
                     class="btn btn-holidays active mx-1 mb-2 text-nowrap"
                     @click="filter('holidays', holiday)"
                     v-text="holiday.name"
                />
                <div v-for="(holiday, key) in getHolidaysSearchable"
                     v-if="!holidaysSelected[holiday.id]"
                     :key="'holidays-'+key"
                     class="btn btn-holidays mx-1 mb-2 text-nowrap"
                     @click="filter('holidays', holiday)"
                     v-text="holiday.name"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="text-center mt-4 mt-xs-5">
          <button class="btn btn-outline-primary ml-sm-2 mb-3 mb-sm-0 btn-sm--sm"
                  @click="$modal.pop()"
          >
            Готово
          </button>
        </div>
      </div>
    </modal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Fuse from 'fuse.js'
import { getQueryData, watchList, queryFixArrayParams, getFavicon } from '~/utils'
import axios from 'axios'

const CancelToken = axios.CancelToken

let listWatchInstancePage = watchList(axios, 'indexApiUrl', 'page')
let listWatchInstanceSearch = watchList(axios, 'indexApiUrl', 'search')

export default {
  components: {
    'MapIcon': () => import('~/components/Icons/MapIcon.vue'),
    'Category': () => import('~/components/Category'),
    'Chevron': () => import('~/components/Icons/Chevron'),
    'SearchInput': () => import('~/components/SearchInput'),
    'CategoriesScroll': () => import('~/components/CategoriesScroll'),
    'Categories': () => import('~/components/Categories'),
    'Dropdown': () => import('~/components/Dropdown'),
    'Products': () => import('~/components/Products')
  },
  middleware: [],
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
    let indexApiUrl
    let collection = {}
    let favCategories = {}
    let categoriesSelected = {}
    let favAuditories = {}
    let auditoriesSelected = {}
    let favHolidays = {}
    let holidaysSelected = {}
    let city = app.store.getters['auth/city']

    query = queryFixArrayParams(query, ['categories', 'auditories', 'holidays'])

    if (query.categories && query.categories.length) {
      query.categories = query.categories.map(Number)
    }

    if (query.auditories && query.auditories.length) {
      query.auditories = query.auditories.map(Number)
    }

    if (query.holidays && query.holidays.length) {
      query.holidays = query.holidays.map(Number)
    }

    let params_ = getQueryData({
      query,
      defaultData: {
        categories: [],
        holidays: [],
        auditories: [],
        city_id: city.id,
        ordering: 'created_at',
        orderingDir: 'desc',
        is_active: 1,
        perPage: 12
      }
    })

    if (Number(params_.city_id) !== Number(city.id)) {
      await app.store.dispatch('auth/setCity', params_.city_id)
    }

    indexApiUrl = 'products'
    try {
      let { data } = await axios.get(indexApiUrl, {
        params: params_
      })
      collection = data
    } catch (e) {
      error({ statusCode: e.response.status })
    }

    try {
      let { data } = await axios.get('categories', {
        params: {
          products: 1,
          favorites: 1,
          perPage: 100000,
          orWhereIn: params_.categories
        }
      })
      favCategories = data
    } catch (e) {
      console.log(e)
    }

    try {
      let { data } = await axios.get('holidays', {
        params: {
          favorites: 1,
          perPage: 100000,
          orWhereIn: params_.holidays
        }
      })
      favHolidays = data
    } catch (e) {
      console.log(e)
    }

    try {
      let { data } = await axios.get('auditories', {
        params: {
          favorites: 1,
          perPage: 100000,
          orWhereIn: params_.auditories
        }
      })
      favAuditories = data
    } catch (e) {
      console.log(e)
    }

    try {
      for (let i in favCategories.list.data) {
        let item = favCategories.list.data[i]
        if (params_.categories.indexOf(item.id) !== -1) {
          categoriesSelected[item.id] = { ...item }
        }
      }
    } catch (e) {
      console.log(e)
    }

    try {
      for (let i in favHolidays.list.data) {
        let item = favHolidays.list.data[i]
        if (params_.holidays.indexOf(item.id) !== -1) {
          holidaysSelected[item.id] = { ...item }
        }
      }
    } catch (e) {
      console.log(e)
    }

    try {
      for (let i in favAuditories.list.data) {
        let item = favAuditories.list.data[i]
        if (params_.auditories.indexOf(item.id) !== -1) {
          auditoriesSelected[item.id] = { ...item }
        }
      }
    } catch (e) {
      console.log(e)
    }

    return {
      categoriesSelected,
      favCategories,
      auditoriesSelected,
      favAuditories,
      holidaysSelected,
      favHolidays,
      collection,
      params: params_,
      indexApiUrl
    }
  },
  data: () => ({
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
    },

    categories: {},
    fuseCategories: null,
    categoriesSearch: '',
    loadingCategories: true,
    categoriesTotal: 0,

    auditories: {},
    fuseAuditories: null,
    auditoriesSearch: '',
    loadingAuditories: true,
    auditoriesTotal: 0,

    holidays: {},
    fuseHolidays: null,
    holidaysSearch: '',
    loadingHolidays: true,
    holidaysTotal: 0
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
    },
    // Categories
    getCategories () {
      return (this.categories.list && this.categories.list.data) ? this.categories.list.data : []
    },
    getCategoriesSearchable () {
      return (this.fuseCategories && this.categoriesSearch.length > 0) ? this.fuseCategories.search(this.categoriesSearch) : this.getCategories
    },
    getFavCategories () {
      return (this.getCategories.length) ? this.getCategories
        : ((this.favCategories.list && this.favCategories.list.data) ? this.favCategories.list.data : [])
    },
    getFavCategoriesSorted () {
      let active = []
      let noActive = []
      if (this.params.categories && this.params.categories.length && this.getFavCategories.length) {
        for (let i in this.getFavCategories) {
          let cat = this.getFavCategories[i]
          if (this.params.categories.indexOf(cat.id) !== -1) {
            active.push(cat)
          } else {
            noActive.push(cat)
          }
        }
        return active.concat(noActive)
      } else {
        return this.getFavCategories
      }
    },
    // Auditories
    getAuditories () {
      return (this.auditories.list && this.auditories.list.data) ? this.auditories.list.data : []
    },
    getAuditoriesSearchable () {
      return (this.fuseAuditories && this.auditoriesSearch.length > 0) ? this.fuseAuditories.search(this.auditoriesSearch) : this.getAuditories
    },
    getFavAuditories () {
      return (this.getAuditories.length) ? this.getAuditories
        : ((this.favAuditories.list && this.favAuditories.list.data) ? this.favAuditories.list.data : [])
    },
    getFavAuditoriesSorted () {
      let active = []
      let noActive = []
      if (this.params.auditories && this.params.auditories.length && this.getFavAuditories.length) {
        for (let i in this.getFavAuditories) {
          let cat = this.getFavAuditories[i]
          if (this.params.auditories.indexOf(cat.id) !== -1) {
            active.push(cat)
          } else {
            noActive.push(cat)
          }
        }
        return active.concat(noActive)
      } else {
        return this.getFavAuditories
      }
    },
    // Holidays
    getHolidays () {
      return (this.holidays.list && this.holidays.list.data) ? this.holidays.list.data : []
    },
    getHolidaysSearchable () {
      return (this.fuseHolidays && this.holidaysSearch.length > 0) ? this.fuseHolidays.search(this.holidaysSearch) : this.getHolidays
    },
    getFavHolidays () {
      return (this.getHolidays.length) ? this.getHolidays
        : ((this.favHolidays.list && this.favHolidays.list.data) ? this.favHolidays.list.data : [])
    },
    getFavHolidaysSorted () {
      let active = []
      let noActive = []
      if (this.params.holidays && this.params.holidays.length && this.getFavHolidays.length) {
        for (let i in this.getFavHolidays) {
          let cat = this.getFavHolidays[i]
          if (this.params.holidays.indexOf(cat.id) !== -1) {
            active.push(cat)
          } else {
            noActive.push(cat)
          }
        }
        return active.concat(noActive)
      } else {
        return this.getFavHolidays
      }
    },
    items () {
      return (this.collection.list && this.collection.list.data) ? this.collection.list.data : []
    },
    pageCount () {
      return (this.collection.list && this.collection.list.total) ? Math.ceil(this.collection.list.total / this.params.perPage) : 0
    }
  },
  watch: {
    'params.search': listWatchInstanceSearch,
    'params.categories': listWatchInstanceSearch,
    'params.auditories': listWatchInstanceSearch,
    'params.holidays': listWatchInstanceSearch,
    'params.ordering': listWatchInstanceSearch,
    'params.page': listWatchInstancePage,
    'city': function (v) {
      if (v.id) {
        this.params.city_id = v.id
        listWatchInstanceSearch.call(this)
      }
    },
    'ordering': function (v) {
      this.params.ordering = v.ordering
      this.params.orderingDir = v.orderingDir
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
      if (product.value) {
        let sale = product.currency_id === 1 ? product.value + '%' : product.value + '₽'

        saleHtml = `<div id="mp-sale-${id}" class="map-point__sale">${sale}</div>`
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
      // this.map.events.add('boundschange', this.fetchPoints)
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
    },
    clearSelectedCategories () {
      this.params.categories = []
      this.categoriesSelected = {}
    },
    clearSelectedAuditories () {
      this.params.auditories = []
      this.auditoriesSelected = {}
    },
    clearSelectedHolidays () {
      this.params.holidays = []
      this.holidaysSelected = {}
    },
    async handleAllCategories () {
      this.$modal.push('save-categories')
      if (!this.getCategories.length) {
        this.loadingCategories = true
        try {
          let { data } = await axios.get('categories', {
            params: {
              products: 1,
              perPage: 1000000,
              page: 1
            }
          })
          this.categories = data
          this.fuseCategories = new Fuse(this.getCategories, {
            shouldSort: true,
            threshold: 0.6,
            location: 0,
            distance: 100,
            maxPatternLength: 32,
            minMatchCharLength: 1,
            keys: [
              'name'
            ]
          })
        } catch (e) {
          console.log(e)
          await this.$callToast({
            type: 'error',
            text: 'Загрузить все категории не удалось'
          })
          this.$modal.pop()
        }
        this.loadingCategories = false
      }
    },
    async handleAllAuditories () {
      this.$modal.push('save-auditories')
      if (!this.getAuditories.length) {
        this.loadingAuditories = true
        try {
          let { data } = await axios.get('auditories', {
            params: {
              perPage: 1000000,
              page: 1
            }
          })
          this.auditories = data
          this.fuseAuditories = new Fuse(this.getAuditories, {
            shouldSort: true,
            threshold: 0.6,
            location: 0,
            distance: 100,
            maxPatternLength: 32,
            minMatchCharLength: 1,
            keys: [
              'name'
            ]
          })
        } catch (e) {
          console.log(e)
          await this.$callToast({
            type: 'error',
            text: 'Загрузить все аудитории не удалось'
          })
          this.$modal.pop()
        }
        this.loadingAuditories = false
      }
    },
    async handleAllHolidays () {
      this.$modal.push('save-holidays')
      if (!this.getHolidays.length) {
        this.loadingHolidays = true
        try {
          let { data } = await axios.get('holidays', {
            params: {
              perPage: 1000000,
              page: 1
            }
          })
          this.holidays = data
          this.fuseHolidays = new Fuse(this.getHolidays, {
            shouldSort: true,
            threshold: 0.6,
            location: 0,
            distance: 100,
            maxPatternLength: 32,
            minMatchCharLength: 1,
            keys: [
              'name'
            ]
          })
        } catch (e) {
          console.log(e)
          await this.$callToast({
            type: 'error',
            text: 'Загрузить все праздники не удалось'
          })
          this.$modal.pop()
        }
        this.loadingHolidays = false
      }
    },
    filter (type, item) {
      console.log(type)
      switch (type) {
        case 'categories':
          console.log('categories')
          let categoriesId = Number(item.id)
          let categoriesIndex = this.params.categories.indexOf(categoriesId)
          if (categoriesIndex === -1) {
            this.params.categories.push(categoriesId)
            this.categoriesSelected[categoriesId] = { ...item }
          } else {
            this.$delete(this.params.categories, categoriesIndex)
            this.$delete(this.categoriesSelected, categoriesId)
          }
          break
        case 'auditories':
          console.log('auditories')
          let auditoriesId = Number(item.id)
          let auditoriesIndex = this.params.auditories.indexOf(auditoriesId)
          if (auditoriesIndex === -1) {
            this.params.auditories.push(auditoriesId)
            this.auditoriesSelected[auditoriesId] = { ...item }
          } else {
            this.$delete(this.params.auditories, auditoriesIndex)
            this.$delete(this.auditoriesSelected, auditoriesId)
          }
          break
        case 'holidays':
          console.log('holidays')
          let holidaysId = Number(item.id)
          let holidaysIndex = this.params.holidays.indexOf(holidaysId)

          if (holidaysIndex === -1) {
            this.params.holidays.push(holidaysId)
            this.holidaysSelected[holidaysId] = { ...item }
          } else {
            this.$delete(this.params.holidays, holidaysIndex)
            this.$delete(this.holidaysSelected, holidaysId)
          }
          break
      }
    }
  }
}
</script>

<style>
</style>
