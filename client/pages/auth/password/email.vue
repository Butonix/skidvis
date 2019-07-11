<template>
  <div class="container pt-3">
    <form class="row"
          @submit.prevent @keydown="form.onKeydown($event)">
      <div class="col-12 text-center">
        <h5>
          Восстановление пароля
        </h5>
        <div class="font-weight-light mb-3">
          Впишите адрес эл. почты, указанный при регистрации
          <br class="d-none d-md-block">
          и мы отправим новый пароль
        </div>
      </div>
      <div class="custom-col login-col mx-auto">
        <div class="mb-5">
          <material-input
            :autofocus="true"
            v-model="form.email"
            :form="form"
            field="email"
            type-input="inline"
            placeholder="Эл. почта"
            form-class="mb-4"
          />
        </div>

        <div class="text-center">
          <v-button
            :block="true"
            :loading="form.busy"
            type="outline-primary"
            @click="send"
          >
            Восстановить пароль
          </v-button>
          <router-link :to="{ name: 'login' }" class="btn btn-gray btn-sm mt-4">
            <&nbsp;Назад
          </router-link>
        </div>

      </div>
    </form>
  </div>
</template>

<script>
import Form from 'vform'
import MaterialInput from '~/components/Edit/Inputs/MaterialInput'

export default {
  head () {
    return { title: this.$t('reset_password') }
  },
  components: {
    MaterialInput
  },
  data: () => ({
    status: '',
    form: new Form({
      email: ''
    })
  }),

  methods: {
    async send () {
      try {
        const { data } = await this.form.post('/password/email')

        this.status = data.status

        this.form.reset()
      } catch (e) {

      }
    }
  }
}
</script>
