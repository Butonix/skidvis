<template>
  <router-link
    :disabled="disabled"
    :to="{ name: 'blog.show', params: { articleId: article.id } }"
    :class="{
      'article-card': true,
      ['article-card--'+type]: !!type
    }"
    @click.native="onClickLink"
  >
    <div class="article-card__wrapper">
      <div class="article-card__img">

        <div
          v-lazy:background-image="{
            src: article.mainImage,
            loading: '/placeholders/cover.jpg'
          }"
          v-if="article.mainImage"
          data-loading="/placeholders/cover.jpg"
          class="article-card__img__content bg-cover"
          role="img">
          <div v-if="(type === 'new-xl' || type === 'new' || type === 'next') && article.label && article.label.src" class="article-card__label">
            <div class="mb-1"><img :src="article.label.src" :alt="article.label.name"></div>
            {{ article.label.name }}
          </div>
        </div>
        <div
          v-else
          style="background-image: url('/placeholders/cover.jpg');"
          class="article-card__img__content bg-cover"
          role="img">
          <div v-if="(type === 'new-xl' || type === 'new' || type === 'next') && article.label && article.label.src" class="article-card__label">
            <div class="mb-1"><img :src="article.label.src" :alt="article.label.name"></div>
            {{ article.label.name }}
          </div>
        </div>

      </div>
      <div class="article-card__body">
        <div v-if="type === 'new-xl' || type === 'new' || type === 'next'" class="article-card__body__name" v-html="article.name"/>
        <div v-if="type === 'new-xl' || type === 'new' || type === 'next'" class="article-card__body__small" v-html="(article.author)?article.author:'Содержание:'"/>
        <div class="article-card__body__text" v-html="(type !== 'new-xl' && type !== 'new' && type !== 'next')?article.name:article.short_description"/>
        <div v-if="type !== 'next'" class="article-card__body__data">
          <div>
            <eye/> {{ article.views || 0 }}
          </div>
          <div v-if="(type === 'new-xl' || type === 'new') && article.readTime">
            <eye-clock/> Читать {{ article.readTime }} минут
          </div>
        </div>
      </div>
    </div>
  </router-link>
</template>

<script>

export default {
  components: {
    'Eye': () => import('~/components/Icons/Eye'),
    'EyeClock': () => import('~/components/Icons/EyeClock')
  },
  props: {
    type: {
      type: String,
      validator: function (value) {
        return ['actual', 'new', 'new-xl', 'next', ''].indexOf(value) !== -1
      },
      default: ''
    },
    article: {
      type: Object,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
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
