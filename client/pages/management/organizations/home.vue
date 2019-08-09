<template>
  <transition name="fade" mode="out-in">
    <router-view/>
  </transition>
</template>

<script>

export default {
  middleware: ['auth', 'organizations']
}
</script>

<style>
</style>
