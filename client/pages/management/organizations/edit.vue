<template>
  <form v-if="form" class="organizations-edit"
        @submit.prevent @keydown="form.onKeydown($event)">
    <full-slider
      v-if="images"
      :images="images"
    />
    <div class="overflow-hidden">
      <div class="container">
        <thumbs-file-input
          v-if="images"
          :images="images"
          @change="setMainImage"
          @delete="deleteMainImage"
        />
        <div class="row justify-content-center">
          <div class="col-lg-8 organizations-edit__editor">

            <div class="row mt-xl-3">
              <div class="col">

                <div
                  class="row">
                  <div class="col-sm">
                    <div class="organizations-edit__logo">
                      <div class="text-center small pb-2">
                        Логотип организации
                      </div>
                      <div
                        :style="{color:form.logo.color || '#ffffff'}"
                        class="organizations-edit__logo-file-input">
                        <logo-file-input
                          :src="logo"
                          @change="setLogoSrc"
                          @delete="deleteLogo"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="col-sm-auto d-flex d-md-none flex-column">
                    <div class="text-center small pb-2 pt-4 pt-sm-0">
                      Цвет заливки логотипа
                    </div>
                    <div class="color-box__wrapper">
                      <div
                        :style="{backgroundColor: form.logo.color || '#ffffff'}"
                        :class="{'active':isActiveClassColorBox}"
                        class="color-box" @click="isActiveClassColorBox = !isActiveClassColorBox"
                      />
                      <div class="color-box__close" @click="isActiveClassColorBox = !isActiveClassColorBox"/>
                      <no-ssr>
                        <sketch-picker :value="form.logo.color || '#ffffff'" class="mx-auto" @input="setLogoColor" />
                      </no-ssr>
                    </div>
                  </div>
                </div>
                <material-input
                  v-model="form.link"
                  form-class="mb-4"
                  placeholder="Ссылка на ваш сайт"
                />
                <material-input
                  v-model="form.name"
                  placeholder="Введите название компании"
                />
                <material-input
                  v-model="form.inn"
                  placeholder="ИНН"
                />
              </div>
              <div class="col-auto d-none d-md-block">
                <div class="text-center small pb-2">
                  Цвет заливки логотипа
                </div>
                <no-ssr>
                  <sketch-picker :value="form.logo.color || '#ffffff'" @input="setLogoColor" />
                </no-ssr>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-lg-8 organizations-edit__editor">
          <material-textarea
            v-model="form.description"
            name="link"
            placeholder="Почему к вам стоит прийти?"
            data-align="center"
            form-class="my-5"
          />
          <social-links
            :links="form.socials"
            @change="changeSocialsLink"
            @add="addSocialsLink"
            @delete="deleteSocialsLink"
          />
        </div>
      </div>
      <div class="row">
        <div class="col-lg-6 mx-auto">
          <div class="row mt-5 mb-4">
            <div class="col-4 col-lg-4 col-xl-3">
              Часовой пояс
            </div>
            <div class="col-6 col-lg-6 col-xl-6">
              <v-select :clearable="false" v-model="form.timezone" :reduce="item => item.value" :options="getTimezones" label="label"/>
            </div>
          </div>
          <div v-for="(value, index) in form.operationMode" class="row">
            <div class="col-lg-4 col-xl-3 d-flex align-items-center py-1">
              {{ operationMode.data[index].label }}
            </div>
            <div class="col-lg-6 col-xl-7 py-1">
              <v-select
                :clearable="false"
                v-model="value.start"
                :options="operationMode.interval"
                class="v-select--time mr-2"
              />
              <v-select
                :clearable="false"
                v-model="value.end"
                :options="operationMode.interval"
                class="v-select--time mr-5"
              />
              <div class="d-inline-block">
                <checkbox v-model="value.active" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="text-center mt-5">
        <div
          class="btn btn-outline-primary"
          @click="onSave"
        >
          Сохранить
        </div>
        <div
          v-if="id"
          class="btn btn-outline-danger ml-2"
          @click="onDelete"
        >
          Удалить
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import Form from 'vform'
import FullSlider from '~/components/FullSlider'
import ThumbsFileInput from '~/components/Edit/ThumbsFileInput'
import SocialLinks from '~/components/Edit/SocialLinks'
import MaterialInput from '~/components/Edit/Inputs/MaterialInput'
import MaterialTextarea from '~/components/Edit/Inputs/MaterialTextarea'
import LogoFileInput from '~/components/Edit/LogoFileInput'
import mixinSwal from '~/mixins/sweetalert2'
import axios from 'axios'
import vSelect from 'vue-select'

export default {
  components: {
    MaterialTextarea,
    FullSlider,
    ThumbsFileInput,
    LogoFileInput,
    MaterialInput,
    vSelect,
    SocialLinks
  },
  mixins: [mixinSwal],
  head () {
    return {
      title: 'Редактирование организации',
      bodyAttrs: {
        class: 'theme-edit'
      }
    }
  },
  middleware: 'auth',
  asyncData: async ({ params, error, app }) => {
    let operationMode = {}
    let form, logo
    let images = []

    await app.store.dispatch('variables/fetchTimezones')

    let timezone = app.store.getters['variables/getDefaultTimezone']
    let organizationId = params.organizationId

    app.store.getters['variables/getDaysOfTheWeek'].forEach((value) => {
      operationMode[value] = { ...app.store.getters['variables/getDefaultTimeSelect'] }
    })
    if (organizationId) {
      try {
        let { data } = await axios.get('management/organizations/' + organizationId)
        logo = data.organization.logo.src
        images = data.organization.images
        if (data.organization.operationMode) {
          operationMode = data.organization.operationMode
        }
        console.log(data.organization)
        if (data.organization.timezone) {
          timezone = data.organization.timezone
        }
        form = { ...data.organization, operationMode, timezone }
      } catch (e) {
        error({ statusCode: 404, message: 'Organization not found' })
      }
    }

    if (!form) {
      form = {
        operationMode,
        images: [],
        timezone,
        link: '',
        name: '',
        inn: '',
        description: '',
        logo: {
          color: '#FFFFFF',
          src: ''
        },
        socials: []
      }
    }

    return {
      id: organizationId,
      selected: '1',
      yourValue: '',
      isActiveClassColorBox: false,
      operationMode: { ...app.store.getters['variables/getOperationMode'] },
      images,
      logo,
      form
    }
  },

  computed: {
    ...mapGetters({
      getTimezones: 'variables/getTimezones'
    })
  },

  async beforeMount () {
    if (!(this.form instanceof Form)) {
      this.form = new Form(this.form)
    }
    this.fetchTimezones()
  },
  methods: {
    ...mapActions({
      fetchTimezones: 'variables/fetchTimezones'
    }),
    addSocialsLink (link) {
      this.form.socials.push(link)
    },
    setLogoColor (value) {
      this.form.logo.color = `rgba(${value.rgba.r}, ${value.rgba.g}, ${value.rgba.b}, ${value.rgba.a})`
    },
    async setLogoSrc (logo) {
      this.logo = logo
      try {
        let { data } = await axios.post('management/organizations/logo', {
          logo
        })
        console.log(data)
        this.form.logo.src = data.logo.src
        this.form.logo.id = data.logo.id
      } catch (e) {
        this.logo = null
      }
    },
    async setMainImage ({ image, index }) {
      if (index !== undefined && this.images[index]) {
        this.$set(this.images, index, {
          src: image
        })
      } else {
        this.images.push({
          src: image
        })
      }
      try {
        let { data } = await axios.post('management/organizations/image', {
          cover: image
        })
        image = data.mainImages

        if (index !== undefined && this.form.images[index]) {
          this.$set(this.form.images, index, image)
        } else {
          this.form.images.push(image)
        }
      } catch (e) {
        console.log('catch')
        if (index !== undefined && this.images[index]) {
          this.$delete(this.images, index)
        } else {
          this.$delete(this.images, this.images.length - 1)
        }
      }
    },
    deleteLogo () {
      this.form.logo.src = ''
      this.$delete(this.form.logo, 'id')
      this.logo = ''
    },
    deleteMainImage ({ index }) {
      this.$delete(this.images, index)
      this.$delete(this.form.images, index)
    },
    deleteSocialsLink (index) {
      console.log(index)
      this.$delete(this.form.socials, index)
    },
    changeSocialsLink ({ index, value }) {
      this.$set(this.form.socials, index, value)
    },
    async onDelete () {
      if (!this.id) {
        return
      }
      let res = await this.$confirmDelete()
      if (res.value) {
        try {
          let { data } = await axios.delete('management/organizations/' + this.id)
          // await this.$callToast({
          //   type: 'success',
          //   text: 'Организация успешно удалена',
          //   timer: 1000
          // })
          this.$router.push({ name: 'management.organizations.index' })
        } catch (e) {
          await this.$callToast({
            type: 'error',
            text: 'Удалить не удалось'
          })
        }
      }
    },
    async onSave () {
      try {
        if (this.id) {
          const { data } = await this.form.patch('management/organizations/' + this.id)
          console.log('onSave', data)
        } else {
          const { data } = await this.form.post('management/organizations')
          console.log('onSave', data)
          this.id = data.organization.id
          this.$router.push({ name: 'management.organizations.edit', params: { organizationId: data.organization.id } })
        }
        await this.$callToast({
          type: 'success',
          text: 'Данные успешно сохранены'
        })
      } catch (e) {
        await this.$callToast({
          type: 'error',
          text: 'Сохранить не удалось'
        })
      }
      // this.$modal.push('example')
    }
  }
}
</script>

<style>
  .organizations-edit__logo-file-input .picture-preview{
    background-color: currentColor!important;
  }
</style>
