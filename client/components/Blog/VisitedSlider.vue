<template>
  <div v-if="articles.length" class="mt-5">
    <div class="d-flex flex-column flex-xs-row justify-content-between">
      <h5 class="mb-1 mb-xs-3">
        Недавно смотрели
      </h5>
      <div class="mb-3">
        {{ articles.length }} за 24 часа
      </div>
    </div>
    <div class="category-icons--scroll mx-0">
      <div ref="viewport"
           class="category-icons--scroll__viewport"
           @mousedown="onMousedown">
        <div ref="content"
             :style="`transform: translateX(${scrollLeft}px)`"
             class="category-icons--scroll__wrapper">
          <card
            v-for="(item, index) in articles"
            :key="index"
            :article="item"
            type="small"
            class="mr-4"
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
      }
    }
  },
  mounted () {
    this.sb = new ScrollBooster({
      viewport: this.$refs.viewport, // this parameter is required
      content: this.$refs.content, // scrollable element
      mode: 'x', // scroll only in horizontal dimension
      onUpdate: (data) => {
        this.scrollLeft = -1 * data.position.x
      }
    })
  },
  beforeDestroy () {
    if (this.sb) {
      this.sb.destroy()
    }
  },
  methods: {
    onMousedown () {
      this.scrollLeftCash = this.scrollLeft
    }
  }
}
</script>

<style>

</style>
