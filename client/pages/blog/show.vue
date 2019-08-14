<template>
  <div v-if="article" ref="start" class="container">

    <div class="row mb-4">
      <div class="col-lg-2"/>
      <div class="col-lg-8">
        <card
          :article="article"
          :disabled="true"
          class="mb-0"
          type="new"
        />
      </div>
      <div class="col-lg-2"/>
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
      <div v-if="article.nextArticle" class="col-lg-5 col-xl-5 d-flex align-items-center justify-content-center">
        <router-link
          :to="{ name: 'blog.show', params: { articleId: article.nextArticle.id } }"
          class="article-next"
          @click.native="onClickLink"
        >
          <div class="article-next__one" data-text="Следующая"/>
          <br>
          <div class="article-next__two" data-text="статья"/>
        </router-link>
      </div>
      <div v-if="article.nextArticle" class="col-lg-7 col-xl-7">
        <card
          :article="article.nextArticle"
          class="mb-0"
          type="next"
        />
      </div>
    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'

export default {
  components: {
    'Card': () => import('~/components/Blog/Card'),
    'ShareBox': () => import('~/components/ShareBox')
  },
  head () {
    return {
      title: 'Статья',
      bodyAttrs: {
        class: 'theme-blog'
      }
    }
  },
  asyncData: async ({ params, error, app }) => {
    let articleId = params.articleId
    let res = {
      articleId
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

    return res
  },
  data: () => ({
    baseUrl: process.env.baseUrl
  }),
  computed: {
    ...mapGetters({
      check: 'auth/check',
      user: 'auth/user'
    })
  },
  methods: {
    onClickLink () {
      this.$scrollTo(document.documentElement.getElementsByTagName('body')[0])
    }
  }
}
</script>

<style>
</style>
