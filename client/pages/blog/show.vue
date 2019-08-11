<template>
  <div v-if="article" class="container">

    <div class="row mb-4">
      <div class="col-lg-2"/>
      <div class="col-lg-8">
        <card
          :article="article"
          :disabled="true"
          type="new"
        />
      </div>
      <div class="col-lg-2"/>
    </div>

    <div class="row">
      <div class="col-lg-2"/>
      <div class="col-lg-8">
        <div class="mb-3" v-html="article.content"/>
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
    baseUrl: process.env.baseUrl,
  }),
  computed: {
    ...mapGetters({
      check: 'auth/check',
      user: 'auth/user'
    })
  },
  methods: {
  }
}
</script>

<style>
</style>
