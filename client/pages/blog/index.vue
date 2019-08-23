<template>
  <div>
    <div class="container mb-4">
      <search-input
        v-model="params.search"
        autofocus="autofocus"
        form-class="mb-4"
      />
      <div class="d-flex justify-content-between">
        <div class="text-muted small mb-2">
          Популярные категории
        </div>
        <div class=" mb-2">
          <a v-if="params.categories.length" href="javascript:void(0)" class="mr-2 text-muted small cursor-pointer"
             @click="clearSelectedCategories">
            Сбросить
          </a>
          <a href="javascript:void(0)" class="text-muted small cursor-pointer"
             @click="handleAllCats">
            Все <chevron style="transform-origin: center; transform: rotate(-90deg)"/>
          </a>
        </div>
      </div>
      <categories-scroll
        :categories="getFavCategories"
        :categories-active-ids="params.categories"
        type="blog"
        @clickitem="filter('categories', $event)"
      />
    </div>
    <div
      v-if="simpleItems[0]">
      <div
        class="container blog__container--long-offset position-relative">
        <div :class="{'active': loadingList}"
             class="loading-list"
        />
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
            <h5 v-if="actualItems[0]" class="mb-3">
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

        <h5
          v-if="simpleItems[3]"
          class="mb-3 d-lg-none">
          Ранее
        </h5>
        <div
          v-if="simpleItems[3]"
          class="row d-lg-none">
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
      </div>
      <div v-if="pageCount > 1 && pageCount > simplePage" class="pt-4 text-center container">
        <div :class="{'btn-loading':loadingList}"
             class="btn btn-primary px-5"
             @click="loadMoreArticles"
        >
          Загрузить еще
        </div>
      </div>
    </div>
    <h5 v-else class="text-center py-5">
      Ничего не нашлось :(
    </h5>

    <div class="container">
      <visited-slider
        :articles="getVisitedArticles"
      />
    </div>

    <modal name="save-categories">
      <div class="basic-modal categories-modal">
        <div class="position-relative">
          <div :class="{'active': loadingCategories}" class="preloader"/>
          <div class="">
            Выбрано {{ params.categories.length }} из {{ getCategories.length }}
            <div class="">
              <div class="d-flex">
                <search-input
                  v-model="categoriesSearch"
                  form-class="mb-4 flex-grow-1"
                  autofocus="autofocus"
                />
                <div v-if="params.categories.length" class="pl-3">
                  <div class="btn btn-primary btn-sm"
                       @click="clearSelectedCategories">
                    Сбросить
                  </div>
                </div>
              </div>
              <div class="d-flex justify-content-start align-items-start flex-wrap">
                <div v-for="(category, key) in categoriesSelected"
                     :key="'categories-selected-'+key"
                     class="btn btn-blog active mx-1 mb-2 text-nowrap"
                     @click="filter('categories', category)"
                     v-text="category.name"
                />
                <div v-for="(category, key) in getCategoriesSearchable"
                     v-if="!categoriesSelected[category.id]"
                     :key="'categories-'+key"
                     class="btn btn-blog mx-1 mb-2 text-nowrap"
                     @click="filter('categories', category)"
                     v-text="category.name"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="text-center mt-4 mt-xs-5">
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
import Fuse from 'fuse.js'
import { getQueryData, watchList, queryFixArrayParams, getFavicon } from '~/utils'
import axios from 'axios'

let listWatchInstanceSearch = watchList(axios, 'indexApiUrl', 'search')

export default {
  components: {
    'VisitedSlider': () => import('~/components/Blog/VisitedSlider'),
    'Card': () => import('~/components/Blog/Card'),
    'Chevron': () => import('~/components/Icons/Chevron'),
    'CategoriesScroll': () => import('~/components/CategoriesScroll'),
    'SearchInput': () => import('~/components/SearchInput')
  },
  head () {
    return {
      title: 'Блог',
      bodyAttrs: {
        class: 'theme-blog'
      },
      ...getFavicon('blog')
    }
  },
  asyncData: async ({ params, error, app, query }) => {
    let indexApiUrl
    let collection = {}
    let favCategories = {}
    let categoriesSelected = {}

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
        params: {
          articles: 1,
          favorites: 1,
          perPage: 100000,
          orWhereIn: params_.categories
        }
      })
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

    let visitedArticles = []
    let visitedArticlesIds = await app.store.dispatch('auth/getArticlesArray')
    let visitedArticlesTimes = await app.store.getters['auth/articles']

    if (visitedArticlesIds.length) {
      try {
        let { data } = await axios.get('articles', {
          params: {
            responseTypeId: 2,
            ordering: 'created_at',
            perPage: 100000000,
            whereIn: visitedArticlesIds
          }
        })
        for (let i in data.list.data) {
          let article = data.list.data[i]
          article.visitedTime = visitedArticlesTimes[article.id] || 0
          visitedArticles.push(article)
          visitedArticles = visitedArticles.sort((a, b) => {
            if (a.visitedTime < b.visitedTime) {
              return 1
            }
            if (a.visitedTime > b.visitedTime) {
              return -1
            }
            return 0
          })
        }
      } catch (e) {
        console.log(e)
        error({ statusCode: 500, message: 'Упс' })
      }
    }

    return {
      visitedArticles,
      visitedArticlesIds,
      categoriesSelected,
      favCategories,
      collection,
      params: params_,
      indexApiUrl
    }
  },
  data: () => ({
    loadingList: false,

    categories: {},
    fuseCategories: null,
    categoriesSearch: '',
    loadingCategories: true,
    categoriesTotal: 0
  }),
  computed: {
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
    },
    getVisitedArticles () {
      return this.visitedArticles
    }
  },
  watch: {
    'params.search': listWatchInstanceSearch,
    'params.categories': listWatchInstanceSearch
  },
  methods: {
    clearSelectedCategories () {
      this.params.categories = []
      this.categoriesSelected = {}
    },
    async handleAllCats () {
      this.$modal.push('save-categories')
      if (!this.getCategories.length) {
        this.loadingCategories = true
        try {
          let { data } = await axios.get('categories', {
            params: {
              articles: 1,
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
        } catch (e) {
          console.log(e)
          await this.$callToast({
            type: 'error',
            text: 'Загрузить все категории не удалось'
          })
          this.$modal.pop()
        }
        this.loadingCategories = false
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
    },
    async loadMoreArticles () {
      this.loadingList = true
      try {
        let { data } = await axios.get('articles', {
          params: {
            page: this.collection.articles.simple.list.current_page + 1,
            perPage: 12,
            categories: [],
            ordering: 'created_at'
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
      this.loadingList = false
    }
  }
}
</script>

<style lang="scss">
</style>
