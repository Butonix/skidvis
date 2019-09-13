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
              <div v-if="product.currency_id"
                   :class="{'product__slider__label--present':product.currency_id === 3}"
                   class="product__slider__label">
                <present-page
                  v-if="product.currency_id === 3"/>
                <span v-else-if="product.value">
                  {{ product.value }}{{ (product.currency_id === 1)? '%' : '₽' }}
                </span>
              </div>
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
              v-if="product.conditions"
              :class="{'active':(tab === 'circs')}"
              class="tab"
              @click="tab ='circs'">
              Условия
            </div>
            <div
              v-if="product.description"
              :class="{'active':(tab === 'desc')}"
              class="tab"
              @click="tab ='desc'">
              Описание
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
              <div v-if="tab === 'circs'" :key="'circs'" v-html="product.conditions"/>
              <div v-if="tab === 'desc'" :key="'desc'" v-html="product.description"/>
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
            <addresses-frame :addresses="getPoints"/>
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
      <no-ssr>
        <div class="ymap-custom">
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
      </no-ssr>

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
import { getFavicon } from '~/utils'
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
    'PresentPage': () => import('~/components/Icons/PresentPage'),
    'Review': () => import('~/components/Review'),
    'ReviewEdit': () => import('~/components/ReviewEdit'),
    'SearchInput': () => import('~/components/SearchInput'),
    'Dropdown': () => import('~/components/Dropdown'),
    DynamicLabelInput,
    AddressesFrame,
    Sidebar,
    FullSlider
  },
  mixins: [mapMixin],
  head () {
    return {
      title: 'Акция',
      bodyAttrs: {
        class: 'theme-default'
      },
      ...getFavicon()
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
        perPage: 4,
        categories: []
      },
      mapPoints: [],
      productId,
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
    tab: 'circs',
    search: '',
    fusePoints: null,
    map: null,
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
      if (this.city && this.city.latitude && this.city.longitude) {
        res = [this.city.latitude, this.city.longitude]
      }
      return res
    },
    getOperationModeText () {
      return (this.product.operationModeText) ? this.product.operationModeText.replaceAll(', ', ', <br>') : ''
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
      // console.log(payload._bounds)
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
    }
  }
}
</script>

<style>
  .ymap-custom{
    height: 600px;
  }
</style>
