<template>
  <div>
    <div class="container mb-4">
      <search-input
        v-model="prods.urlQuery.search"
        autofocus="autofocus"
        form-class="mb-4"
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
      <buttons-scroll :hkey="currenciesValues.length + '-' + birthday[0] + '-' + birthday[1]">
        <div :class="{'active':currenciesValues.length}"
             class="btn mx-1 mb-2 text-nowrap btn-auditories"
             @click="$modal.push('ModalPromotions')">
          Тип акции<template v-for="(currencyId, key) in currenciesValues">
            <template v-if="key === 0">: {{ currencies[Number(currencyId)] }}</template>
            <template v-else>, {{ currencies[Number(currencyId)] }}</template>
          </template>
        </div>
        <div :class="{'active':birthday[0] || typeBirthday}"
             class="btn mx-1 mb-2 text-nowrap btn-auditories"
             @click="$modal.push('modalTimeOfTheAction')">
          Время действия акции
        </div>
      </buttons-scroll>
      <div class="d-flex flex-column flex-xs-row flex-wrap justify-content-end align-items-center align-items-xs-start mt-3">
        <div v-if="isFiltered" class="btn btn-danger btn-sm mb-3 mr-xs-2" @click="clearAll">Сбросить все</div>
        <div class="btn btn-outline-primary btn-sm mb-3 mr-xs-2"
             @click="onOpenMap"
        >
          <span class="d-inline-block px-3">
            <map-icon />&nbsp;На&nbsp;карте
          </span>
        </div>
        <dropdown :options="orderingArray"
                  v-model="ordering"
                  class="mb-3 mr-xs-2"
                  btn-class="btn btn-sm btn-gray"
                  h-align="right"
                  placeholder="Сортировка"
        />
      </div>
    </div>
    <products
      :params="prodsParams"
    />

    <div v-if="visitedProducts.length" class="container">
      <visited-slider :products="visitedProducts" class="mt-5" />
    </div>
    <client-only>
      <modal name="modalTimeOfTheAction">
        <div class="basic-modal categories-modal" style="max-width: 800px">
          <div class="h5 mb-4">Выберите время действия акции</div>
          <div class="mb-2 px-1">
            <buttons-scroll :hkey="'birthday'">
              <div class="btn mx-1 mb-2 text-nowrap btn-auditories" @click="setTypeBirthday(1)"
                   :class="{'active':typeBirthday === 1}">
                Только в День Рождения
              </div>
              <div class="btn mx-1 mb-2 text-nowrap btn-auditories" @click="setTypeBirthday(2)"
                   :class="{'active':typeBirthday === 2}">
                Акция действует календарный месяц Дня Рождения
              </div>
            </buttons-scroll>
          </div>
          <div class="mb-4 px-1">
            <div class="small mb-1">Количество дней до Дня Рождения</div>
            <buttons-scroll :hkey="'birthday'">
              <div v-for="days in prods.filters.birthday.favorites[0]" :key="days"
                   :class="{'active':birthday[0] === days}"
                   class="btn btn-auditories btn-sm m-1 text-nowrap"
                   @click="setBeforeBirthday(days)">{{ days }} {{ pluralize(days, pluralizeDays) }}</div>
            </buttons-scroll>
          </div>
          <div class="mb-3 px-1">
            <div class="small mb-1">Количество дней после Дня Рождения</div>
            <buttons-scroll :hkey="'birthday'">
              <div v-for="days in prods.filters.birthday.favorites[1]" :key="days"
                   :class="{'active':birthday[1] === days}"
                   class="btn btn-auditories btn-sm m-1 text-nowrap"
                   @click="setAfterBirthday(days)">{{ days }} {{ pluralize(days, pluralizeDays) }}</div>
            </buttons-scroll>
          </div>
          <div class="text-center mt-4 mt-xs-5">
            <div class="btn btn-gray btn-sm--sm" @click="clearTimeOfTheAction">
              Сбросить
            </div>
            <div class="btn btn-primary btn-sm--sm ml-2" @click="$modal.pop()">
              Готово
            </div>
          </div>
        </div>
      </modal>
      <modal name="ModalPromotions">
        <div class="basic-modal categories-modal">
          <div class="h5 mb-3">Выберите тип акции</div>
          <div class="d-flex justify-content-center align-items-start flex-wrap">
            <div
              v-for="(name, id) in currencies"
              :key="'currency-'+id"
              :class="{'active':currenciesValues.indexOf(Number(id)) !== -1}"
              class="btn mx-1 mb-2 text-nowrap btn-auditories"
              @click="setCurrenciesValues(id)">
              {{ name }}
            </div>
          </div>
          <div class="text-center mt-4 mt-xs-5">
            <div class="btn btn-gray btn-sm--sm" @click="clearCurrencies">
              Сбросить
            </div>
            <div class="btn btn-primary btn-sm--sm ml-2" @click="$modal.pop()">
              Готово
            </div>
          </div>
        </div>
      </modal>
      <div :class="{'d-none': !isOpenMap}" aria-hidden="false" class="map-modal-wrapper">
        <div class="basic-modal map-modal ymap-custom modal-content">
          <div v-if="showMapFilters" class="map-modal__filter-modal overflow-auto">
            <div class="container py-4">
              <search-input
                v-model="prods.urlQuery.search"
                autofocus="autofocus"
                form-class="mb-4"
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
              <buttons-scroll :hkey="currenciesValues.length + '-' + birthday[0] + '-' + birthday[1]">
                <div :class="{'active':currenciesValues.length}"
                     class="btn mx-1 mb-2 text-nowrap btn-auditories"
                     @click="$modal.push('ModalPromotions')">
                  Тип акции<template v-for="(currencyId, key) in currenciesValues">
                    <template v-if="key === 0">: {{ currencies[Number(currencyId)] }}</template>
                    <template v-else>, {{ currencies[Number(currencyId)] }}</template>
                  </template>
                </div>
                <div :class="{'active':birthday[0] || typeBirthday}"
                     class="btn mx-1 mb-2 text-nowrap btn-auditories"
                     @click="$modal.push('modalTimeOfTheAction')">
                  Время действия акции
                </div>
              </buttons-scroll>

              <div class="text-center mt-4">
                <div class="btn btn-danger btn-sm--sm px-3 px-sm-5" @click="clearAll">
                  Сбросить все
                </div>
                <div class="btn btn-primary btn-sm--sm ml-2 ml-sm-4 px-sm-5" @click="setFiltersMap">
                  Применить
                </div>
              </div>
            </div>
          </div>
          <div :class="{'active': loadingPoints && !isOpenMap}"
               class="loading-list"
          />
          <div :class="{'loading':loadingPoints && isOpenMap}" class="map-modal__filter-btn"
               @click="showMapFilters = !showMapFilters">
            <filter-icon />
          </div>
          <div class="map-modal__close" @click="mapClosed" />
          <div v-if="userLocation" class="map-modal__show-me" @click="onShowMe">
            <fa icon="compass" />
          </div>
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
              v-if="userLocation"
              :icon="markerIconLocationUser"
              :key="'userLocation'"
              :coords="userLocation.position"
              :marker-id="'userLocation'+userLocation.position[0]+'-'+userLocation.position[1]"
            />
            <ymap-marker
              v-for="(point, key) in getPoints"
              :icon="getMarkerIcon(point)"
              :key="point.id"
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
        </div>
      </div>
    </client-only>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import BuildList from '~/mixins/list'
import mapMixin from '~/mixins/map'
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
  allowedParams: ['city_id', 'ordering', 'orderingDir', 'birthday', 'currenciesValues', 'type_birthday'],
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
    birthday: {
      start: {
        url: 'between-birthday-days'
      }
    }
  },
  apiQuery: {
    with_advertisement: 1,
    is_active: 1
  },
  urlQuery: {
    ordering: 'random',
    orderingDir: 'asc',
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
      [`${gN}.urlQuery.birthday`]: function (v) {
        getWatcher({ type: beforeTypes.SEARCH }).call(this)
      },
      [`${gN}.urlQuery.currenciesValues`]: function (v) {
        getWatcher({ type: beforeTypes.SEARCH }).call(this)
      },
      [`${gN}.urlQuery.type_birthday`]: function (v) {
        getWatcher({ type: beforeTypes.SEARCH }).call(this)
      },
      'ordering': function (v) {
        this[gN].urlQuery.ordering = v.ordering
        this[gN].urlQuery.orderingDir = v.orderingDir
      },
      'isOpenMap': function (v) {
        document.body.style.overflow = v ? 'hidden' : 'visible'
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
    'VisitedSlider': () => import('~/components/Product/VisitedSlider'),
    'FilterIcon': () => import('~/components/Icons/Filter'),
    'FilterList': () => import('~/components/FilterList'),
    'MapIcon': () => import('~/components/Icons/MapIcon.vue'),
    'Chevron': () => import('~/components/Icons/Chevron'),
    'SearchInput': () => import('~/components/SearchInput'),
    'Dropdown': () => import('~/components/Dropdown'),
    'ButtonsScroll': () => import('~/components/ButtonsScroll'),
    'Products': () => import('~/components/Products')
  },
  middleware: [],
  mixins: [mapMixin, List.mixin],
  head () {
    return {
      title: this.$route.meta.title,
      bodyAttrs: {
        class: 'theme-default' + (' ' + this.$store.getters['variables/getBlackClass'])
      },
      ...getFavicon('default', 'Список акций, Скидвис')
    }
  },
  asyncData: async ({ params, error, app, query }) => {
    let city = app.store.getters['auth/city']

    if (typeof query.city_id !== 'undefined' && query.city_id !== city.id) {
      await app.store.dispatch('auth/setCity', query.city_id)
    }
    let res = await List.getStartData({
      error,
      query,
      defaultUrlQuery: {
        city_id: city.id,
        birthday: query.birthday || [null, null],
        currenciesValues: query.currenciesValues || [],
        type_birthday: query.type_birthday || null
      }
    })
    res.visitedProducts = []
    res.visitedProductsIds = await app.store.dispatch('auth/getVisitedArray', 'products')

    let visitedProductsTimes = await app.store.getters['auth/products']

    if (res.visitedProductsIds.length) {
      try {
        let { data } = await axios.get('products', {
          params: {
            ordering: 'created_at',
            orderingDir: 'desc',
            perPage: 1000,
            is_active: 1,
            whereIn: res.visitedProductsIds
          }
        })
        for (let i in data.list.data) {
          let product = data.list.data[i]
          product.visitedTime = visitedProductsTimes[product.id] || 0
          res.visitedProducts.push(product)
        }
        res.visitedProducts = res.visitedProducts.sort((a, b) => {
          if (a.visitedTime < b.visitedTime) {
            return 1
          }
          if (a.visitedTime > b.visitedTime) {
            return -1
          }
          return 0
        })
      } catch (e) {
        console.log(e)
        error({ statusCode: 500, message: 'Упс' })
      }
    }

    return res
  },
  data: () => ({
    pluralizeDays: ['день', 'дня', 'дней'],
    currencies: {
      1: 'Скидка в %',
      2: 'Скидка в ₽',
      3: 'Подарок',
      4: 'Бонусы',
      5: 'Кешбек'
    },
    daysBeforeBirthday: [],
    daysAfterBirthday: [],
    showMapFilters: false,
    loadingPoints: false,
    isOpenMap: false,
    cancelRequestPoints: null,
    boundschangeTimeout: null,
    balloonopening: false,
    placemark: null,
    placemarkId: null,
    placemarkClear: true,
    map: null,
    zoom: 10,
    points: [],
    userLocation: null,
    userLocationTimeout: null,
    pointSelect: null,
    pointSelectZoom: false,
    orderingArray: [
      {
        id: 1,
        ordering: 'random',
        orderingDir: 'asc',
        name: 'Без сортировки'
      },
      {
        id: 2,
        ordering: 'created_at',
        orderingDir: 'desc',
        name: 'Новые'
      },
      {
        id: 6,
        ordering: 'discount',
        orderingDir: 'desc',
        name: 'По размеру скидки'
      },
      {
        id: 3,
        ordering: 'popularity',
        orderingDir: 'desc',
        name: 'По популярности'
      },
      {
        id: 4,
        ordering: 'reviews_count',
        orderingDir: 'desc',
        name: 'По отзывам'
      },
      {
        id: 5,
        ordering: 'name',
        orderingDir: 'asc',
        name: 'По названию'
      }
    ],
    ordering: {
      id: 1,
      ordering: 'random',
      orderingDir: 'asc',
      name: 'Без сортировки'
    }
  }),
  computed: {
    ...mapGetters({
      user: 'auth/user',
      check: 'auth/check',
      wishlist: 'auth/wishlist',
      city: 'auth/city'
    }),
    getPoints () {
      return this.points
    },
    getCoords () {
      let res = null
      if (this.pointSelect && this.pointSelect.latitude && this.pointSelect.longitude) {
        res = [this.pointSelect.latitude, this.pointSelect.longitude]
      } else if (this.city && this.city.latitude && this.city.longitude) {
        res = [this.city.latitude, this.city.longitude]
      }
      return res
    },
    birthday () {
      return this[globalNamespace].urlQuery.birthday
    },
    typeBirthday () {
      return this[globalNamespace].urlQuery.type_birthday
    },
    currenciesValues () {
      return this[globalNamespace].urlQuery.currenciesValues
    },
    categories () {
      return this[globalNamespace].urlQuery.categories
    },
    isFiltered () {
      let birthday = this.birthday
      return birthday[0] || birthday[1] || this.currenciesValues.length > 0 || this.categories.length > 0 || this.typeBirthday
    }
  },
  methods: {
    setGiftType (data) {
      this.giftTypes[data.id] = data.value
    },
    async clickMarker (e, point, key) {
      // console.log(e, point, key)
    },
    async balloonopenMarker (e, point, key) {
      this.balloonopening = true
      setTimeout(() => {
        this.balloonopening = false
      }, 600)
    },
    async fetchMapPoints () {
      this.loadingPoints = true

      let bounds = this.map.getBounds()
      let vm = this
      if (vm.cancelRequestPoints) {
        vm.cancelRequestPoints()
      }
      this.placemarkClear = false
      try {
        let { data } = await axios.get('points/map', {
          params: {
            search: this[globalNamespace].urlQuery.search || '',
            categories: this[globalNamespace].urlQuery.categories || [],
            birthday: this[globalNamespace].urlQuery.birthday || [],
            currenciesValues: this[globalNamespace].urlQuery.currenciesValues || [],
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

      setTimeout(() => {
        this.loadingPoints = false
      }, 1000)
    },
    async onClickMap (e) {
      // this.coords = e.get('coords')
      // if (this.map) {
      //   console.log(this.map.getBounds())
      // }
      // console.log(this.$refs.map.getBounds())
    },
    async onMapWasInitialized (payload) {
      this.loadingPoints = true
      this.map = payload
      this.map.events.add('boundschange', (e) => {
        clearTimeout(this.boundschangeTimeout)
        this.boundschangeTimeout = setTimeout(() => {
          if (!this.balloonopening) {
            this.fetchMapPoints()
          }
          if (this.pointSelectZoom) {
            this.pointSelectZoom = false
            this.zoom = 19
          }
        }, 600)
      })

      this.setUserLocation()

      await this.fetchMapPoints()
      // setTimeout(() => {
      //   this.isOpenMap = true
      // }, 1000)
    },
    setUserLocation () {
      // https://tech.yandex.ru/maps/jsapi/doc/2.1/dg/concepts/geolocation-docpage/
      let location = window.ymaps.geolocation.get({ autoReverseGeocode: false })

      // Асинхронная обработка ответа.
      location.then(
        (result) => {
          // Добавление местоположения на карту.
          this.userLocation = result.geoObjects
          clearTimeout(this.userLocationTimeout)
          this.userLocationTimeout = setTimeout(() => {
            this.setUserLocation()
          }, 30000)
        },
        (err) => {
          console.log('Error map location: ' + err)
          clearTimeout(this.userLocationTimeout)
          this.userLocationTimeout = setTimeout(() => {
            this.setUserLocation()
          }, 30000)
        }
      )
    },
    async setFiltersMap () {
      this.showMapFilters = !this.showMapFilters

      await this.fetchMapPoints()
    },
    onOpenMap () {
      this.placemark = null
      this.isOpenMap = true
    },
    mapClosed () {
      this.isOpenMap = false
    },
    onShowMe () {
      if (this.userLocation) {
        this.pointSelectZoom = true
        this.pointSelect = {
          latitude: this.userLocation.position[0],
          longitude: this.userLocation.position[1]
        }
      }
    },
    setCurrenciesValues (id) {
      id = Number(id)
      let values = this.currenciesValues
      if (values.indexOf(id) === -1) {
        this[globalNamespace].urlQuery.currenciesValues.push(id)
      } else {
        this.$delete(this[globalNamespace].urlQuery.currenciesValues, values.indexOf(id))
      }
    },
    clearBirthday () {
      this[globalNamespace].urlQuery.birthday = [null, null]
    },
    clearTypeBirthday () {
      this[globalNamespace].urlQuery.type_birthday = null
    },
    clearCurrencies () {
      this[globalNamespace].urlQuery.currenciesValues = []
    },
    clearTimeOfTheAction () {
      this.clearBirthday()
      this.clearTypeBirthday()
    },
    setTypeBirthday (type) {
      if(this[globalNamespace].urlQuery.type_birthday === type){
        this.clearTypeBirthday()
      }else{
        this.$set(this[globalNamespace].urlQuery, 'type_birthday', type)
      }
      this.clearBirthday()
    },
    setBeforeBirthday (days) {
      if(this[globalNamespace].urlQuery.birthday[0] === days){
        this.$set(this[globalNamespace].urlQuery.birthday, 0, null)
      }else{
        this.$set(this[globalNamespace].urlQuery.birthday, 0, days)
      }
      this.clearTypeBirthday()
    },
    setAfterBirthday (days) {
      if(this[globalNamespace].urlQuery.birthday[1] === days){
        this.$set(this[globalNamespace].urlQuery.birthday, 1, null)
      }else{
        this.$set(this[globalNamespace].urlQuery.birthday, 1, days)
      }
      this.clearTypeBirthday()
    },
    clearAll () {
      this.prodsClearFilter('categories')
      this.clearTimeOfTheAction()
      this.clearCurrencies()
    },
    pluralize (number, suffix) {
      let keys = [2, 0, 1, 1, 1, 2]
      let mod = number % 100
      let suffixKey = (mod > 7 && mod < 20) ? 2 : keys[Math.min(mod % 10, 5)]
      return suffix[suffixKey]
    }
  }
}
</script>

<style>
</style>
