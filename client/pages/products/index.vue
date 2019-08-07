<template>
  <div>
    <div class="container mb-5">
      <search-input
        v-model="params.search"
        autofocus="autofocus"
        form-class="mb-4"
      />
      <div class="d-flex justify-content-between">
        <div class="text-muted small mb-2">
          Категории
        </div>
        <div class="text-muted small mb-2 cursor-pointer" @click="handleAllCats">
          Все <chevron style="transform-origin: center; transform: rotate(-90deg)"/>
        </div>
      </div>
      <categories-scroll
        :categories="getFavCategories"
        :categories-active-ids="params.categories"
        @clickitem="filter('categories', $event)"
      />
    </div>
    <products
      :items="items"
      :page-count="pageCount"
      :page="params.page"
      @setpage="params.page = $event"
    />

    <modal name="save-categories">
      <div class="basic-modal">
        <div class="position-relative">
          <div :class="{'active': loadingCategories}" class="preloader"/>
          <div class="">
            Выбрано {{ params.categories.length }} из {{ getCategories.length }}
            <div class="">
              <search-input
                v-model="categoriesSearch"
                form-class="mb-4"
                autofocus="autofocus"
              />
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
        <div class="text-center mt-5">
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
import { getQueryData, watchList, queryFixArrayParams } from '~/utils'
import axios from 'axios'

let listWatchInstancePage = watchList(axios, 'indexApiUrl', 'page')
let listWatchInstanceSearch = watchList(axios, 'indexApiUrl', 'search')

export default {
  components: {
    'Category': () => import('~/components/Category'),
    'Chevron': () => import('~/components/Icons/Chevron'),
    'SearchInput': () => import('~/components/SearchInput'),
    'CategoriesScroll': () => import('~/components/CategoriesScroll'),
    'Categories': () => import('~/components/Categories'),
    'Products': () => import('~/components/Products')
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
    let favCategories = {}
    let categoriesSelected = {}
    let city = app.store.getters['auth/city']

    query = queryFixArrayParams(query, ['categories'])

    let params_ = getQueryData({ query,
      defaultData: {
        categories: [],
        city_id: city.id,
        perPage: 12
      }
    })

    if (Number(params_.city_id) !== Number(city.id)) {
      await app.store.dispatch('auth/setCity', params_.city_id)
    }

    params_.categories = params_.categories.map(v => Number(v))

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
        params: {
          products: 1,
          favorites: 1,
          perPage: 100000,
          whereIn: params_.categories
        }
      })
      console.log(data, params_.categories)
      favCategories = data
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

    return {
      categoriesSelected,
      favCategories,
      collection,
      params: params_,
      indexApiUrl
    }
  },
  data: () => ({
    categories: {},
    fuseCategories: null,
    categoriesSearch: '',
    loadingCategories: true,
    categoriesTotal: 0
  }),
  computed: {
    ...mapGetters({
      wishlist: 'auth/wishlist',
      city: 'auth/city'
    }),
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
    async handleAllCats () {
      this.$modal.push('save-categories')
      if (!this.getCategories.length) {
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
          this.loadingCategories = false
        } catch (e) {
          console.log(e)
          await this.$callToast({
            type: 'error',
            text: 'Загрузить все категории не удалось'
          })
          this.$modal.pop()
        }
      }
    },
    filter (type, item) {
      switch (type) {
        case 'categories':
          let id = Number(item.id)
          let index = this.params.categories.indexOf(id)
          if (index === -1) {
            this.params.categories.push(id)
            this.categoriesSelected[id] = { ...item }
          } else {
            this.$delete(this.params.categories, index)
            this.$delete(this.categoriesSelected, id)
          }
          break
      }
    }
  }
}
</script>

<style>
</style>
