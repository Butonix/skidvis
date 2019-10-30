<template>
  <div>
    <div class="container mb-4">
      <search-input
        v-model="artes.urlQuery.search"
        autofocus="autofocus"
        form-class="mb-4"
      />
      <filter-list
        :fuse="artesFS_categories"
        :url-query="artes.urlQuery"
        :filter="artes.filters.categories"
        btn-type="blog"
        title="Популярные категории"
        name="categories"
        @filter="artesFilter('categories', $event)"
        @clearfilter="artesClearFilter('categories')"
        @handleall="artesHandleAll('categories')"
      />
    </div>
    <div
      v-if="artesItems[0]">
      <div
        class="container blog__container--long-offset position-relative">
        <div :class="{'active': artesIsLoading}"
             class="loading-list"
        />
        <div class="row">
          <div class="col-md-6 col-lg-8 col-pr">
            <h5 class="mb-3">
              Свежее
            </h5>
            <card
              v-if="artesItems[0]"
              :article="artesItems[0]"
              type="new"
            />
            <card
              v-if="artesItems[1]"
              :article="artesItems[1]"
              type="new"
            />
            <card
              v-if="artesItems[2]"
              :article="artesItems[2]"
              type="new"
            />
            <div class="row d-none d-lg-flex">
              <card
                v-if="artesItems[3]"
                :article="artesItems[3]"
                class="col-lg-6"
              />
              <card
                v-if="artesItems[4]"
                :article="artesItems[4]"
                class="col-lg-6"
              />
              <card
                v-if="artesItems[5]"
                :article="artesItems[5]"
                class="col-lg-6"
              />
              <card
                v-if="artesItems[6]"
                :article="artesItems[6]"
                class="col-lg-6"
              />
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
          v-if="artesItems[3]"
          class="mb-3 d-lg-none">
          Ранее
        </h5>
        <div
          v-if="artesItems[3]"
          class="row d-lg-none">
          <card
            v-if="artesItems[3]"
            :article="artesItems[3]"
            class="col-md-6 col-lg-4"
          />
          <card
            v-if="artesItems[4]"
            :article="artesItems[4]"
            class="col-md-6 col-lg-4"
          />
          <card
            v-if="artesItems[4]"
            :article="artesItems[4]"
            class="col-md-6 col-lg-4"
          />
          <card
            v-if="artesItems[5]"
            :article="artesItems[5]"
            class="col-md-6 col-lg-4"
          />
        </div>
        <div v-if="artesPage > 1" class="row">
          <card
            v-for="(item, index) in artesItems"
            v-if="index >= 6"
            :key="'article-'+index"
            :article="item"
            class="col-md-6 col-lg-4"
          />
        </div>
      </div>
      <paginate-list
        :params="artesParams"
      />
    </div>
    <h5 v-else class="text-center py-5">
      Ничего не нашлось :(
    </h5>

    <div class="container">
      <visited-slider class="mt-5"
        :articles="getVisitedArticles"
      />
    </div>

  </div>
</template>

<script>
import BuildList from '~/mixins/list'
import { getFavicon } from '~/utils'
import axios from 'axios'

const globalNamespace = 'artes'

const List = BuildList({
  axios,
  globalNamespace,
  apiUrl: 'articles',
  pathResponse: 'articles.simple.list.data',
  pathTotal: 'articles.simple.list.total',
  allowedParams: ['city_id', 'ordering', 'orderingDir'],
  filters: {
    categories: {
      start: {
        url: 'categories',
        pathResponse: 'list.data',
        query: {
          articles: 1,
          favorites: 1,
          perPage: 100000,
          orWhereIn: []
        }
      },
      fetch: {
        url: 'categories',
        pathResponse: 'list.data',
        query: {
          articles: 1,
          perPage: 1000000,
          page: 1
        }
      }
    }
  },
  apiQuery: {
    orderingDir: 'desc',
    ordering: 'created_at',
    is_active: 1
  },
  urlQuery: {
    perPage: 12
  }
})
export default {
  components: {
    'PaginateList': () => import('~/components/PaginateList'),
    'FilterList': () => import('~/components/FilterList'),
    'VisitedSlider': () => import('~/components/Blog/VisitedSlider'),
    'Card': () => import('~/components/Blog/Card'),
    'Chevron': () => import('~/components/Icons/Chevron'),
    'CategoriesScroll': () => import('~/components/CategoriesScroll'),
    'SearchInput': () => import('~/components/SearchInput')
  },
  mixins: [List.mixin],
  head () {
    return {
      title: 'Блог',
      bodyAttrs: {
        class: 'theme-blog' + (' ' + this.$store.getters['variables/getBlackClass'])
      },
      ...getFavicon('blog', 'Список статей, Скидвис')
    }
  },
  asyncData: async ({ params, error, app, query }) => {
    let data = await List.getStartData({
      error,
      query,
      cbResponse ({ data, getFromPath }) {
        let r = {}
        let error = false
        let actual = getFromPath(data, 'articles.actual.list.data')

        if (actual === -1) {
          console.error('#LIST_START_3_ASYNC_DATA')
          error = true
        }
        if (typeof actual === 'undefined') {
          console.error('#LIST_START_4_ASYNC_DATA')
          error = true
        }
        if (!error) {
          r.actual = actual
        }
        return r
      }
    })

    let visitedArticles = []
    let visitedArticlesIds = await app.store.dispatch('auth/getVisitedArray', 'articles')
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
      ...data,
      visitedArticles,
      visitedArticlesIds
    }
  },
  computed: {
    actualItems () {
      return this[globalNamespace].actual || []
    },
    getVisitedArticles () {
      return this.visitedArticles
    }
  }
}
</script>

<style lang="scss">
</style>
