<template>
  <modal name="login" @closed="closeModalLogin">
    <div class="modal--login">
      <div :class="{'d-none': (slide !== 'login')}">
        <login :store="$store" :route="$route" :router="$router" @login="login"/>
        <div class="text-center">
          <div class="btn btn-link" @click="slide = 'password'">
            Забыл пароль
          </div>
          <br>
          <div class="btn btn-link" @click="slide = 'register'">
            Зарегистрироваться
          </div>
        </div>
      </div>
      <div :class="{'d-none': (slide !== 'register')}">
        <register :store="$store" :route="$route" :router="$router" @register="register"/>
        <div class="text-center">
          <div class="btn btn-gray btn-sm" @click="slide = 'login'">
            <&nbsp;Назад
          </div>
        </div>
      </div>
      <div :class="{'d-none': (slide !== 'password')}">
        <password @success="slide = 'login'"/>
        <div class="text-center pt-4">
          <div class="btn btn-gray btn-sm" @click="slide = 'login'">
            <&nbsp;Назад
          </div>
        </div>
      </div>
    </div>
  </modal>
</template>

<script>

export default {
  components: {
    'login': () => import('~/components/Auth/login'),
    'register': () => import('~/components/Auth/register'),
    'password': () => import('~/components/Auth/password/email')
  },
  data: () => ({
    slide: 'login'
  }),
  methods: {
    closeModalLogin () {
      this.slide = 'login'
    },
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

        this.slide = 'login'
      } catch (e) {
        console.log(e)
      }
    },
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

        this.$modal.pop()

        if (this.$route.name === 'login' || this.$route.name === 'register' ||
          this.$route.name === 'password.request' || this.$route.name === 'password.reset') {
          this.$router.push({ name: 'welcome' })
        }
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style>
</style>
