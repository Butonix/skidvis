<template>
  <form
    autocomplete="on"
    @submit.prevent @keydown="form.onKeydown($event)">
    <h5 class="text-center">
      Вход
    </h5>
    <div class="text-center font-weight-light mb-3">
      Через социальные сети
    </div>
    <login-with-social :store="store" :router="router"/>
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

    <v-button
      :block="true"
      :loading="form.busy"
      type="outline-primary"
      class="mx-auto"
      @click="$emit('login', form)"
    >
      Войти
    </v-button>
  </form>
</template>

<script>
import Form from 'vform'

export default {
  components: {
    'LoginWithSocial': () => import('~/components/Auth/LoginWithSocial'),
    'MaterialInput': () => import('~/components/Edit/Inputs/MaterialInput')
  },
  props: {
    store: {
      type: Object,
      required: true
    },
    router: {
      type: Object,
      required: true
    }
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

        // Redirect welcome.
        // this.$router.push({ name: 'welcome' })

        this.$emit('success')
      } catch (e) {
        console.log(e)
      }
    }

  }
}
</script>
