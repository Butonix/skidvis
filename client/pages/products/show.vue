<template>
  <div>
    <breadcrumbs/>
    <div v-if="product" class="container">
      <div class="row mb-4">
        <div class="product__content">

          <div class="order-2 order-lg-1 product__slider mb-3">
            <full-slider
              :images="product.images"
            >
              <value :currency_id="product.currency_id" :value="product.value" type="product-page"/>
            </full-slider>
          </div>

          <div class="order-1 order-lg-2 d-xs-flex pt-2 mt-1 mb-4">
            <router-link
              :to="{ name: 'organizations.show', params: { organizationId: product.organization_id } }"
              :style="{backgroundColor: (product.organization_color)?product.organization_color:'#FFFFFF'}"
              class="product__logo mr-4 mb-3">
              <img
                v-lazy="product.organization_logo || '/placeholders/logo.svg'"
                :alt="product.name"
                :title="product.name"
                src="/placeholders/96x35-1920x700.gif"
              >
            </router-link>
            <h1 class="flex-grow-1 product__name ff-montserrat" v-html="product.name"/>
          </div>

          <div v-if="product.tags && product.tags.length" class="order-3 order-lg-3 mb-4">
            Акции по тегам
            <div
              v-for="(tag, key) in product.tags"
              :key="'tags-'+key"
              class="tag mx-1 mb-2"
              v-text="tag.name"
            />

            <div v-if="similar.length">
              <visited-slider
                :products="similar"
                :show-count="false"
                class="mt-4"
                title=""
              />
              <div class="pt-2">
                <router-link
                  :to="{ name: 'products.index', query: {categories: similarParams.categories} }"
                  class="link-dotted d-inline-block text-black-50">
                  Все похожие <span class="d-xs-none">акции</span>
                </router-link>
              </div>
            </div>

          </div>

          <sidebar
            :product="product"
            :wishlist-active="wishlist.indexOf(productId) !== -1"
            :socials="product.socials"
            :value="product.value"
            :currency-id="product.currency_id"
            :categories="product.categories"
            :start-at="product.start_at"
            :end-at="product.end_at"
            :operation-mode-text="getOperationModeText"
            box-class="order-4 order-lg-4 mb-4 mt-2"
            box-mod="center"
            @wishlistchange="wishListChange"
          />

          <div
            v-if="product.conditions || product.description"
            class="order-5 order-lg-5 tab-panel mt-3">
            <div
              v-if="product.description"
              :class="{'active':(tab === 'desc')}"
              class="tab"
              @click="tab ='desc'">
              Описание
            </div>
            <div
              v-if="product.conditions"
              :class="{'active':(tab === 'circs')}"
              class="tab"
              @click="tab ='circs'">
              Условия
            </div>
            <div v-scroll-to="'#addresses'" class="tab">
              Адрес
            </div>
            <div v-scroll-to="'#reviews'" class="tab d-none d-sm-block">
              Отзывы
            </div>
          </div>

          <div
            v-if="product.conditions || product.description"
            class="order-6 order-lg-6 tab-content product__description mb-5">
            <transition name="fade" mode="out-in">
              <div v-if="tab === 'desc'" :key="'desc'" v-html="product.description"/>
              <div v-if="tab === 'circs'" :key="'circs'" v-html="product.conditions"/>
            </transition>
          </div>

          <div v-if="product.points" id="addresses" class="order-7 order-lg-7">
            <h5>
              Акция по адресам:
            </h5>
            <search-input
              v-model="search"
              type-style="lite"
              placeholder="Введите адрес или метро"
            />
            <addresses-frame :addresses="getPoints"
                             :default-email="product.email"
                             :default-phone="product.phone"
                             @pointClick="pointClick"
            />
          </div>

        </div>
        <sidebar
          :product="product"
          :wishlist-active="wishlist.indexOf(productId) !== -1"
          :socials="product.socials"
          :value="product.value"
          :currency-id="product.currency_id"
          :categories="product.categories"
          :start-at="product.start_at"
          :end-at="product.end_at"
          :operation-mode-text="getOperationModeText"
          box-mod="right"
          @wishlistchange="wishListChange"
        />
      </div>
      <client-only>
        <div class="ymap-custom ymap-custom--height">
          <yandex-map
            v-if="getCoords"
            ref="map"
            :coords="getCoords"
            :zoom="zoom"
            :scroll-zoom="false"
            @click="onClick"
            @map-was-initialized="onMapWasInitialized"
          >
            <ymap-marker
              v-if="userLocation"
              :icon="markerIconLocationUser"
              :key="'userLocation'"
              :coords="userLocation.position"
              :marker-id="'userLocation'"
            />
            <ymap-marker
              v-for="(point, key) in getMapPoints"
              :icon="getMarkerIcon(point)"
              :key="point.id"
              :balloon-template="balloonTemplatePoint(point, key)"
              :coords="[point.latitude, point.longitude]"
              :marker-id="point.id"
              :callbacks="{
                click: function(e) {
                  clickMarker(e, point, key)
                }
              }"
            />
          </yandex-map>
        </div>
      </client-only>

    </div>

    <div v-if="visitedProducts.length" class="container">
      <visited-slider :products="visitedProducts" class="mt-5"/>
    </div>

    <div id="reviews" class="container mt-5">
      <div class="row">
        <div class="col-lg-10 col-xl-8 mb-4">
          <div class="mb-4 d-flex justify-content-between align-items-start">
            <h5>Отзывы и рейтинг</h5>

            <dropdown :options="reviewsOrderingArray"
                      v-model="reviewsOrdering"
                      btn-class="btn btn-sm btn-gray"
                      h-align="right"
                      placeholder="Сортировка"
            />

          </div>
          <review-edit
            :check="check"
            :form="review.form"
            :user="user"
            field-pros="pros"
            field-cons="cons"
            field-content="text"
            @inputpros="review.form.pros = $event"
            @inputcons="review.form.cons = $event"
            @inputcomment="review.form.text = $event"
            @send="sendReview"
          />

          <transition
            v-for="(review, index) in reviews.data"
            :key="index"
            name="fade" mode="out-in">
            <review
              :review="review"
              @delete="onDeleteReview"
            />
          </transition>
          <transition
            v-if="pageCountReviews && pageCountReviews > 1 && pageCountReviews > reviews.current_page"
            name="fade" mode="out-in">
            <div class="text-center">
              <div :class="{'btn-loading':loadingReview}"
                   class="btn btn-outline-primary px-5"
                   @click="loadMoreReviews"
              >
                Еще
              </div>
            </div>
          </transition>

        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { getFavicon, getTitle } from '~/utils'
import { mapGetters, mapActions } from 'vuex'
import Fuse from 'fuse.js'
import axios from 'axios'
import DynamicLabelInput from '~/components/Edit/Inputs/DynamicLabelInput'
import FullSlider from '~/components/FullSlider'
import AddressesFrame from '~/components/AddressesFrame'
import Sidebar from '~/components/Product/Sidebar'
import Form from 'vform'
import mapMixin from '~/mixins/map'

export default {
  components: {
    'VisitedSlider': () => import('~/components/Product/VisitedSlider'),
    'CardMini': () => import('~/components/Product/CardMini'),
    'Review': () => import('~/components/Review'),
    'ReviewEdit': () => import('~/components/ReviewEdit'),
    'SearchInput': () => import('~/components/SearchInput'),
    'Value': () => import('~/components/Value'),
    'Dropdown': () => import('~/components/Dropdown'),
    DynamicLabelInput,
    AddressesFrame,
    Sidebar,
    FullSlider
  },
  mixins: [mapMixin],
  middleware: ['show'],
  head () {
    let title = 'Акция'
    let desc
    if (this.product) {
      title = getTitle(this.product.name)
      desc = this.product.short_description
    }
    return {
      title: title,
      bodyAttrs: {
        class: 'theme-default' + (' ' + this.$store.getters['variables/getBlackClass'])
      },
      ...getFavicon('default', desc)
    }
  },
  asyncData: async ({ params, error, app }) => {
    let productId = params.productId
    let city = app.store.getters['auth/city']
    let res = {
      similar: [],
      similarParams: {
        is_active: 1,
        ordering: 'created_at',
        orderingDir: 'desc',
        perPage: 3,
        categories: []
      },
      mapPoints: [],
      productId,
      visitedProducts: [],
      visitedProductsIds: await app.store.dispatch('auth/getVisitedArray', 'products'),
      review: {
        form: {
          text: '',
          pros: '',
          cons: ''
        }
      }
    }

    if (productId) {
      try {
        let { data } = await axios.get(`products/${productId}`, {
          params: {
            city_id: city.id
          }
        })
        res = {
          ...res,
          ...data
        }
      } catch (e) {
        error({ statusCode: e.response.status })
      }
      try {
        let { data } = await axios.get(`products/${productId}/map`)
        res.mapPoints = data.list.data
      } catch (e) {
        error({ statusCode: e.response.status })
      }
    } else {
      error({ statusCode: 404 })
    }

    if (res.product && res.product.is_all_similar) {
      let categories = []
      for (let i in res.product.categories) {
        categories.push(res.product.categories[i].id)
      }
      res.similarParams.categories = categories
      try {
        let { data } = await axios.get(`products`, {
          params: res.similarParams
        })
        res.similar = data.list.data
      } catch (e) {
      }
    }

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
            // responseTypeId: 2,
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
    reviewsOrderingArray: [
      {
        id: 1,
        ordering: 'created_at',
        orderingDir: 'desc',
        name: 'Новые'
      },
      {
        id: 2,
        ordering: 'created_at',
        orderingDir: 'asc',
        name: 'Старые'
      }
    ],
    reviewsOrdering: {
      id: 1,
      ordering: 'created_at',
      orderingDir: 'desc',
      name: 'Новые'
    },

    loadingReview: false,
    zoom: 10,
    tab: 'desc',
    search: '',
    fusePoints: null,
    map: null,
    userLocation: null,
    userLocationTimeout: null,
    pointSelect: null
  }),
  computed: {
    ...mapGetters({
      wishlist: 'auth/wishlist',
      check: 'auth/check',
      user: 'auth/user',
      city: 'auth/city'
    }),
    getCoords () {
      let res = null
      if (this.pointSelect && this.pointSelect.latitude && this.pointSelect.longitude) {
        res = [this.pointSelect.latitude, this.pointSelect.longitude]
      } else
      if (this.city && this.city.latitude && this.city.longitude) {
        res = [this.city.latitude, this.city.longitude]
      }
      return res
    },
    getOperationModeText () {
      return (this.product.operationModeText) ? this.product.operationModeText.replaceAll('00:00-00:00', 'круглосуточно').replaceAll(', ', ', <br>') : ''
    },
    getPoints () {
      return (this.fusePoints && this.search.length > 0) ? this.fusePoints.search(this.search) : this.product.points
    },
    getMapPoints () {
      return (this.fuseMapPoints && this.search.length > 0) ? this.fuseMapPoints.search(this.search) : this.mapPoints
    },
    pageCountReviews () {
      return (this.reviews && this.reviews.total) ? Math.ceil(this.reviews.total / this.reviews.per_page) : 0
    }
  },
  watch: {
    'city': async function (v) {
      await this.fetchProduct()
    },
    'reviewsOrdering': async function (v) {
      await this.fetchReviews({})
    }
  },
  async beforeMount () {
    if (!(this.product.points instanceof Fuse)) {
      this.addPointsToSearchArray()
    }
    if (!(this.review.form instanceof Form)) {
      this.review.form = new Form(this.review.form)
    }
  },
  methods: {
    ...mapActions({
      pushInWishlist: 'auth/pushInWishlist',
      removeFromWishlist: 'auth/removeFromWishlist'
    }),
    addPointsToSearchArray () {
      this.fusePoints = new Fuse(this.product.points, {
        shouldSort: true,
        threshold: 0.6,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: [
          'name', 'full_street'
        ]
      })
      this.fuseMapPoints = new Fuse(this.mapPoints, {
        shouldSort: true,
        threshold: 0.6,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: [
          'name', 'full_street'
        ]
      })
    },
    async onClick (e) {
      this.coords = e.get('coords')
      // if (this.map) {
      // console.log(this.map.getBounds())
      // }
      // console.log(this.$refs.map.getBounds())
    },
    async onMapWasInitialized (payload) {
      this.map = payload

      this.setUserLocation()

      // console.log(payload._bounds)
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
    async clickMarker (e, point, key) {
      // console.log(e, point, key)
    },
    wishListChange (e) {
      if (this.wishlist.indexOf(this.productId) !== -1) {
        this.removeFromWishlist(this.productId)
      } else {
        this.pushInWishlist(this.productId)
      }
    },
    async loadMoreReviews () {
      this.loadingReview = true
      try {
        let { data } = await axios.get(`products/${this.productId}/reviews`, {
          params: {
            page: this.reviews.current_page + 1,
            perPage: this.reviews.per_page,
            ordering: this.reviewsOrdering.ordering,
            orderingDir: this.reviewsOrdering.orderingDir
          }
        })

        if (data.list.data.length) {
          for (let i in data.list.data) {
            this.reviews.data.push(data.list.data[i])
          }
        }
        this.reviews.current_page++
      } catch (e) {
        await this.$callToast({
          type: 'error',
          text: 'Получить отзывы не удалось'
        })
        console.log(e)
      }
      this.loadingReview = false
    },
    async fetchReviews ({
      page = 1,
      perPage = this.reviews.per_page,
      ordering = this.reviewsOrdering.ordering,
      orderingDir = this.reviewsOrdering.orderingDir
    }) {
      this.loadingReview = true
      try {
        let { data } = await axios.get(`products/${this.productId}/reviews`, {
          params: {
            page,
            perPage,
            ordering,
            orderingDir
          }
        })

        if (data.list) {
          this.$set(this, 'reviews', data.list)
        }
      } catch (e) {
        await this.$callToast({
          type: 'error',
          text: 'Обновить отзывы не удалось'
        })
        console.log(e)
      }
      this.loadingReview = false
    },
    async fetchProduct () {
      if (this.productId && this.city.id) {
        try {
          let { data } = await axios.get(`products/${this.productId}`, {
            params: {
              city_id: this.city.id
            }
          })
          this.$set(this, 'product', data.product)
          this.search = ''
          this.zoom = 10
          this.addPointsToSearchArray()
        } catch (e) {
          console.log(e)
        }
      } else {
        console.log('error 404')
      }
    },
    setDefaultReviewForm () {
      this.review.form = new Form({
        text: '',
        pros: '',
        cons: ''
      })
    },
    async sendReview () {
      try {
        await this.review.form.post(`products/${this.productId}/reviews`)

        this.setDefaultReviewForm()

        await this.$callToast({
          type: 'success',
          text: 'Отзыв успешно сохранен'
        })

        await this.fetchReviews({})
      } catch (e) {
        await this.$callToast({
          type: 'error',
          text: 'Отправить отзыв не удалось'
        })
        console.log(e)
      }
    },
    pointClick (point) {
      if (this.map && point.latitude && point.longitude) {
        this.pointSelect = point
        setTimeout(() => {
          // https://tech.yandex.ru/maps/archive/doc/jsapi/2.0/dg/concepts/geoquery-docpage/
          window.ymaps.geoQuery(this.map.geoObjects).each(function (el) {
            if (el.properties.get('markerId') === point.id) {
              // https://tech.yandex.ru/maps/jsbox/2.1/clusterer_balloon_open
              el.balloon.open()
              return false
            }
          })
        }, 600)
      }
    },
    async onDeleteReview (review) {
      let res = await this.$confirmDelete({ text: 'Удалить отзыв?' })
      if (res.value) {
        try {
          await axios.delete('reviews/' + review.id)
          await this.fetchReviews({})
        } catch (e) {
          await this.fetchReviews({})
        }
      }
    }
  }
}
</script>

<style>
</style>
