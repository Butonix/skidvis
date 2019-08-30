<template>
  <div class="d-flex flex-column">
    <div
      v-if="disabled"
      :class="{
        [cardClass]: !!cardClass,
        'article-card h-100': true,
        ['article-card--'+type]: !!type
      }"
      @click="$emit('click')"
    >
      <card-index
        :type="type"
        :article="article"
      />
    </div>
    <router-link
      v-else
      :to="{ name: 'blog.show', params: { articleId: article.id } }"
      :class="{
        [cardClass]: !!cardClass,
        'article-card h-100': true,
        ['article-card--'+type]: !!type
      }"
      @click.native="onClickLink"
    >
      <card-index
        :type="type"
        :article="article"
      />
    </router-link>
  </div>
</template>

<script>

export default {
  components: {
    'CardIndex': () => import('~/components/Blog/CardIndex')
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
    },
    cardClass: {
      type: String,
      default: ''
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
