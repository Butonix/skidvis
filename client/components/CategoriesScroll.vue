<template>
  <div class="category-icons--scroll">
    <perfect-scrollbar>
      <div class="category-icons--scroll__wrapper">
        <slot/>
      </div>
    </perfect-scrollbar>
  </div>
</template>

<script>
import { PerfectScrollbar } from 'vue2-perfect-scrollbar'

export default {
  components: {
    PerfectScrollbar
  }
}
</script>

<style>

</style>
