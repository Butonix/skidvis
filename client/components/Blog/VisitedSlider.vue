<template>
  <div v-if="articles.length" class="mt-5">
    <div class="d-flex flex-column flex-xs-row justify-content-between">
      <h5 class="mb-1 mb-xs-3" v-html="title"/>
      <div v-if="showCount" class="mb-3">
        {{ articles.length }} за 24 часа
      </div>
    </div>
    <div class="articles-row-line">
      <div ref="viewport"
           class="articles-row-line__viewport"
           @mousedown="onMousedown">
        <div ref="content"
             :style="`transform: translateX(${scrollLeft}px)`"
             class="articles-row-line__wrapper align-items-stretch">
          <card
            v-for="(item, index) in articles"
            :disabled="true"
            :key="index"
            :article="item"
            type="small"
            card-class="mb-0 cursor-pointer"
            class="mr-4"
            @click="onClick(item)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ScrollBooster from 'scrollbooster'

export default {
  components: {
    'Card': () => import('~/components/Blog/Card')
  },
  props: {
    title: {
      type: String,
      default: 'Недавно смотрели'
    },
    showCount: {
      type: Boolean,
      default: true
    },
    articles: {
      type: Array,
      required: true
    }
  },
  data: () => ({
    sb: null,
    scrollLeftCash: 0,
    scrollLeft: 0
  }),
  watch: {
    articles: function () {
      if (this.sb) {
        this.sb.updateMetrics()
      } else {
        this.createScrollBooster()
      }
    }
  },
  mounted () {
    this.createScrollBooster()
  },
  beforeDestroy () {
    if (this.sb) {
      this.sb.destroy()
    }
  },
  methods: {
    createScrollBooster () {
      if (!this.$refs.viewport || !this.$refs.content) {
        return
      }
      this.sb = new ScrollBooster({
        viewport: this.$refs.viewport, // this parameter is required
        content: this.$refs.content, // scrollable element
        mode: 'x', // scroll only in horizontal dimension
        onUpdate: (data) => {
          this.scrollLeft = -1 * data.position.x
        }
      })
    },
    onMousedown () {
      this.scrollLeftCash = this.scrollLeft
    },
    onClick (article) {
      let cash = this.scrollLeftCash - this.scrollLeft
      if ((cash >= 0 && cash < 30) || (cash <= 0 && cash > -30)) {
        this.$router.push({ name: 'blog.show', params: { articleId: article.id } })
        this.$scrollTo(document.documentElement.getElementsByTagName('body')[0])
      }
    }
  }
}
</script>

<style>

</style>
