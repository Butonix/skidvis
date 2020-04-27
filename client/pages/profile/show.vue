<template>
  <div class="container profile-show mt-3">
    <div class="profile-show__form">
      <div class="mb-4 pb-3 profile-show__form__avatar photo-input--icon-white">
        <thumb-file-input
          :image="form.avatar"
          :loading="loadingAvatar"
          :width="51"
          :height="51"
          @delete="onDeleteAvatar()"
          @change="onChangeAvatar($event.image)"
        />
        <div class="pt-2">
          Аватар
        </div>
      </div>
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
        type="tel"
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
        form-class="mb-5"
      />

      <div class="mb-4">
        <v-button
          :block="true"
          :loading="form.busy"
          type="outline-primary"
          @click="onSave"
        >
          Сохранить
        </v-button>
      </div>
    </div>

  </div>
</template>

<script>
import { getFavicon } from '~/utils'
import { cloneDeep } from 'lodash'
import axios from 'axios'
import Form from 'vform'

export default {
  components: {
    'MaterialInput': () => import('~/components/Edit/Inputs/MaterialInput'),
    'ThumbFileInput': () => import('~/components/Edit/ThumbsFileInput/Thumb')
  },
  middleware: ['auth'],
  head () {
    return {
      title: 'Профиль',
      bodyAttrs: {
        class: 'theme-default' + (' ' + this.$store.getters['variables/getBlackClass'])
      },
      ...getFavicon()
    }
  },
  asyncData: async ({ params, error, app }) => {
    let user = app.store.getters['auth/user']
    let avatar = {
      src: user.avatar.src
    }
    let form = cloneDeep(user)

    return {
      avatar,
      form
    }
  },
  data: () => ({
    loadingAvatar: false
  }),

  async beforeMount () {
    if (!(this.form instanceof Form)) {
      this.form = new Form(this.form)
    }
  },
  methods: {
    async onSave () {
      try {
        await this.form.patch('settings/profile')
        await this.$callToast({
          type: 'success',
          text: 'Данные успешно сохранены'
        })
      } catch (e) {
        await this.$callToast({
          type: 'error',
          text: 'Сохранить не удалось'
        })
        console.log(e)
      }
      await this.$store.dispatch('auth/fetchUser')
    },
    onDeleteAvatar () {
      this.form.avatar.src = null
      this.$delete(this.form.avatar, 'id')
      this.avatar = null
    },
    async onChangeAvatar (image) {
      this.avatar = {
        src: image
      }
      this.loadingAvatar = true
      try {
        let { data } = await axios.post('settings/avatar', {
          image: image
        })
        if (!data.image || !data.image.src || !data.image.id) {
          throw new Error()
        }
        this.form.avatar.src = data.image.src
        this.form.avatar.id = data.image.id
        this.loadingAvatar = false
      } catch (e) {
        console.log(e)
        this.avatar = null
        this.loadingAvatar = false
        await this.$callToast({
          type: 'error',
          text: 'Загрузить аватар не удалось'
        })
      }
    }
  }
}
</script>

<style>
</style>
