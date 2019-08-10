<template>
  <div>
    <div class="container">
      <search-input
        v-model="params.search"
        autofocus="autofocus"
        form-class="mb-4"
      />
      <h5 class="mb-3">
        Популярные категории
      </h5>
      <div class="d-flex flex-wrap justify-content-center pb-4">
        <div class="btn btn-blog mx-1 mb-2">
          Свадьба
        </div>
        <div class="btn btn-blog mx-1 mb-2">
          День рождения
        </div>
        <div class="btn btn-blog mx-1 mb-2">
          8 марта
        </div>
        <div class="btn btn-blog mx-1 mb-2">
          Свадьба
        </div>
        <div class="btn btn-blog mx-1 mb-2">
          День рождения
        </div>
        <div class="btn btn-blog mx-1 mb-2">
          8 марта
        </div>
        <div class="btn btn-blog mx-1 mb-2">
          Свадьба
        </div>
        <div class="btn btn-blog mx-1 mb-2">
          День рождения
        </div>
        <div class="btn btn-blog mx-1 mb-2">
          8 марта
        </div>
        <div class="btn btn-blog mx-1 mb-2">
          Свадьба
        </div>
        <div class="btn btn-blog mx-1 mb-2">
          День рождения
        </div>
        <div class="btn btn-blog mx-1 mb-2">
          8 марта
        </div>
        <div class="btn btn-blog mx-1 mb-2 hover">
          Все категории
        </div>
      </div>
    </div>
    <div class="container blog__container--long-offset">
      <div class="row">
        <div class="col-md-6 col-lg-8 col-pr">
          <h5 class="mb-3">
            Свежее
          </h5>
          <card
            type="new"
          />
          <card
            type="new"
          />
          <card
            type="new"
          />
          <div class="row d-none d-lg-flex">
            <div class="col-lg-6">
              <card
              />
            </div>
            <div class="col-lg-6">
              <card
              />
            </div>
            <div class="col-lg-6">
              <card
              />
            </div>
            <div class="col-lg-6">
              <card
              />
            </div>
          </div>
        </div>
        <div class="col-md-6 col-lg-4 col-pl">
          <h5 class="mb-3">
            Актуальное
          </h5>
          <card
            type="actual"
          />
          <card
            type="actual"
          />
          <card
            type="actual"
          />
          <card
            type="actual"
          />
          <card
            type="actual"
          />
        </div>
      </div>

      <h5 class="mb-3">
        Ранее
      </h5>
      <div class="row d-lg-none">
        <div class="col-md-6 col-lg-4">
          <card
          />
        </div>
        <div class="col-md-6 col-lg-4">
          <card
          />
        </div>
        <div class="col-md-6 col-lg-4">
          <card
          />
        </div>
        <div class="col-md-6 col-lg-4">
          <card
          />
        </div>
      </div>
      <div class="row">
        <div class="col-md-6 col-lg-4">
          <card
          />
        </div>
        <div class="col-md-6 col-lg-4">
          <card
          />
        </div>
        <div class="col-md-6 col-lg-4">
          <card
          />
        </div>
        <div class="col-md-6 col-lg-4">
          <card
          />
        </div>
        <div class="col-md-6 col-lg-4">
          <card
          />
        </div>
        <div class="col-md-6 col-lg-4">
          <card
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getQueryData, watchList, queryFixArrayParams } from '~/utils'
import axios from 'axios'

let listWatchInstancePage = watchList(axios, 'indexApiUrl', 'page')
let listWatchInstanceSearch = watchList(axios, 'indexApiUrl', 'search')

export default {
  components: {
    'Card': () => import('~/components/Blog/Card'),
    'SearchInput': () => import('~/components/SearchInput'),
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
        city_id: city.id,
        perPage: 12
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

<style lang="scss">
</style>
