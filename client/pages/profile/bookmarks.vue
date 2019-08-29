<template>
  <div>
    <div class="container mb-5">
      <search-input
        v-model="params.search"
        autofocus="autofocus"
        form-class="mb-4"
      />
    </div>
    <div
      v-if="items.length">
      <div
        class="container blog__container--long-offset position-relative">
        <div :class="{'active': loadingList}"
             class="loading-list"
        />
        <div class="row">
          <div
            v-for="(item, index) in items"
            :key="'article-'+index"
            class="col-md-6 col-lg-4">
            <card
              :article="item"
            />
          </div>
        </div>
      </div>
      <div class="container">
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
          next-class="d-none"
          @click.native="onClickLink"
        />
      </div>
    </div>
    <h5 v-else class="text-center py-5">
      Ничего не нашлось :(
    </h5>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getQueryData, watchList, getFavicon } from '~/utils'
import axios from 'axios'
import Paginate from 'vuejs-paginate/src/components/Paginate.vue'

let listWatchInstancePage = watchList(axios, 'indexApiUrl', 'page')
let listWatchInstanceSearch = watchList(axios, 'indexApiUrl', 'search')

export default {
  components: {
    'SearchInput': () => import('~/components/SearchInput'),
    'Card': () => import('~/components/Blog/Card'),
    Paginate
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
    let bookmarks = app.store.getters['auth/bookmarks']

    let params_ = getQueryData({ query,
      defaultData: {
        perPage: 12,
        ordering: 'created_at',
        orderingDir: 'desc'
      }
    })

    if (check) {
      indexApiUrl = 'user/bookmarks'
    } else {
      indexApiUrl = 'articles'

      params_.responseTypeId = 2
      params_.whereIn = [...bookmarks]
    }

    if (!check && bookmarks.length === 0) {
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
        error({ statusCode: e.response.status })
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
      bookmarks: 'auth/bookmarks',
      check: 'auth/check'
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
      if (!(!this.check && this.bookmarks.length === 0)) {
        listWatchInstanceSearch.call(this)
      }
    },
    'bookmarks': async function (v) {
      await this.clearBookmarks(v)
    },
    'check': async function (v) {
      await this.fetchProducts(v)
    },
    'params.page': function () {
      if (!(!this.check && this.bookmarks.length === 0)) {
        listWatchInstancePage.call(this)
      }
    }
  },
  methods: {
    onClickLink () {
      this.$scrollTo(this.$refs.start, 500, {
        offset: -60,
        x: false,
        y: true
      })
    },
    async clearBookmarks (arrayIds) {
      try {
        this.collection.list.data = this.collection.list.data.filter(v => arrayIds.indexOf(v.id) !== -1)
        this.collection.list.total--

        if (this.params.page > 1 && this.items.length === 0) {
          this.params.page--
          await this.fetchArticles({})
        }
      } catch (e) {
      }
    },
    async fetchArticles () {
      this.loadingList = true
      if (!this.check && this.bookmarks.length === 0) {
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
          this.indexApiUrl = 'user/bookmarks'
        } else {
          this.indexApiUrl = 'articles'

          this.params.responseTypeId = 2

          this.params.whereIn = [...this.bookmarks]
        }
        try {
          let { data } = await axios.get(this.indexApiUrl, {
            params: { ...this.params }
          })
          this.$set(this, 'collection', data)
        } catch (e) {
          await this.$callToast({
            type: 'error',
            text: 'Обновить статьи не удалось'
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
