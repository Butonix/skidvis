<template>
  <div v-click-outside="onClickOutside"
       :class="{'active': active}"
       class="contacts__form"
       @mouseenter="mouseenter"
       @mouseleave="mouseleave">
    <div
      :class="{'btn-loading':form.busy || false}"
      class="btn btn-outline-primary mb-2 px-5"
      @click="onClick">
      Перезвоните мне
    </div>
    <div class="contacts__form__wrapper">
      <div class="contacts__form__box text-left">
        <material-input
          v-model="form.name"
          :form="form"
          field="name"
          type-input="inline"
          placeholder="Имя"
          form-class="mb-4"
        />
        <material-input
          v-model="form.phone"
          :form="form"
          type="tel"
          field="phone"
          type-input="inline"
          placeholder="Телефон"
          form-class="mb-0"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Form from 'vform'

export default {
  components: {
    'MaterialInput': () => import('~/components/Edit/Inputs/MaterialInput')
  },
  props: {
    typeId: {
      type: Number,
      default: 1
    },
    isActive: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    actived: false,
    active: false,
    form: {
      typeId: 1,
      name: '',
      phone: ''
    }
  }),
  beforeMount () {
    this.form.typeId = this.typeId
    if (!(this.form instanceof Form)) {
      this.form = new Form(this.form)
    }
    if (this.isActive) {
      this.active = true
      this.actived = true
    }
  },
  methods: {
    mouseenter () {
      this.active = true
      setTimeout(() => { this.actived = true }, 400)
    },
    mouseleave () {
      this.active = false
      this.actived = false
    },
    async send () {
      try {
        let { data } = await this.form.post('feedbacks')
        this.form.reset()
        if (data.alert) {
          await this.$callToast(data.alert)
        }
      } catch (e) {
        await this.$callToast({
          type: 'error',
          text: 'Отправить не удалось'
        })
        console.log(e)
      }
    },
    async onClick () {
      if (this.actived) {
        await this.send()
      }
      this.active = true
      this.actived = true
    },
    onClickOutside () {
      this.active = false
    }
  }
}
</script>

<style>

</style>
