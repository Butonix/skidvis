<template>
  <form
    class="row"
    @submit.prevent @keydown="form.onKeydown($event)">
    <div class="col-12 text-center">
      <h5>
        Восстановление пароля
      </h5>
      <div class="font-weight-light mb-3">
        Впишите адрес эл. почты, указанный при регистрации
        <br class="d-none d-md-block">
        и мы отправим ссылку на изменение пароля
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
      </div>

    </div>
  </form>
</template>

<script>
import Form from 'vform'

export default {
  components: {
    'MaterialInput': () => import('~/components/Edit/Inputs/MaterialInput')
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

        await this.$callToast({
          type: 'success',
          text: 'На вашу эл. почту отправили сообщение с подтверждением'
        })

        this.$emit('success')
      } catch (e) {

      }
    }
  }
}
</script>
