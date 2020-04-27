<template>
  <div v-if="products.length">
    <div class="d-flex flex-column flex-xs-row justify-content-between">
      <h5 class="mb-1 mb-xs-3" v-html="title"/>
      <div v-if="showCount" class="mb-3">
        {{ products.length }} за 24 часа
      </div>
    </div>
    <div class="articles-row-line">
      <div ref="viewport"
           class="articles-row-line__viewport"
           @mousedown="onMousedown">
        <div ref="content"
             :style="`transform: translateX(${scrollLeft}px)`"
             class="articles-row-line__wrapper align-items-stretch">
          <card-mini
            v-for="(item, index) in products"
            :disabled="true"
            :key="index"
            :item="item"
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
    'CardMini': () => import('~/components/Product/CardMini')
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
    products: {
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
    products: function () {
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
    onClick (product) {
      let cash = this.scrollLeftCash - this.scrollLeft
      if ((cash >= 0 && cash < 30) || (cash <= 0 && cash > -30)) {
        this.$router.push({ name: 'products.show', params: { productId: product.id } })
        this.$scrollTo(document.documentElement.getElementsByTagName('body')[0])
      }
    }
  }
}
</script>

<style>

</style>
