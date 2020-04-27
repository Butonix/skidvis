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
import { getFavicon } from '~/utils'

export default {
  head () {
    return {
      title: 'Сброс пароля',
      ...getFavicon()
    }
  },
  middleware: ['authRoutes', 'reactData'],
  components: {
    'email': () => import('~/components/Auth/password/email')
  }
}
</script>
