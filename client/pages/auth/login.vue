<template>
  <div class="container pt-3">
    <div class="row">
      <form class="custom-col login-col mx-auto" autocomplete="on"
            @submit.prevent @keydown="form.onKeydown($event)">
        <h5 class="text-center">
          Вход
        </h5>
        <div class="text-center font-weight-light mb-3">
          Через социальные сети
        </div>
        <div class="text-center mb-5">
          <social
            type="vk"
            class-box="social-icon-lg"
          />
          <social
            type="ok"
            class-box="social-icon-lg mx-2"
          />
          <social
            type="facebook"
            class-box="social-icon-lg"
          />
        </div>
        <div class="text-center font-weight-light mb-4">
          С паролем
        </div>
        <div class="mb-4">

          <material-input
            :autofocus="true"
            v-model="form.email"
            :form="form"
            field="email"
            type-input="inline"
            placeholder="Эл. почта"
            form-class="mb-4"
          />

          <material-input
            v-model="form.password"
            :form="form"
            type="password"
            field="password"
            type-input="inline"
            placeholder="Пароль"
            form-class="mb-4"
          />

          <checkbox v-model="remember" name="remember">
            Запомни меня
          </checkbox>
        </div>

        <div class="text-center">
          <v-button
            :block="true"
            :loading="form.busy"
            type="outline-primary"
            @click="login"
          >
            Войти
          </v-button>
          <br>
          <router-link :to="{ name: 'password.request' }" class="btn btn-link">
            Забыл пароль
          </router-link>
          <br>
          <router-link :to="{ name: 'register' }" class="btn btn-link">
            Зарегистрироваться
          </router-link>
        </div>

      </form>
    </div>
  </div>
</template>

<script>
import Form from 'vform'
import Social from '~/components/Icons/Social'
import MaterialInput from '~/components/Edit/Inputs/MaterialInput'

export default {
  head () {
    return { title: this.$t('login') }
  },
  middleware: 'authRoutes',
  components: {
    Social,
    MaterialInput
  },
  data: () => ({
    form: new Form({
      email: '',
      password: ''
    }),
    remember: false
  }),

  methods: {
    async login () {
      try {
        // Submit the form.
        const { data } = await this.form.post('/login')

        // Save the token.
        this.$store.dispatch('auth/saveToken', {
          token: data.token,
          remember: this.remember
        })

        // Fetch the user.
        await this.$store.dispatch('auth/fetchUser')

        // Redirect home.
        this.$router.push({ name: 'home' })
      } catch (e) {

      }
    }
  }
}
</script>
