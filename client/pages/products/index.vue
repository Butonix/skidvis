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
          :active="params.categories.indexOf(String(category.id)) !== -1"
          :label="category.name"
          :src-active="category.images.default.active || '/img/categories/entertainment/entertainment-default-active.svg'"
          :src="category.images.default.normal || '/img/categories/entertainment/entertainment-default-normal.svg'"
          @click="filter('categories',category)"
        />
      </categories>
    </div>
    <products
      :items="items"
      :page-count="pageCount"
      :page="params.page"
      @setpage="params.page = $event"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getQueryData, watchList, queryFixArrayParams } from '~/utils'
import axios from 'axios'
import Paginate from 'vuejs-paginate/src/components/Paginate.vue'

let listWatchInstancePage = watchList(axios, 'indexApiUrl', 'page')
let listWatchInstanceSearch = watchList(axios, 'indexApiUrl', 'search')

export default {
  components: {
    'Flag': () => import('~/components/Flag'),
    'SearchInput': () => import('~/components/SearchInput'),
    'CardLogo': () => import('~/components/Product/CardLogo'),
    'Category': () => import('~/components/Category'),
    'Categories': () => import('~/components/CategoriesScroll'),
    'Products': () => import('~/components/Products'),
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
    let city = app.store.getters['auth/city']

    query = queryFixArrayParams(query, ['categories'])

    let params_ = getQueryData({ query,
      defaultData: {
        categories: [],
        city_id: city.id
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
  computed: {
    ...mapGetters({
      wishlist: 'auth/wishlist',
      city: 'auth/city'
    }),
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
    'params.categories': listWatchInstanceSearch,
    'params.page': listWatchInstancePage,
    'city': function (v) {
      if (v.id) {
        this.params.city_id = v.id
        listWatchInstanceSearch.call(this)
      }
    }
  },
  methods: {
    filter (type, item) {
      switch (type) {
        case 'categories':
          let index = this.params.categories.indexOf(String(item.id))
          if (index === -1) {
            this.params.categories.push(String(item.id))
          } else {
            this.$delete(this.params.categories, index)
          }
          break
      }
    }
  }
}
</script>

<style>
</style>
