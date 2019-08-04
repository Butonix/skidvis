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
              <div v-if="product.currency_id && product.value" class="product__slider__label">
                {{ product.value }}{{ (product.currency_id === 1)? '%' : '₽' }}
              </div>
            </full-slider>
          </div>

          <div class="order-1 order-lg-2 d-xs-flex pt-2 mt-1 mb-4">
            <div class="product__logo mr-4 mb-3">
              <img
                v-lazy="product.organization_logo || '/placeholders/logo.svg'"
                :alt="product.name"
                :title="product.name"
                src="/placeholders/96x35-1920x700.gif"
              >
            </div>
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
            <div class="tab d-none d-sm-block">
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
        <yandex-map
          v-if="getCoords"
          :coords="getCoords"
          :zoom="zoom"
          :scroll-zoom="false"
          @click="onClick"
        >
          <ymap-marker
            v-for="(point, key) in getPoints"
            :key="key"
            :properties="{
              iconCaption: point.name
            }"
            :balloon-template="balloonTemplatePoint(point)"
            :coords="[point.latitude, point.longitude]"
            :marker-id="key"
            :hint-content="point.name"
            :callbacks="{
              click: function(e) {
                clickMarker(e, point, key)
              }
            }"
          />
        </yandex-map>
      </no-ssr>

    </div>

    <div class="container">
      <div class="row">
        <div class="col-lg-10 col-xl-8 mb-4">
          <div class="mb-4">
            <h5>Отзывы и рейтинг</h5>
          </div>
          <review-edit
            v-if="check"
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
          <review
            v-for="(review, index) in reviews.data"
            :key="index"
            :review="review"
          />
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Fuse from 'fuse.js'
import axios from 'axios'
import DynamicLabelInput from '~/components/Edit/Inputs/DynamicLabelInput'
import FullSlider from '~/components/FullSlider'
import AddressesFrame from '~/components/AddressesFrame'
import Sidebar from '~/components/Product/Sidebar'
import Form from 'vform'

export default {
  components: {
    'Review': () => import('~/components/Review'),
    'ReviewEdit': () => import('~/components/ReviewEdit'),
    'SearchInput': () => import('~/components/SearchInput'),
    DynamicLabelInput,
    AddressesFrame,
    Sidebar,
    FullSlider
  },
  head () {
    return {
      title: 'Акция',
      bodyAttrs: {
        class: 'theme-default'
      }
    }
  },
  asyncData: async ({ params, error, app }) => {
    let productId = params.productId
    let city = app.store.getters['auth/city']
    let res = {
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
      res.productId = Number(productId)
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
        error({ statusCode: 404, message: 'Product not found' })
      }
    } else {
      console.log('error 404')
    }

    return res
  },
  data: () => ({
    zoom: 10,
    tab: 'circs',
    search: '',
    fusePoints: null
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
      return (this.product.operationModeText) ? this.product.operationModeText.replace(', ', ', <br>') : ''
    },
    getPoints () {
      return (this.fusePoints && this.search.length > 0) ? this.fusePoints.search(this.search) : this.product.points
    }
  },
  watch: {
    'city': function (v) {
      this.fetchProduct()
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
    },
    async onClick (e) {
      this.coords = e.get('coords')
      console.log(this.coords)
    },
    async clickMarker (e, point, key) {
      console.log(e, point, key)
    },
    balloonTemplatePoint (point) {
      return `
        <h5>${point.name}</h5>
        <p>${point.full_street}</p>
      `
    },
    wishListChange (e) {
      if (this.wishlist.indexOf(this.productId) !== -1) {
        this.removeFromWishlist(this.productId)
      } else {
        this.pushInWishlist(this.productId)
      }
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
    setDefaultReviewForm ({ cons = '', pros = '', text = '' }) {
      this.review.form = new Form({
        text: text,
        pros: pros,
        cons: cons
      })
    },
    async sendReview () {
      try {
        const { data } = await this.review.form.post(`products/${this.productId}/reviews`)

        if (data.review) {
          this.reviews.data.unshift(data.review)
          this.reviews.total += 1
        }

        this.setDefaultReviewForm()

        await this.$callToast({
          type: 'success',
          text: 'Отзыв успешно сохранен'
        })
      } catch (e) {
        await this.$callToast({
          type: 'error',
          text: 'Отправить отзыв не удалось'
        })
      }
    }
  }
}
</script>

<style>
  .ymap-container{
    height: 600px;
  }
</style>
