<template>
  <div>
    <div class="container mb-5">
      <search-input
        v-model="params.search"
        autofocus="autofocus"
        form-class="mb-4"
      />
    </div>
    <products
      :loading-list="loadingList"
      :items="items"
      :page-count="pageCount"
      :page="params.page"
      @setpage="params.page = $event"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getQueryData, watchList } from '~/utils'
import axios from 'axios'

let listWatchInstancePage = watchList(axios, 'indexApiUrl', 'page')
let listWatchInstanceSearch = watchList(axios, 'indexApiUrl', 'search')

export default {
  components: {
    'SearchInput': () => import('~/components/SearchInput'),
    'Products': () => import('~/components/Products')
  },
  middleware: [],
  head () {
    return {
      title: 'Избранное',
      bodyAttrs: {
        class: 'theme-default'
      }
    }
  },
  asyncData: async ({ params, error, app, query }) => {
    let indexApiUrl
    let collection = {}

    let params_ = getQueryData({ query,
      defaultData: {
        perPage: 12
      }
    })

    indexApiUrl = 'user/wishlist'
    try {
      let { data } = await axios.get(indexApiUrl, {
        params: params_
      })
      collection = data
    } catch (e) {
      error({ statusCode: 500, message: 'Упс' })
    }

    return {
      collection,
      params: params_,
      indexApiUrl
    }
  },
  data: () => ({
    loadingList: false
  }),
  computed: {
    ...mapGetters({
      wishlist: 'auth/wishlist',
      city: 'auth/city'
    }),
    items () {
      return (this.collection.list && this.collection.list.data) ? this.collection.list.data : []
    },
    pageCount () {
      return (this.collection.list && this.collection.list.total) ? Math.ceil(this.collection.list.total / this.params.perPage) : 0
    }
  },
  watch: {
    'params.search': listWatchInstanceSearch,
    'wishlist': function (v) {
      this.clearWishlist(v)
    },
    'params.page': listWatchInstancePage
  },
  methods: {
    clearWishlist (arrayIds) {
      this.collection.list.data = this.collection.list.data.filter(v => arrayIds.indexOf(v.id) !== -1)
      this.collection.list.total--

      if (this.params.page > 1 && this.items.length === 0) {
        this.params.page--
        this.fetchProducts({})
      }
    },
    async fetchProducts ({ page = this.params.page, perPage = this.params.perPage }) {
      try {
        let { data } = await axios.get('user/wishlist', {
          params: {
            page,
            perPage
          }
        })
        this.$set(this, 'collection', data)
      } catch (e) {
        await this.$callToast({
          type: 'error',
          text: 'Обновить акции не удалось'
        })
        console.log(e)
      }
    }
  }
}
</script>

<style>
</style>
