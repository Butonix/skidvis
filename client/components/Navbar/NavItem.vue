<template>
  <li class="nav-item">
    <router-link :to="to" class="nav-link" active-class="active">
      <slot/>
    </router-link>
  </li>
</template>

<script>
export default {
  props: {
    to: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
</style>
