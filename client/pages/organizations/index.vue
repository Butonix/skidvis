<template>
  <div>
    <div class="container orgs mb-5">
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

    <div class="container orgs__container">
      <transition
        v-if="items.length"
        name="fade" mode="out-in">
        <div
          class="orgs__row">
          <transition
            v-for="(item, index) in items"
            :key="index"
            name="fade" mode="out-in">
            <div
              :title="item.name"
              class="orgs__col"
            >
              <router-link
                :to="{ name: 'organizations.show', params: { organizationId: item.id } }"
                :style="{backgroundColor: (item.logo && item.logo.color)?item.logo.color:'#FFFFFF'}"
                class="orgs__col__box">
                <div v-if="(item.logo && item.logo.src)?item.logo.src:null"
                     class="orgs__col__box__wrapper">
                  <img
                    v-lazy="(item.logo && item.logo.src)?item.logo.src:''"
                    :alt="item.name"
                    :title="item.name"
                    :data-id="item.id"
                    data-type="logo"
                    src="/placeholders/96x35-1920x700.gif"
                  >
                </div>
                <div v-else class="bg-cover w-100 h-100" style="background-image: url('/placeholders/logo.svg');" />
              </router-link>
            </div>
          </transition>
        </div>
      </transition>
      <transition
        v-else
        name="fade" mode="out-in">
        <h5 class="text-center py-5">
          Ничего не нашлось :(
        </h5>
      </transition>

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
import { mapGetters, mapActions } from 'vuex'
import { getQueryData, watchList } from '~/utils'
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
    'Categories': () => import('~/components/Categories'),
    Paginate
  },
  middleware: [],
  head () {
    return {
      title: 'Все организации',
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

    let params_ = getQueryData({ query,
      defaultData: {
        categories: [],
        city_id: city.id,
        perPage: 50
      }
    })

    if (Number(params_.city_id) !== Number(city.id)) {
      await app.store.dispatch('auth/setCity', params_.city_id)
    }

    indexApiUrl = 'organizations'
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
    errorsImages: {},
    activeAddresses: 0
  }),
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
  beforeMount () {
    this.$Lazyload.$off('error')
    this.$Lazyload.$on('error', this.onErrorImg)
  },
  methods: {
    ...mapActions({
      pushInWishlist: 'auth/pushInWishlist',
      removeFromWishlist: 'auth/removeFromWishlist'
    }),
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
    },
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
