<template>
  <div class="container" v-if="product">
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
              src="/placeholders/loading_spinner.gif"
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
          <div class="tab">
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

        <div v-if="product.points" class="order-7 order-lg-7">
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
        box-mod="right"
      />
    </div>

  </div>
</template>

<script>
// import { sortBy } from 'lodash'
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
    let res = {
      productId
    }

    if (productId) {
      try {
        let { data } = await axios.get(`products/${productId}`)
        res = {
          ...data
        }
        console.log(data)
      } catch (e) {
        error({ statusCode: 404, message: 'Product not found' })
      }
    } else {
      console.log('error 404')
    }

    return res
  },
  data: () => ({
    tab: 'circs',
    search: '',
    action: '',
    categories: [
      {
        id: 123,
        name: '',
        images: {
          default: {
            normal: 'http://lorempixel.com/1920/700',
            active: 'http://lorempixel.com/1920/700'
          },
          business: {
            normal: 'http://lorempixel.com/1920/700',
            active: 'http://lorempixel.com/1920/700'
          }
        }
      },
      {
        id: 321,
        name: '',
        images: {
          default: {
            normal: 'http://lorempixel.com/1920/700',
            active: 'http://lorempixel.com/1920/700'
          },
          business: {
            normal: 'http://lorempixel.com/1920/700',
            active: 'http://lorempixel.com/1920/700'
          }
        }
      }
    ],
    fusePoints: null
  }),
  computed: {
    getPoints () {
      return (this.fusePoints && this.search.length > 0) ? this.fusePoints.search(this.search) : this.product.points
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
  }
}
</script>

<style>
</style>
