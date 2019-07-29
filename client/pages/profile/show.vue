<template>
  <div class="container">
    <h5>
      Мой профиль
    </h5>

  </div>
</template>

<script>
import axios from 'axios'

export default {
  head () {
    return {
      title: 'Профиль',
      bodyAttrs: {
        class: 'theme-default'
      }
    }
  },
}
</script>

<style>
</style>
