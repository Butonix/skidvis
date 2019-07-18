<template>
  <div class="thumbs-file-input">
    <thumb-file-input
      v-for="i in range"
      v-if="i <= images.length"
      :key="i"
      :image="images[i]"
      :loading="!!imagesLoading[i]"
      @delete="onDelete(i)"
      @change="onChange($event.image, i)"
    />
  </div>
</template>

<script>
import { range } from 'lodash'
import ThumbFileInput from './Thumb'

export default {
  components: {
    ThumbFileInput
  },
  props: {
    max: {
      type: Number,
      default: 7
    },
    images: {
      type: Array,
      default: () => []
    },
    imagesLoading: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    range () {
      return range(0, this.max)
    }
  },
  methods: {
    onChange (image, index) {
      this.$emit('change', {
        image,
        index
      })
    },
    onDelete (index) {
      this.$emit('delete', {
        index
      })
    }
  }
}
</script>

<style>
</style>
