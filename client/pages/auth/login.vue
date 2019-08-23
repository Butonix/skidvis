<template>
  <div class="container pt-3">
    <div class="row">
      <div class="custom-col login-col mx-auto">
        <login :store="$store" :route="$route" :router="$router" @login="login"/>
        <div class="text-center mt-4">
          <router-link :to="{ name: 'password.request' }" class="btn btn-link">
            Забыл пароль
          </router-link>
          <br>
          <router-link :to="{ name: 'register' }" class="btn btn-link">
            Зарегистрироваться
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getFavicon } from '~/utils'

export default {
  head () {
    return {
      title: 'Вход',
      ...getFavicon()
    }
  },
  middleware: ['authRoutes', 'reactData'],
  components: {
    'login': () => import('~/components/Auth/login')
  },

  methods: {
    async login (form) {
      try {
        // Submit the form.
        const { data } = await form.post('/login')

        // Save the token.
        this.$store.dispatch('auth/saveToken', {
          token: data.token,
          remember: this.remember
        })

        // Fetch the user.
        await this.$store.dispatch('auth/fetchUser')

        form.reset()

        // Redirect welcome.
        this.$router.push({ name: 'welcome' })
      } catch (e) {
        console.log(e)
      }
    }

  }
}
</script>
