<template>
  <div>
    <div class="top-right links">
      <template v-if="authenticated">
        <router-link :to="{ name: 'home' }">
          Главная
        </router-link>
      </template>
      <template v-else>
        <router-link :to="{ name: 'login' }">
          Вход
        </router-link>
        <router-link :to="{ name: 'register' }">
          Регистрация
        </router-link>
      </template>
    </div>

    <div class="text-center">
      <div class="title mb-4">
        <img src="/img/logo.svg" alt="logo">
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  layout: 'simple',

  head () {
    return { title: this.$t('home') }
  },

  data: () => ({
    title: process.env.appName
  }),

  computed: mapGetters({
    authenticated: 'auth/check'
  })
}
</script>

<style scoped>
.top-right {
  position: absolute;
  right: 10px;
  top: 18px;
}

.title {
  font-size: 85px;
}
</style>
