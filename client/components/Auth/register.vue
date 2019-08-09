<template>
  <form
    autocomplete="on"
    @submit.prevent @keydown="form.onKeydown($event)">
    <h5 class="text-center">
      Регистрация
    </h5>
    <div class="text-center font-weight-light mb-3">
      Через социальные сети
    </div>
    <login-with-social :store="store" :route="route" :router="router"/>
    <div class="text-center font-weight-light mb-4">
      Или заполните форму
    </div>
    <div class="mb-5">
      <material-input
        :autofocus="true"
        v-model="form.l_name"
        :form="form"
        field="l_name"
        type-input="inline"
        placeholder="Фамилия"
        form-class="mb-4"
      />
      <material-input
        v-model="form.f_name"
        :form="form"
        field="f_name"
        type-input="inline"
        placeholder="Имя"
        form-class="mb-4"
      />
      <material-input
        v-model="form.m_name"
        :form="form"
        field="m_name"
        type-input="inline"
        placeholder="Отчество"
        form-class="mb-4"
      />
      <material-input
        v-model="form.phone"
        type="tel"
        :form="form"
        field="phone"
        type-input="inline"
        placeholder="Телефон"
        form-class="mb-4"
      />
      <material-input
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

      <material-input
        v-model="form.password_confirmation"
        :form="form"
        type="password"
        field="password_confirmation"
        type-input="inline"
        placeholder="Повторите пароль"
        form-class="mb-4"
      />
    </div>
    <div class="mb-4">
      <v-button
        :block="true"
        :loading="form.busy"
        type="outline-primary"
        @click="$emit('register', form)"
      >
        Войти
      </v-button>
    </div>
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
    },
    route: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    form: new Form({
      l_name: '',
      f_name: '',
      m_name: '',
      phone: '',
      email: '',
      password: '',
      password_confirmation: ''
    })
  }),

  methods: {
    async register () {
      try {
        // Register the user.
        const { data } = await this.form.post('/register')

        // Log in the user.
        const { data: { token } } = await this.form.post('/login')

        // Save the token.
        this.$store.dispatch('auth/saveToken', { token })

        // Update the user.
        await this.$store.dispatch('auth/updateUser', { user: data })

        // Redirect welcome.
        this.$router.push({ name: 'welcome' })

        this.$emit('success')
      } catch (e) {

      }
    }
  }
}
</script>
