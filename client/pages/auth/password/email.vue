<template>
  <div class="container pt-3">
    <email />
    <div class="text-center">
      <router-link :to="{ name: 'login' }" class="btn btn-gray btn-sm mt-4">
        <&nbsp;Назад
      </router-link>
    </div>
  </div>
</template>

<script>

export default {
  head () {
    return { title: this.$t('reset_password') }
  },
  middleware: 'authRoutes',
  components: {
    'email': () => import('~/components/Auth/password/email')
  }
}
</script>
