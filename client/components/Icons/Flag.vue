<template>
  <div :class="{
    'active':!!count
  }" class="wish-list__flag">
    <div class="wish-list__flag__text" v-text="(count)?count:''"/>
    <svg aria-hidden="true" role="img" width="17" height="21" viewBox="0 0 17 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 1H16V19.2192L9.54105 15.2817C8.90173 14.8919 8.09827 14.8919 7.45895 15.2817L1 19.2192V1Z" fill="#FF2E00" stroke="black" stroke-width="2"/>
    </svg>
  </div>
</template>

<script>

export default {
  props: {
    count: {
      type: Number,
      default: 0
    }
  }
}
</script>

<style lang="scss">
</style>
