<template>
  <li class="nav-item">
    <router-link :to="to"
                 :class="classLink"
                 class="nav-link"
                 active-class="active">
      <slot/>
    </router-link>
  </li>
</template>

<script>
export default {
  name: 'NavItem',
  props: {
    classLink: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: undefined
    },
    to: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
</style>
