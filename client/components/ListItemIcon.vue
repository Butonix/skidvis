<template>
  <div :class="{
         [classBox]:!!classBox,
       }"
       class="list-item-icon">
    <div class="list-item-icon__icon">
      <slot name="icon"/>
    </div>
    <div class="list-item-icon__text">
      <slot name="text"/>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    classBox: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss">
</style>
