<template>
  <div class="category-icons--scroll">
    <div ref="viewport"
         class="category-icons--scroll__viewport"
         @mousedown="onMousedown">
      <div ref="content"
           :style="`transform: translateX(${scrollLeft}px)`"
           class="category-icons--scroll__wrapper">
        <slot/>
      </div>
    </div>
  </div>
</template>

<script>
import ScrollBooster from 'scrollbooster'

export default {
  data: () => ({
    sb: null,
    scrollLeftCash: 0,
    scrollLeft: 0
  }),
  mounted () {
    setTimeout(this.createScrollBooster, 1000)
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
    onClick (category) {
      let cash = this.scrollLeftCash - this.scrollLeft
      if ((cash >= 0 && cash < 30) || (cash <= 0 && cash > -30)) {
        this.$emit('clickitem', category)
      }
    }
  }
}
</script>

<style>

</style>
