<template>
  <router-link
    :disabled="disabled"
    :to="{ name: 'blog.show', params: { articleId: article.id } }"
    :class="{
      'article-card': true,
      ['article-card--'+type]: !!type
  }">
    <div class="article-card__wrapper">
      <div class="article-card__img">
        <div :style="`background-image: url('${article.mainImage}');`" class="article-card__img__content bg-cover">
          <div v-if="type === 'new' && article.label && article.label.src" class="article-card__label">
            <div class="mb-1"><img :src="article.label.src" :alt="article.label.name"></div>
            {{ article.label.name }}
          </div>
        </div>
      </div>
      <div class="article-card__body">
        <div v-if="type === 'new'" class="article-card__body__name" v-html="article.name"/>
        <div v-if="type === 'new'" class="article-card__body__small" v-html="(article.author)?article.author:'Содержание:'"/>
        <div class="article-card__body__text" v-html="(type !== 'new')?article.name:article.short_description"/>
        <div class="article-card__body__data">
          <div>
            <eye/> {{ article.views || 0 }}
          </div>
          <div v-if="type === 'new' && article.readTime">
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
        return ['actual', 'new', ''].indexOf(value) !== -1
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
  }
}
</script>

<style>

</style>
