<template>
  <div>
    <breadcrumbs
      brs-class="breadcrumb--blog"
    />
    <div v-if="article" ref="start" class="container">

      <div class="row">
        <div class="col-lg-2"/>
        <div class="col-lg-8">
          <card
            :article="article"
            :disabled="true"
            card-class="mb-3"
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
              @click.native="$sTB()"
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
          <div class="mb-3 article-content" v-html="getArticleContent"/>
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
            @click.native="$sTB()"
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

      <visited-slider :show-count="false"
                      :articles="getSimilarArticles"
                      class="mt-5"
                      title="Похожие статьи"
      />

      <visited-slider :articles="getVisitedArticles"
                      class="mt-5"
      />

      <div id="reviews" class="container mt-5">
        <div class="row">
          <div class="col-lg-10 col-xl-8 mb-4">
            <div class="mb-4 d-flex justify-content-between align-items-start">
              <h5>Отзывы</h5>

              <dropdown :options="reviewsOrderingArray"
                        v-model="reviewsOrdering"
                        btn-class="btn btn-sm btn-gray"
                        h-align="right"
                        placeholder="Сортировка"
              />

            </div>
            <review-edit
              :check="check"
              :form="review.form"
              :user="user"
              field-content="text"
              @inputcomment="review.form.text = $event"
              @send="sendReview"
            />

            <transition
              v-for="(review, index) in reviews.data"
              :key="index"
              name="fade" mode="out-in">
              <review
                :review="review"
              />
            </transition>
            <transition
              v-if="pageCountReviews && pageCountReviews > 1 && pageCountReviews > reviews.current_page"
              name="fade" mode="out-in">
              <div class="text-center">
                <div :class="{'btn-loading':loadingReview}"
                     class="btn btn-outline-primary px-5"
                     @click="loadMoreReviews"
                >
                  Еще
                </div>
              </div>
            </transition>

          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { getFavicon, getTitle } from '~/utils'
import { mapGetters } from 'vuex'
import Form from 'vform'
import axios from 'axios'

export default {
  components: {
    'VisitedSlider': () => import('~/components/Blog/VisitedSlider'),
    'Card': () => import('~/components/Blog/Card'),
    'Dropdown': () => import('~/components/Dropdown'),
    'Review': () => import('~/components/Review'),
    'ReviewEdit': () => import('~/components/ReviewEdit'),
    'ShareBox': () => import('~/components/ShareBox')
  },
  head () {
    let title = 'Статья'
    let desc
    if (this.article) {
      title = getTitle(this.article.name)
      if (this.article.short_description) {
        desc = (((this.article.author) ? this.article.author + ': ' : '') + this.article.short_description)
      }
    }
    return {
      title,
      bodyAttrs: {
        class: 'theme-blog'
      },
      ...getFavicon('blog', desc)
    }
  },
  middleware: ['show'],
  asyncData: async ({ params, error, app, query }) => {
    let articleId = params.articleId
    let res = {
      similarParams: {
        responseTypeId: 2,
        ordering: 'created_at',
        orderingDir: 'desc',
        perPage: 6,
        categories: []
      },
      review: {
        form: {
          text: ''
        }
      },
      articleId,
      visitedArticles: [],
      visitedArticlesIds: await app.store.dispatch('auth/getVisitedArray', 'articles')
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
        error({ statusCode: e.response.status })
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

    if (res.article) {
      let categories = []
      for (let i in res.article.categories) {
        categories.push(res.article.categories[i].id)
      }
      res.similarParams.categories = categories
      try {
        let { data } = await axios.get(`articles`, {
          params: res.similarParams
        })
        res.similar = data.list.data
      } catch (e) {
      }
    }

    return res
  },
  data: () => ({
    reviewsOrderingArray: [
      {
        id: 1,
        ordering: 'created_at',
        orderingDir: 'desc',
        name: 'Новые'
      },
      {
        id: 2,
        ordering: 'created_at',
        orderingDir: 'asc',
        name: 'Старые'
      }
    ],
    reviewsOrdering: {
      id: 1,
      ordering: 'created_at',
      orderingDir: 'desc',
      name: 'Новые'
    },

    loadingReview: false,
    baseUrl: process.env.baseUrl
  }),
  computed: {
    ...mapGetters({
      check: 'auth/check',
      user: 'auth/user'
    }),
    getSimilarArticles () {
      return this.similar
    },
    getVisitedArticles () {
      return this.visitedArticles
    },
    getArticleContent () {
      return this.article.content.replaceAll('contenteditable="true"', '')
    },
    pageCountReviews () {
      return (this.reviews && this.reviews.total) ? Math.ceil(this.reviews.total / this.reviews.per_page) : 0
    }
  },
  watch: {
    'reviewsOrdering': async function (v) {
      await this.fetchReviews({})
    }
  },
  async beforeMount () {
    if (!(this.review.form instanceof Form)) {
      this.review.form = new Form(this.review.form)
    }
  },
  methods: {
    async loadMoreReviews () {
      this.loadingReview = true
      try {
        let { data } = await axios.get(`articles/${this.articleId}/reviews`, {
          params: {
            page: this.reviews.current_page + 1,
            perPage: this.reviews.per_page,
            ordering: this.reviewsOrdering.ordering,
            orderingDir: this.reviewsOrdering.orderingDir
          }
        })

        if (data.list.data.length) {
          for (let i in data.list.data) {
            this.reviews.data.push(data.list.data[i])
          }
        }
        this.reviews.current_page++
      } catch (e) {
        await this.$callToast({
          type: 'error',
          text: 'Получить отзывы не удалось'
        })
        console.log(e)
      }
      this.loadingReview = false
    },
    async fetchReviews ({
      page = 1,
      perPage = this.reviews.per_page,
      ordering = this.reviewsOrdering.ordering,
      orderingDir = this.reviewsOrdering.orderingDir
    }) {
      this.loadingReview = true
      try {
        let { data } = await axios.get(`articles/${this.articleId}/reviews`, {
          params: {
            page,
            perPage,
            ordering,
            orderingDir
          }
        })

        if (data.list) {
          this.$set(this, 'reviews', data.list)
        }
      } catch (e) {
        await this.$callToast({
          type: 'error',
          text: 'Обновить отзывы не удалось'
        })
        console.log(e)
      }
      this.loadingReview = false
    },
    setDefaultReviewForm () {
      this.review.form = new Form({
        text: ''
      })
    },
    async sendReview () {
      try {
        await this.review.form.post(`articles/${this.articleId}/reviews`)

        this.setDefaultReviewForm()

        await this.$callToast({
          type: 'success',
          text: 'Отзыв успешно сохранен'
        })

        await this.fetchReviews({})
      } catch (e) {
        await this.$callToast({
          type: 'error',
          text: 'Отправить отзыв не удалось'
        })
        console.log(e)
      }
    }
  }
}
</script>

<style>
</style>
