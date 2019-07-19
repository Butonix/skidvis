<template>
  <div class="container pt-3">
    <form class="row"
          @submit.prevent @keydown="form.onKeydown($event)">
      <div class="col-12 text-center">
        <h5>
          Восстановление пароля
        </h5>
        <div class="font-weight-light mb-3">
          Укажите новый пароль
        </div>
      </div>
      <div class="custom-col login-col mx-auto">
        <div class="mb-5">
          <material-input
            :readonly="true"
            v-model="form.email"
            :form="form"
            field="email"
            type-input="inline"
            placeholder="Эл. почта"
            form-class="mb-4"
          />
          <material-input
            :autofocus="true"
            v-model="form.password"
            :form="form"
            field="password"
            type="password"
            type-input="inline"
            placeholder="Пароль"
            form-class="mb-4"
          />
          <material-input
            v-model="form.password_confirmation"
            :form="form"
            field="confirm_password"
            type="password"
            type-input="inline"
            placeholder="Повторите пароль"
            form-class="mb-4"
          />
        </div>

        <div class="text-center">
          <v-button
            :block="true"
            :loading="form.busy"
            type="outline-primary"
            @click="reset"
          >
            Восстановить пароль
          </v-button>
          <router-link v-if="status === ''" :to="{ name: 'password.request' }" class="btn btn-gray btn-sm mt-4">
            <&nbsp;Назад
          </router-link>
          <router-link v-else :to="{ name: 'login' }" class="btn btn-gray btn-sm mt-4">
            <&nbsp;Вход
          </router-link>
        </div>

      </div>
    </form>
  </div>
</template>

<script>
import Form from 'vform'

export default {
  components: {
    'MaterialInput': () => import('~/components/Edit/Inputs/MaterialInput')
  },
  head () {
    return { title: this.$t('reset_password') }
  },
  middleware: 'authRoutes',
  data: () => ({
    status: '',
    form: new Form({
      token: '',
      email: '',
      password: '',
      password_confirmation: ''
    })
  }),

  created () {
    this.form.email = this.$route.query.email
    this.form.token = this.$route.params.token
  },

  methods: {
    async reset () {
      try {
        const { data } = await this.form.post('/password/reset')

        this.status = data.status

        this.form.reset()

        await this.$callToast({
          type: 'success',
          text: 'Вы успешно сбросили пароль'
        })
      } catch (e) {
        console.log(this.form);
      }
    }
  }
}
</script>
