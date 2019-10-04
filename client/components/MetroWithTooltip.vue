<template>
  <span v-title-tippy="(station && line && distance)?`Ближашая станция «${station}», ${line} линия в ${distance} метрах`:null" v-if="color"
        :style="'color: #'+color"
  ><metro/></span>
</template>

<script>
export default {
  components: {
    'Metro': () => import('~/components/Icons/Metro')
  },
  props: {
    color: {
      type: String | Number,
      default: null
    },
    station: {
      type: String | Number,
      default: null
    },
    line: {
      type: String | Number,
      default: null
    },
    distance: {
      type: String | Number,
      default: null
    }
  }
}
</script>

<style>

</style>
