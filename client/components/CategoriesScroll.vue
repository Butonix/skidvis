<template>
  <div class="category-icons--scroll">
    <div v-if="type === ''" ref="viewport"
         class="category-icons--scroll__viewport"
         @mousedown="onMousedown">
      <div ref="content"
           :style="`transform: translateX(${scrollLeft}px)`"
           class="category-icons--scroll__wrapper">
        <category
          v-for="(category, key) in categories"
          v-if="(categoriesActiveIds.indexOf(category.id) !== -1 || category.favorite)"
          :key="'categories-'+key"
          :active="categoriesActiveIds.indexOf(category.id) !== -1"
          :label="category.name"
          :src-active="category.images.default.active || '/img/categories/entertainment/entertainment-default-active.svg'"
          :src="category.images.default.normal || '/img/categories/entertainment/entertainment-default-normal.svg'"
          @click="onClick(category)"
        />
      </div>
    </div>
    <div v-if="type !== ''" ref="viewport"
         class="category-icons--scroll__viewport"
         @mousedown="onMousedown">
      <div ref="content"
           :style="`transform: translateX(${scrollLeft}px)`"
           class="category-icons--scroll__wrapper">
        <div v-for="(category, key) in categories"
             v-if="(categoriesActiveIds.indexOf(category.id) !== -1 || category.favorite)"
             :key="'categories-'+key"
             :class="{['btn-'+type]:true,'active':categoriesActiveIds.indexOf(category.id) !== -1}"
             class="btn mx-1 mb-2 text-nowrap"
             @click="onClick(category)"
             v-text="category.name"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ScrollBooster from 'scrollbooster'

export default {
  components: {
    'Category': () => import('~/components/Category')
  },
  props: {
    type: {
      type: String,
      default: ''
    },
    categories: {
      type: Array,
      default: () => ([])
    },
    categoriesActiveIds: {
      type: Array,
      default: () => ([])
    }
  },
  data: () => ({
    sb: null,
    scrollLeftCash: 0,
    scrollLeft: 0
  }),
  watch: {
    categories: function () {
      if (this.sb) {
        this.sb.updateMetrics()
      } else {
        this.createScrollBooster()
      }
    },
    categoriesActiveIds: function () {
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
