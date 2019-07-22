<template>
  <div class="category-icon">
    <div class="category-icon__wrapper"
    >
      <div :style="`background-image: url(${src});`" class="category-icon__img"/>
      <div :style="`background-image: url(${srcActive});`" class="category-icon__img--active"/>
    </div>
    <div class="category-icon__label" v-html="label"/>
  </div>
</template>

<script>

export default {
  props: {
    label: {
      type: String,
      default: 'Название'
    },
    srcActive: {
      type: String,
      required: true
    },
    src: {
      type: String,
      required: true
    }
  }
}
</script>

<style>

</style>
