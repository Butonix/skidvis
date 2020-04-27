<template>
  <div :class="{
         'active': !!active,
         ['category-icon--'+type]: !!type,
       }"
       class="category-icon"
       @click="$emit('click', $event)">
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
    type: {
      type: String,
      default: ''
    },
    srcActive: {
      type: String,
      required: true
    },
    src: {
      type: String,
      required: true
    },
    active: {
      type: Boolean | Number | String,
      default: false
    }
  }
}
</script>

<style>

</style>
