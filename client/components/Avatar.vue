<template>
  <div class="avatar" v-text="user.initials || 'АК'"/>
</template>

<script>

export default {
  props: {
    user: {
      type: Object,
      required: true
    }
  }
}
</script>

<style>

</style>
