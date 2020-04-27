<template>
  <div :class="{
         'active':!!active,
         [classBox]:!!classBox,
       }" class="wish-list__flag"
       @click="$emit('click', $event)"
  >
    <svg aria-hidden="true" role="img" width="17" height="21" viewBox="0 0 17 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 1H16V19.2192L9.54105 15.2817C8.90173 14.8919 8.09827 14.8919 7.45895 15.2817L1 19.2192V1Z" fill="white" stroke="white" stroke-width="2"/>
    </svg>
  </div>
</template>

<script>

export default {
  props: {
    active: {
      type: Boolean | Number,
      default: false
    },
    classBox: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss">
</style>
