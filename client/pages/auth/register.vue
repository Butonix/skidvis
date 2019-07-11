<template>
  <div class="container pt-3">
    <div class="row">
      <form class="custom-col login-col mx-auto"
            @submit.prevent @keydown="form.onKeydown($event)">
        <h5 class="text-center">
          Регистрация
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
            @click="register">
            Войти
          </v-button>
        </div>
        <div class="text-center">
          <router-link :to="{ name: 'login' }" class="btn btn-gray btn-sm">
            <&nbsp;Назад
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
    return { title: this.$t('register') }
  },
  components: {
    MaterialInput,
    Social
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

        // Redirect home.
        this.$router.push({ name: 'home' })
      }catch (e) {

      }
    }
  }
}
</script>
