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
            v-if="simpleItems[0]"
            :article="simpleItems[0]"
            type="new"
          />
          <card
            v-if="simpleItems[1]"
            :article="simpleItems[1]"
            type="new"
          />
          <card
            v-if="simpleItems[2]"
            :article="simpleItems[2]"
            type="new"
          />
          <div class="row d-none d-lg-flex">
            <div class="col-lg-6">
              <card
                v-if="simpleItems[3]"
                :article="simpleItems[3]"
              />
            </div>
            <div class="col-lg-6">
              <card
                v-if="simpleItems[4]"
                :article="simpleItems[4]"
              />
            </div>
            <div class="col-lg-6">
              <card
                v-if="simpleItems[5]"
                :article="simpleItems[5]"
              />
            </div>
            <div class="col-lg-6">
              <card
                v-if="simpleItems[6]"
                :article="simpleItems[6]"
              />
            </div>
          </div>
        </div>
        <div class="col-md-6 col-lg-4 col-pl">
          <h5 class="mb-3">
            Актуальное
          </h5>
          <card
            v-for="(item, index) in actualItems"
            :key="index"
            :article="item"
            type="actual"
          />
        </div>
      </div>

      <h5 class="mb-3 d-lg-none">
        Ранее
      </h5>
      <div class="row d-lg-none">
        <div class="col-md-6 col-lg-4">
          <card
            v-if="simpleItems[3]"
            :article="simpleItems[3]"
          />
        </div>
        <div class="col-md-6 col-lg-4">
          <card
            v-if="simpleItems[4]"
            :article="simpleItems[4]"
          />
        </div>
        <div class="col-md-6 col-lg-4">
          <card
            v-if="simpleItems[4]"
            :article="simpleItems[4]"
          />
        </div>
        <div class="col-md-6 col-lg-4">
          <card
            v-if="simpleItems[5]"
            :article="simpleItems[5]"
          />
        </div>
      </div>
      <div v-if="simplePage > 1" class="row">
        <div
          v-for="(item, index) in simpleItems"
          v-if="index >= 6"
          :key="'article-'+index"
          class="col-md-6 col-lg-4">
          <card
            :article="item"
          />
        </div>
      </div>
      <div v-if="pageCount > 1 && pageCount > simplePage" class="pt-4 text-center">
        <div class="btn btn-primary px-5"
             :class="{'btn-loading':loadingArticles}"
             @click="loadMoreArticles"
        >
          Загрузить еще
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getQueryData, watchList, queryFixArrayParams } from '~/utils'
import axios from 'axios'

let listWatchInstanceSearch = watchList(axios, 'indexApiUrl', 'search')

export default {
  components: {
    'Card': () => import('~/components/Blog/Card'),
    'SearchInput': () => import('~/components/SearchInput')
  },
  middleware: [],
  head () {
    return {
      title: 'Блог',
      bodyAttrs: {
        class: 'theme-blog'
      }
    }
  },
  asyncData: async ({ params, error, app, query }) => {
    let indexApiUrl
    let collection = {}
    let categories = {}

    query = queryFixArrayParams(query, ['categories'])

    let params_ = getQueryData({ query,
      defaultData: {
        categories: [],
        ordering: 'created_at',
        perPage: 12
      },
      ignoreData: ['page']
    })

    indexApiUrl = 'articles'
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
    loadingArticles: false
  }),
  computed: {
    getCategories () {
      return (this.categories.list && this.categories.list.data) ? this.categories.list.data : []
    },
    actualItems () {
      let data = []
      try {
        data = this.collection.articles.actual.list.data
      } catch (e) {
      }
      return data
    },
    simpleItems () {
      let data = []
      try {
        data = this.collection.articles.simple.list.data
      } catch (e) {
      }
      return data
    },
    simplePage () {
      let data = 0
      try {
        data = this.collection.articles.simple.list.current_page
      } catch (e) {
      }
      return data
    },
    pageCount () {
      let data = 0
      try {
        data = Math.ceil(this.collection.articles.simple.list.total / 12)
      } catch (e) {
      }
      return data
    }
  },
  watch: {
    'params.search': listWatchInstanceSearch,
    'params.categories': listWatchInstanceSearch
  },
  methods: {
    async loadMoreArticles () {
      this.loadingArticles = true
      try {
        let { data } = await axios.get('articles', {
          params: {
            page: this.collection.articles.simple.list.current_page + 1,
            perPage: 12,
            categories: [],
            ordering: 'created_at',
          }
        })
        if (data.articles.simple.list.data.length) {
          for (let i in data.articles.simple.list.data) {
            this.collection.articles.simple.list.data.push(data.articles.simple.list.data[i])
          }
        }
        this.collection.articles.simple.list.current_page++
      } catch (e) {
        await this.$callToast({
          type: 'error',
          text: 'Получить статьи не удалось'
        })
        console.log(e)
      }
      this.loadingArticles = false
    },
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
