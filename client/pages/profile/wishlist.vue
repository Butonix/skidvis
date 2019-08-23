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
      type="wishlist"
      @setpage="params.page = $event"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getQueryData, watchList, getFavicon } from '~/utils'
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
      },
      ...getFavicon()
    }
  },
  asyncData: async ({ params, error, app, query }) => {
    let indexApiUrl
    let collection = {}

    let check = app.store.getters['auth/check']
    let wishlist = app.store.getters['auth/wishlist']

    let params_ = getQueryData({ query,
      defaultData: {
        perPage: 12,
        ordering: 'created_at',
        orderingDir: 'desc'
      }
    })

    if (check) {
      indexApiUrl = 'user/wishlist'
    } else {
      indexApiUrl = 'products'

      params_.whereIn = [...wishlist]
    }

    if (!check && wishlist.length === 0) {
      collection = {
        current_page: 1,
        data: [],
        from: 1,
        last_page: 1,
        per_page: 12,
        to: 1,
        total: 0
      }
    } else {
      try {
        let { data } = await axios.get(indexApiUrl, {
          params: params_
        })
        collection = data
      } catch (e) {
        error({ statusCode: 500, message: 'Упс' })
      }
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
      check: 'auth/check',
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
    'params.search': function () {
      if (!(!this.check && this.wishlist.length === 0)) {
        listWatchInstanceSearch.call(this)
      }
    },
    'wishlist': async function (v) {
      await this.clearWishlist(v)
    },
    'check': async function (v) {
      await this.fetchProducts(v)
    },
    'params.page': function () {
      if (!(!this.check && this.wishlist.length === 0)) {
        listWatchInstancePage.call(this)
      }
    }
  },
  methods: {
    async clearWishlist (arrayIds) {
      try {
        this.collection.list.data = this.collection.list.data.filter(v => arrayIds.indexOf(v.id) !== -1)
        this.collection.list.total--

        if (this.params.page > 1 && this.items.length === 0) {
          this.params.page--
          await this.fetchProducts({})
        }
      } catch (e) {
      }
    },
    async fetchProducts () {
      this.loadingList = true
      if (!this.check && this.wishlist.length === 0) {
        this.collection = {
          current_page: 1,
          data: [],
          from: 1,
          last_page: 1,
          per_page: 12,
          to: 1,
          total: 0
        }
      } else {
        if (this.check) {
          this.indexApiUrl = 'user/wishlist'
        } else {
          this.indexApiUrl = 'products'

          this.params.whereIn = [...this.wishlist]
        }
        try {
          let { data } = await axios.get(this.indexApiUrl, {
            params: { ...this.params }
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
      this.loadingList = false
    }
  }
}
</script>

<style>
</style>
