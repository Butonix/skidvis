<template>
  <div>
    <div class="container mb-5">
      <search-input
        v-model="params.search"
        autofocus="autofocus"
        form-class="mb-4"
      />
      <div class="text-muted small mb-2">
        Категории
      </div>
      <categories>
        <category
          v-for="(category, key) in getCategories"
          :key="'categories-'+key"
          :label="category.name"
          :src-active="category.images.default.active || '/img/categories/entertainment/entertainment-default-active.svg'"
          :src="category.images.default.normal || '/img/categories/entertainment/entertainment-default-normal.svg'"
          @click="filter('category',category)"
        />
      </categories>
    </div>

    <div class="container container--long-offset">
      <div class="row">
        <div
          v-for="(item, index) in items"
          :key="index"
          class="col-md-6 col-lg-4 mb-5"
        >
          <div
            class="card card--product w-100 h-100"
          >
            <router-link :to="{ name: 'products.show', params: { productId: item.id } }"
                         :class="{
                           'with-logo':item.organization_logo,
                           'error-logo':(errorsImages.logo)?errorsImages.logo[item.id]:false,
                           'error-cover':(errorsImages.cover)?errorsImages.cover[item.id]:false
                         }"
                         class="card-img-top d-block" >
              <div v-if="item.currency_id && item.value" class="card-img-top__label">
                {{ item.value }}{{ (item.currency_id === 1)? '%' : '₽' }}
              </div>
              <div class="embed-responsive">
                <div class="embed-responsive-item">

                  <div
                    v-lazy:background-image="{
                      src: item.images[0].src,
                      loading: '/placeholders/cover.jpg'
                    }"
                    v-if="item.images && item.images[0] && item.images[0].src"
                    data-loading="/placeholders/cover.jpg"
                    class="card-img-top__cover bg-cover"
                    role="img"/>
                  <div
                    v-else :style="{backgroundImage: '/placeholders/cover.jpg'}"
                    class="card-img-top__cover img-cover"
                    role="img"/>

                  <card-logo
                    v-if="item.organization_logo"
                    :img="item.organization_logo"
                    :color="item.organization_color"
                    :title="item.name"
                    :alt="item.name"
                    :id="item.id"
                  />
                </div>
              </div>
            </router-link>
            <label class="card-body pb-2 pt-4" v-html="((item.short_description)?item.short_description.replaceAll('\n', '<br>'):((item.name)?item.name.replaceAll('\n', '<br>'):''))"/>
          </div>
        </div>
      </div>

      <paginate
        v-if="pageCount && pageCount > 1"
        v-model="params.page"
        :page-count="pageCount"
        :page-range="3"
        :margin-pages="1"
        :hide-prev-next="true"
        :container-class="'pagination'"
        :page-class="'page-item'"
        prev-class="d-none"
        next-class="d-none"/>

    </div>
  </div>
</template>

<script>
import { getQueryData, watchList } from '~/utils'
import axios from 'axios'
import SearchInput from '~/components/SearchInput'
import Paginate from 'vuejs-paginate/src/components/Paginate.vue'

let listWatchInstancePage = watchList(axios, 'indexApiUrl', 'page')
let listWatchInstanceSearch = watchList(axios, 'indexApiUrl', 'search')

export default {
  components: {
    'CardLogo': () => import('~/components/Product/CardLogo'),
    'Category': () => import('~/components/Category'),
    'Categories': () => import('~/components/Categories'),
    SearchInput,
    Paginate
  },
  middleware: [],
  head () {
    return {
      title: 'Все акции',
      bodyAttrs: {
        class: 'theme-default'
      }
    }
  },
  asyncData: async ({ params, error, app, query }) => {
    let indexApiUrl
    let collection = {}
    let categories = {}
    let params_ = getQueryData({ query })

    indexApiUrl = 'products'
    try {
      let { data } = await axios.get(indexApiUrl, {
        params: params_
      })
      collection = data
    } catch (e) {
      error({ statusCode: 500, message: 'Упс' })
    }

    try {
      let { data } = await axios.get('categories', {
        // params: params_
      })
      categories = data
    } catch (e) {
      console.log(e)
    }

    return {
      categories,
      collection,
      params: params_,
      indexApiUrl
    }
  },
  data: () => ({
    errorsImages: {}
  }),
  computed: {
    getCategories () {
      return (this.categories.list && this.categories.list.data) ? this.categories.list.data : []
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
    'params.page': listWatchInstancePage
  },
  beforeMount () {
    this.$Lazyload.$off('error')
    this.$Lazyload.$on('error', this.onErrorImg)
  },
  methods: {
    onErrorImg ({ el }) {
      let id = el.getAttribute('data-id')
      let type = el.getAttribute('data-type')
      if (id) {
        if (!this.errorsImages[type]) {
          this.$set(this.errorsImages, type, { [Number(id)]: true })
        } else {
          this.$set(this.errorsImages[type], Number(id), true)
        }
      }
    }
  }
}
</script>

<style>
</style>
