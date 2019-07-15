<template>
  <div
    class="card-img-top__label"
  >
    {{ value }}
    <div class="card-img-top__label__input">
      <input
        :name="name"
        :placeholder="placeholder"
        v-model="value"
        type="text"
      >
    </div>
  </div>
</template>

<script>

export default {
  props: {
    name: {
      type: String,
      default: ''
    },
    value: {
      type: String | Number,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
}
</script>

<style>
</style>
