<template>
  <div
    :style="{backgroundColor: color}"
    class="card-img-top__logo">
    <div v-if="img"
         class="card-img-top__logo__wrapper">
      <img
        v-lazy="img"
        :alt="alt"
        :title="title"
        :data-id="id"
        data-type="logo"
        src="/placeholders/loading_spinner.gif"
      >
    </div>
    <div v-else class="img-cover w-100 h-100" style="background-image: url('/placeholders/logo.svg');" />
  </div>
</template>

<script>

export default {
  props: {
    img: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: '#FFFFFF'
    },
    title: {
      type: String,
      default: ''
    },
    alt: {
      type: String,
      default: ''
    },
    id: {
      type: String | Number,
      default: ''
    },
  }
}
</script>

<style>

</style>
