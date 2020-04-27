<template>
  <div>
    <form v-if="form" class="orgs-edit"
          @submit.prevent @keydown="form.onKeydown($event)">
      <div class="orgs-edit__slider">
        <full-slider
          v-if="images"
          :is-edit="true"
          :images="images"
          @clickfirstslide="clickFirstSlide"
        />
      </div>
      <div class="overflow-hidden">
        <div class="container">
          <thumbs-file-input
            v-if="images"
            :images="images"
            :images-loading="imagesLoading"
            class="js-thumbs-file-input"
            @change="setMainImage"
            @delete="deleteMainImage"
          />
          <client-only>
            <div v-if="form && form.errors" :class="{ 'is-invalid': form.errors.has('images') }">
              <has-error :form="form" field="images"/>
            </div>
          </client-only>
          <div class="row justify-content-center">
            <div class="col-lg-8 orgs-edit__editor">

              <div class="row mt-xl-3">
                <div class="col">

                  <div
                    class="row">
                    <div class="col-sm">
                      <div class="orgs-edit__logo">
                        <div class="text-center small pb-2">
                          Логотип организации
                        </div>
                        <div
                          :style="{color:form.logo.color || '#ffffff'}"
                          class="orgs-edit__logo-file-input">
                          <logo-file-input
                            :src="logo"
                            :loading="logoLoading"
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
                        <client-only>
                          <sketch-picker :value="form.logo.color || '#ffffff'" class="mx-auto" @input="setLogoColor" />
                        </client-only>
                      </div>
                    </div>
                  </div>
                  <material-input
                    v-model="form.link"
                    :form="form"
                    field="link"
                    form-class="mb-4"
                    placeholder="Ссылка на ваш сайт"
                  />
                  <material-input
                    v-model="form.name"
                    :form="form"
                    field="name"
                    placeholder="Введите название компании"
                  />
                  <material-input
                    v-model="form.inn"
                    :form="form"
                    field="inn"
                    placeholder="ИНН"
                  />
                </div>
                <div class="col-auto d-none d-md-block">
                  <div class="text-center small pb-2">
                    Цвет заливки логотипа
                  </div>
                  <client-only>
                    <sketch-picker :value="form.logo.color || '#ffffff'" @input="setLogoColor" />
                  </client-only>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-8 orgs-edit__editor">

            <div class="row">
              <div class="col-lg-6">
                <material-input
                  v-model="form.phone"
                  :form="form"
                  type="tel"
                  field="phone"
                  placeholder="Телефон"
                />
              </div>
              <div class="col-lg-6">
                <material-input
                  v-model="form.email"
                  :form="form"
                  field="email"
                  placeholder="Эл. почта"
                />
              </div>
            </div>

            <material-textarea
              v-model="form.description"
              :form="form"
              field="description"
              placeholder="Почему к вам стоит прийти?"
              data-align="center"
              form-class="mt-5 mb-4"
            />

            <div class="row">
              <div class="col-12 col-xs">
                <p v-if="form.type_map_point === 1" class="text-center">
                  <org-demo-map-point class="d-inline-block mb-1"/>
                  <br>
                  Размещайте логотип в точке на карте. <br class="d-none d-xs-block">
                  <router-link :to="{ name: 'contacts' }" @click.native="$sTB()">Пишите</router-link>
                  и мы откроем доступ <br class="d-none d-xs-block">
                  на загрузку логотипа.
                </p>
                <div v-else class="text-center">
                  <div class="orgs-edit__map-point mb-1">
                    <div class="orgs-edit__mini-logo">
                      <logo-file-input
                        :width="64"
                        :height="64"
                        :crop="true"
                        :src="miniLogo"
                        :loading="miniLogoLoading"
                        @change="setMiniLogoSrc"
                        @delete="deleteMiniLogo"
                      />
                    </div>
                  </div>
                  <div v-if="miniLogoError" class="text-danger mb-1 small" v-html="miniLogoError"/>
                  <p v-html="miniLogo?'Мини логотип (64x64) загружен.':'Вы можете загрузить <br>мини логотип (64x64).'"/>
                </div>
              </div>
            </div>

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
            <div v-for="(value, index) in form.operationMode" :key="index" class="row">
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
          <template v-if="organizationId">
            <div v-if="form.is_published" class="btn btn-outline-danger mx-1 mb-2"
                 @click="onUnpublish"
            >
              Снять с публикации
            </div>
            <div v-else class="btn btn-outline-success mx-1 mb-2"
                 @click="onPublish"
            >
              Опубликовать
            </div>
          </template>
          <div
            class="btn btn-outline-primary mx-1 mb-2"
            @click="onSave"
          >
            Сохранить
          </div>
          <div
            v-if="organizationId"
            class="btn btn-outline-danger mx-1 mb-2"
            @click="onDelete"
          >
            Удалить
          </div>
        </div>
      </div>
    </form>

    <div v-if="organizationId" class="container pt-5">
      <div class="d-flex align-items-center justify-content-center h-100">
        <router-link
          :to="{ name: 'management.organizations.points.index', params: { organizationId } }"
          class="btn btn-gray btn-sm px-4 mr-2"
          @click.native="$sTB()">
          <span class="px-2">Адреса</span>
        </router-link>
        <router-link
          :to="{ name: 'management.organizations.products.index', params: { organizationId } }"
          class="btn btn-gray btn-sm px-4"
          @click.native="$sTB()">
          <span class="px-2">Акции</span>
        </router-link>
      </div>
      <div v-if="isSuperAdministrator" class="d-flex justify-content-around mt-3">
        <router-link
          :to="{ name: 'management.organizations.services', params: { organizationId } }"
          class="btn btn-gray btn-sm px-4 px-lg-3 px-xl-4"
          @click.native="$sTB()">
          <span class="px-2">Платные сервисы</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { getFavicon } from '~/utils'
import { cloneDeep } from 'lodash'
import { mapActions, mapGetters } from 'vuex'
import Form from 'vform'
import axios from 'axios'

export default {
  components: {
    'OrgDemoMapPoint': () => import('~/components/Icons/OrgDemoMapPoint'),
    'MaterialTextarea': () => import('~/components/Edit/Inputs/MaterialTextarea'),
    'FullSlider': () => import('~/components/FullSlider'),
    'ThumbsFileInput': () => import('~/components/Edit/ThumbsFileInput'),
    'LogoFileInput': () => import('~/components/Edit/LogoFileInput'),
    'MaterialInput': () => import('~/components/Edit/Inputs/MaterialInput'),
    'vSelect': () => import('vue-select'),
    'SocialLinks': () => import('~/components/Edit/SocialLinks')
  },
  head () {
    return {
      title: 'Редактирование организации',
      bodyAttrs: {
        class: 'theme-business navbar-fixed theme-management'
      },
      ...getFavicon('business')
    }
  },
  middleware: ['auth'],
  asyncData: async ({ params, error, app }) => {
    let form, logo, miniLogo
    let images = []

    await app.store.dispatch('variables/fetchTimezones')

    let operationMode = app.store.getters['variables/getDefaultOperationModeSelected']
    let timezone = app.store.getters['variables/getDefaultTimezone']
    let organizationId = params.organizationId

    if (organizationId) {
      try {
        let { data } = await axios.get('management/organizations/' + organizationId + '/edit')
        logo = data.organization.logo.src
        miniLogo = data.organization.mini_logo.src
        images = cloneDeep(data.organization.images)
        if (data.organization.operationMode) {
          operationMode = data.organization.operationMode
        }
        if (data.organization.timezone) {
          timezone = data.organization.timezone
        }
        form = { ...data.organization, operationMode, timezone }
      } catch (e) {
        error({ statusCode: e.response.status })
      }
    }

    if (!form) {
      form = {
        operationMode,
        images: [],
        timezone,
        is_published: false,
        type_map_point: 1,
        link: '',
        name: '',
        phone: null,
        email: null,
        inn: '',
        description: '',
        short_description: '',
        logo: {
          color: '#FFFFFF',
          src: ''
        },
        mini_logo: {
          src: ''
        },
        socials: []
      }
    }

    return {
      organizationId,
      operationMode: { ...app.store.getters['variables/getOperationMode'] },
      images,
      logo,
      miniLogo,
      form
    }
  },

  data: () => ({
    miniLogoError: '',
    isActiveClassColorBox: false,
    logoLoading: false,
    miniLogoLoading: false,
    imagesLoading: {}
  }),

  computed: {
    ...mapGetters({
      isSuperAdministrator: 'auth/isSuperAdministrator',
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
    clickFirstSlide () {
      try {
        let input = document.querySelector('.js-thumbs-file-input .picture-preview')
        if (input) {
          input.click()
        }
      } catch (e) {
      }
    },
    addSocialsLink (link) {
      this.form.socials.push(link)
    },
    setLogoColor (value) {
      this.form.logo.color = `rgba(${value.rgba.r}, ${value.rgba.g}, ${value.rgba.b}, ${value.rgba.a})`
    },
    async setLogoSrc (logo) {
      this.logo = logo
      this.logoLoading = true
      try {
        let { data } = await axios.post('management/organizations/logo', {
          image: logo
        })
        if (!data.image || !data.image.src || !data.image.id) {
          throw new Error()
        }
        this.form.logo.src = data.image.src
        this.form.logo.id = data.image.id
        this.logoLoading = false
      } catch (e) {
        this.logo = null
        this.logoLoading = false
        await this.$callToast({
          type: 'error',
          text: 'Загрузить изображение не удалось'
        })
      }
    },
    async setMiniLogoSrc (logo) {
      if (logo) {
        let vm = this
        vm.miniLogo = logo
        let image = new Image()

        image.onload = function () {
          setTimeout(async () => {
            try {
              if (this.width !== 64 || this.height !== 64) {
                vm.miniLogoError = 'Загрузите изображение 64x64. <br>Размеры данного изображение ' + this.width + 'x' + this.height
                vm.$set(vm, 'miniLogo', null)
              }
              if (this.width !== 64) {
                return true
              }
              if (this.height !== 64) {
                return true
              }
            } catch (e) {
              console.log(e)
            }

            vm.miniLogoError = ''
            vm.miniLogoLoading = true
            try {
              let { data } = await axios.post('management/organizations/mini-logo', {
                image: logo
              })
              if (!data.image || !data.image.src || !data.image.id) {
                throw new Error()
              }
              vm.form.mini_logo.src = data.image.src
              vm.form.mini_logo.id = data.image.id
              vm.miniLogoLoading = false
            } catch (e) {
              vm.$set(vm, 'miniLogo', null)
              vm.miniLogoLoading = false
              await this.$callToast({
                type: 'error',
                text: 'Загрузить изображение не удалось'
              })
            }
          }, 100)
        }

        image.src = logo
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
      this.$set(this.imagesLoading, index, true)
      try {
        let { data } = await axios.post('management/organizations/image', {
          image: image
        })

        if (!data.image || !data.image.src || !data.image.id) {
          throw new Error()
        }

        image = data.image

        if (index !== undefined && this.form.images[index]) {
          this.$set(this.form.images, index, image)
        } else {
          this.form.images.push(image)
        }
        this.$set(this.imagesLoading, index, false)
      } catch (e) {
        if (index !== undefined && this.images[index]) {
          this.$delete(this.images, index)
        } else {
          this.$delete(this.images, this.images.length - 1)
        }
        this.$set(this.imagesLoading, index, false)
        await this.$callToast({
          type: 'error',
          text: 'Загрузить изображение не удалось'
        })
      }
    },
    deleteLogo () {
      this.form.logo.src = ''
      this.$delete(this.form.logo, 'id')
      this.logo = ''
    },
    deleteMiniLogo () {
      this.form.mini_logo.src = ''
      this.$delete(this.form.mini_logo, 'id')
      this.miniLogo = ''
    },
    deleteMainImage ({ index }) {
      this.$delete(this.images, index)
      this.$delete(this.form.images, index)
    },
    deleteSocialsLink (index) {
      this.$delete(this.form.socials, index)
    },
    changeSocialsLink ({ index, value }) {
      this.$set(this.form.socials, index, value)
    },
    async onDelete () {
      if (!this.organizationId) {
        return
      }
      let res = await this.$confirmDelete()
      if (res.value) {
        try {
          await axios.delete('management/organizations/' + this.organizationId)
          await this.$callToast({
            type: 'success',
            text: 'Организация успешно удалена'
          })
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
        if (this.organizationId) {
          await this.form.patch('management/organizations/' + this.organizationId)
        } else {
          const { data } = await this.form.post('management/organizations')
          this.organizationId = data.organization.id
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
    },
    async onUnpublish () {
      try {
        await this.form.patch(`/management/organizations/${this.organizationId}/unpublish`)
        this.form.is_published = false
        await this.$callToast({
          type: 'success',
          text: 'Организация успешно снята с публикации.'
        })
      } catch (e) {
      }
    },
    async onPublish () {
      this.form.is_published = true
      try {
        await this.form.patch(`management/organizations/${this.organizationId}`)
        await this.$callToast({
          type: 'success',
          text: 'Организация опубликована'
        })
      } catch (e) {
        this.form.is_published = false
        await this.$callToast({
          type: 'error',
          text: 'Опубликовать организацию не удалось'
        })
      }
    }
  }
}
</script>

<style>
  .orgs-edit__logo-file-input .picture-preview{
    background-color: currentColor!important;
  }
</style>
