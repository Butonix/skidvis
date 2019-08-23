<template>
  <transition name="fade" mode="out-in">
    <router-view/>
  </transition>
</template>

<script>
import blog from '~/mixins/blog'

export default {
  mixins: [blog],
  middleware: ['reactData']
}
</script>

<style>
</style>
