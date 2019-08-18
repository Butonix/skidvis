<template>
  <div>
    <breadcrumbs
      brs-class="breadcrumb--blog"
    />
    <div v-if="article" ref="start" class="container">

      <div class="row mb-4">
        <div class="col-lg-2"/>
        <div class="col-lg-8">
          <card
            :article="article"
            :disabled="true"
            class="mb-0"
            type="new-xl"
          />
        </div>
        <div class="col-lg-2 pt-4">
          <div
            v-if="article.organization"
            class="text-center d-flex flex-column align-items-center justify-content-end h-100">
            <router-link
              :to="{ name: 'organizations.show', params: { organizationId: article.organization.id } }"
              :class="(article.organization.logo)?'text-dark':null"
              @click.native="onClickLink"
            >
              <div
                v-if="article.organization.logo" class="d-inline-block mb-2">
                <div
                  :style="{backgroundColor: (article.organization.color && article.organization.logo)?article.organization.color:'#FFFFFF'}"
                  class="article-logo">
                  <img
                    v-lazy="article.organization.logo || '/placeholders/logo.svg'"
                    :alt="article.organization.name"
                    :title="article.organization.name"
                    src="/placeholders/96x35-1920x700.gif"
                  >
                </div>
              </div>
              <div class="article-logo__desc"
              >
                К&#160;странице&#160;компании <span v-if="!article.organization.logo">"{{ article.organization.name }}"</span>
              </div>
            </router-link>
          </div>
        </div>
      </div>

      <div class="row">
        <div class="col-lg-2"/>
        <div class="col-lg-8 mb-5">
          <div class="mb-3 article-content" v-html="article.content"/>
          <div v-if="article.categories && article.categories.length" class="mb-4">
            <div
              v-for="(tag, key) in article.categories"
              :key="'tags-'+key"
              class="tag mx-1 mb-2"
              v-text="tag.name"
            />
          </div>
          <share-box
            :url="baseUrl + '/blog/' + articleId"
            :title="article.name || article.short_description || article.author"
            :description="article.short_description || article.author"
          />

        </div>
        <div class="col-lg-2"/>
        <div v-if="article.nextArticle" class="col-lg-5 col-xl-5 d-flex align-items-center justify-content-center mb-3">
          <router-link
            :to="{ name: 'blog.show', params: { articleId: article.nextArticle.id } }"
            class="article-next"
            @click.native="onClickLink"
          >
            <div class="article-next__full" data-text="Следующая статья"/>
            <div class="article-next__one" data-text="Следующая"/>
            <br>
            <div class="article-next__two" data-text="статья"/>
          </router-link>
        </div>
        <div v-if="article.nextArticle" class="col-lg-7 col-xl-7 mb-3">
          <card
            :article="article.nextArticle"
            class="mb-0"
            type="next"
          />
        </div>
      </div>

      <visited-slider
        :articles="getVisitedArticles"
      />

    </div>
  </div>
</template>

<script>
import { getFavicon } from '~/utils'
import { mapGetters, mapActions } from 'vuex'
import axios from 'axios'

export default {
  components: {
    'VisitedSlider': () => import('~/components/Blog/VisitedSlider'),
    'Card': () => import('~/components/Blog/Card'),
    'ShareBox': () => import('~/components/ShareBox')
  },
  head () {
    return {
      title: 'Статья',
      bodyAttrs: {
        class: 'theme-blog'
      },
      ...getFavicon('blog')
    }
  },
  asyncData: async ({ params, error, app, query }) => {
    let articleId = params.articleId
    let res = {
      articleId,
      visitedArticles: [],
      visitedArticlesIds: await app.store.dispatch('auth/getArticlesArray')
    }

    if (articleId) {
      res.articleId = Number(articleId)
      try {
        let { data } = await axios.get(`articles/${articleId}`)
        res = {
          ...res,
          ...data
        }
      } catch (e) {
        error({ statusCode: 404, message: 'Product not found' })
      }
    } else {
      console.log('error 404')
    }

    let visitedArticlesTimes = await app.store.getters['auth/articles']

    if (res.visitedArticlesIds.length) {
      try {
        let { data } = await axios.get('articles', {
          params: {
            responseTypeId: 2,
            ordering: 'created_at',
            perPage: 100000000,
            whereIn: res.visitedArticlesIds
          }
        })
        for (let i in data.list.data) {
          let article = data.list.data[i]
          article.visitedTime = visitedArticlesTimes[article.id] || 0
          res.visitedArticles.push(article)
        }
        res.visitedArticles = res.visitedArticles.sort((a, b) => {
          if (a.visitedTime < b.visitedTime) {
            return 1
          }
          if (a.visitedTime > b.visitedTime) {
            return -1
          }
          return 0
        })
      } catch (e) {
        console.log(e)
        error({ statusCode: 500, message: 'Упс' })
      }
    }

    return res
  },
  data: () => ({
    baseUrl: process.env.baseUrl
  }),
  computed: {
    ...mapGetters({
      check: 'auth/check',
      user: 'auth/user'
    }),
    getVisitedArticles () {
      return this.visitedArticles
    }
  },
  async mounted () {
    await this.addArticle(this.articleId)
  },
  methods: {
    ...mapActions({
      'addArticle': 'auth/addArticle'
    }),
    onClickLink () {
      this.$scrollTo(document.documentElement.getElementsByTagName('body')[0])
    }
  }
}
</script>

<style>
</style>
