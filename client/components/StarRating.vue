<template>
  <div class="star-range"
  :class="{'edit':edit}">
    <star
      :type="getType(1)"
      :active="edit && hover && hover >= 1"
      @click="$emit('click', 1)"
      @mouseenter="hover = 1"
      @mouseleave="hover = null"
    />
    <star
      :type="getType(2)"
      :active="edit && hover && hover >= 2"
      @click="$emit('click', 2)"
      @mouseenter="hover = 2"
      @mouseleave="hover = null"
    />
    <star
      :type="getType(3)"
      :active="edit && hover && hover >= 3"
      @click="$emit('click', 3)"
      @mouseenter="hover = 3"
      @mouseleave="hover = null"
    />
    <star
      :type="getType(4)"
      :active="edit && hover && hover >= 4"
      @click="$emit('click', 4)"
      @mouseenter="hover = 4"
      @mouseleave="hover = null"
    />
    <star
      :type="getType(5)"
      :active="edit && hover && hover >= 5"
      @click="$emit('click', 5)"
      @mouseenter="hover = 5"
      @mouseleave="hover = null"
    />
  </div>
</template>

<script>
import Star from '~/components/Icons/Star'

export default {
  components: {
    Star
  },
  props: {
    edit: {
      type: Boolean,
      default: false
    },
    rating: {
      type: Number,
      default: 0
    }
  },
  data: () => ({
    hover: null
  }),
  methods: {
    getType (i) {
      if (this.rating === 0) {
        return 1
      }
      if (this.rating >= i) {
        return 2
      }
      if (Math.ceil(this.rating) === i) {
        return 3
      }
      return 1
    }
  }
}
</script>

<style>
</style>
