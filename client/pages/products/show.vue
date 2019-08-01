<template>
  <div>
    <breadcrumbs/>
    <div v-if="product" class="container">
      <div class="row">
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
                src=" /placeholders/96x35-1920x700.gif"
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
            :socials="product.socials"
            :value="product.value"
            :currency-id="product.currency_id"
            :categories="product.categories"
            :start-at="product.start_at"
            :end-at="product.end_at"
            :operation-mode-text="getOperationModeText"
            box-class="order-4 order-lg-4 mb-4 mt-2"
            box-mod="center"
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
          :socials="product.socials"
          :value="product.value"
          :currency-id="product.currency_id"
          :categories="product.categories"
          :start-at="product.start_at"
          :end-at="product.end_at"
          :operation-mode-text="getOperationModeText"
          box-mod="right"
        />
      </div>
      <no-ssr>
        <yandex-map
          :coords="coords"
          :zoom="zoom"
          @click="onClick"
        >
          <ymap-marker
            :coords="[57.906280040815496, 60.089627381835875]"
            marker-id="1"
            hint-content="some hint"
            marker-type="Placemark"
            content="some content here"
          />
        </yandex-map>
      </no-ssr>

    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Fuse from 'fuse.js'
import axios from 'axios'
import DynamicLabelInput from '~/components/Edit/Inputs/DynamicLabelInput'
import FullSlider from '~/components/FullSlider'
import AddressesFrame from '~/components/AddressesFrame'
import Sidebar from '~/components/Product/Sidebar'

export default {
  components: {
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
      productId
    }

    if (productId) {
      try {
        let { data } = await axios.get(`products/${productId}`, {
          params: {
            city_id: city.id
          }
        })
        res = {
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
    coords: [57.907605, 59.972211],
    zoom: 10,
    tab: 'circs',
    search: '',
    fusePoints: null
  }),
  computed: {
    ...mapGetters({
      city: 'auth/city'
    }),
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
    }
  },
  methods: {
    onClick (e) {
      this.coords = e.get('coords')
      console.log(this.coords)
    },
    async fetchProduct () {
      if (this.product.id && this.city.id) {
        try {
          let { data } = await axios.get(`products/${this.product.id}`, {
            params: {
              city_id: this.city.id
            }
          })
          this.$set(this, 'product', data.product)
        } catch (e) {
          console.log(e)
        }
      } else {
        console.log('error 404')
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
