<template>
  <div class="container pt-3">
    <div class="row">
      <div class="custom-col login-col mx-auto">
        <register :store="$store" :router="$router" @register="register"/>
        <div class="text-center mt-4">
          <router-link :to="{ name: 'login' }" class="btn btn-gray btn-sm">
            <&nbsp;Назад
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  head () {
    return { title: this.$t('register') }
  },
  middleware: 'authRoutes',
  components: {
    'register': () => import('~/components/Auth/register')
  },

  methods: {
    async register (form) {
      try {
        // Register the user.
        const { data } = await form.post('/register')

        // Log in the user.
        const { data: { token } } = await form.post('/login')

        // Save the token.
        this.$store.dispatch('auth/saveToken', { token })

        // Update the user.
        await this.$store.dispatch('auth/updateUser', { user: data })

        form.reset()

        // Redirect home.
        this.$router.push({ name: 'welcome' })
      } catch (e) {

      }
    }
  }
}
</script>
