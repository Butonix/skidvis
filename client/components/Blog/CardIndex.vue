<template>
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
        <div v-if="(type === 'new-xl' || type === 'new' || type === 'next') && article.label && article.label.src && type !== 'small'" class="article-card__label">
          <div class="mb-1"><img :src="article.label.src" :alt="article.label.name"></div>
          {{ article.label.name }}
        </div>
      </div>
      <div
        v-else
        style="background-image: url('/placeholders/cover.jpg');"
        class="article-card__img__content bg-cover"
        role="img">
        <div v-if="(type === 'new-xl' || type === 'new' || type === 'next') && article.label && article.label.src && type !== 'small'" class="article-card__label">
          <div class="mb-1"><img :src="article.label.src" :alt="article.label.name"></div>
          {{ article.label.name }}
        </div>
      </div>

    </div>
    <div class="article-card__body">
      <div v-if="type === 'new-xl' || type === 'new' || type === 'next'" class="article-card__body__name" v-html="article.name"/>
      <div v-if="(type === 'new-xl' || type === 'new' || type === 'next') && type !== 'small'" class="article-card__body__small" v-html="(article.author)?article.author:'Содержание:'"/>
      <div class="article-card__body__text" v-html="(type !== 'new-xl' && type !== 'new' && type !== 'next')?article.name:article.short_description"/>
      <div v-if="type !== 'next' && type !== 'small'" class="article-card__body__data">
        <div>
          <eye/> {{ article.views || 0 }}
        </div>
        <div class="d-flex">
          <div v-if="(type === 'new-xl' || type === 'new') && article.readTime" class="">
            <eye-clock/> Читать {{ article.readTime }} минут
          </div>
          <flag v-if="bookmarks.indexOf(article.id) !== -1" :active="true" class-box="pl-3" title="Удалить из закладок"
                @click.stop.prevent="removeFromBookmarks(article.id)"
          />
          <flag v-else :active="false" class-box="pl-3" title="Добавить в закладки"
                @click.stop.prevent="pushInBookmarks(article.id)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  components: {
    'Flag': () => import('~/components/Flag'),
    'Eye': () => import('~/components/Icons/Eye'),
    'EyeClock': () => import('~/components/Icons/EyeClock')
  },
  props: {
    type: {
      type: String,
      validator: function (value) {
        return ['actual', 'new', 'new-xl', 'next', 'small', ''].indexOf(value) !== -1
      },
      default: ''
    },
    article: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters({
      bookmarks: 'auth/bookmarks'
    })
  },
  methods: {
    ...mapActions({
      pushInBookmarks: 'auth/pushInBookmarks',
      removeFromBookmarks: 'auth/removeFromBookmarks'
    })
  }
}
</script>

<style>

</style>
