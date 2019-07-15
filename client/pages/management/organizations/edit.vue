<template>
  <form class="organizations-edit"
        @submit.prevent @keydown="form.onKeydown($event)">
    <full-slider
      :images="images"
    />
    <div class="overflow-hidden">
      <div class="container">
        <thumbs-file-input
          :images="images"
          @change="setMainImage"
          @delete="deleteMainImage"
        />
        <div class="row justify-content-center">
          <div class="col-lg-8 organizations-edit__editor">

            <div class="row mt-xl-3">
              <div class="col">

                <div class="row">
                  <div class="col-sm">
                    <div class="organizations-edit__logo">
                      <div class="text-center small pb-2">
                        Логотип организации
                      </div>
                      <div
                        :style="{color:form.logo.color}"
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
                        :style="{backgroundColor: form.logo.color}"
                        :class="{'active':isActiveClassColorBox}"
                        class="color-box" @click="isActiveClassColorBox = !isActiveClassColorBox"
                      />
                      <div class="color-box__close" @click="isActiveClassColorBox = !isActiveClassColorBox"/>
                      <no-ssr>
                        <sketch-picker :value="form.logo.color" class="mx-auto" @input="setLogoColor" />
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
                  <sketch-picker :value="form.logo.color" @input="setLogoColor" />
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
              <v-select :clearable="false" v-model="selected" :options="[{label: '13:23, Москва, Санкт-Петербу 13:23, Москва, Санкт-Петербу 13:23, Москва, Санкт-Петербу 13:23, Москва, Санкт-Петербу', value: '1'}, {label: '13:23, Москва, Санкт-Петерб123у', value: '2'}, {label: '13:23, Москва, Санкт-Петербу', value: '3'}]"/>
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
          v-if="form.id"
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
  data: () => ({
    selected: { label: '13:23, Москва, Санкт-Петербу 13:23, Москва, Санкт-Петербу 13:23, Москва, Санкт-Петербу 13:23, Москва, Санкт-Петербу', value: '1' },
    yourValue: '',
    isActiveClassColorBox: false,
    operationMode: {
      interval: [],
      default: {
        start: '07:00',
        end: '20:00',
        active: true
      },
      data: {
        mon: {
          label: 'Понедельник'
        },
        tue: {
          label: 'Вторник'
        },
        web: {
          label: 'Среда'
        },
        thu: {
          label: 'Четверг'
        },
        fri: {
          label: 'Пятница'
        },
        sat: {
          label: 'Суббота'
        },
        sun: {
          label: 'Воскресенье'
        }
      }
    },
    images: [],
    logo: '',
    id: undefined,
    form: new Form({
      operationMode: {
        mon: null,
        tue: null,
        web: null,
        thu: null,
        fri: null,
        sat: null,
        sun: null
      },
      images: [
        {
          1200: {
            src: '',
            id: ''
          },
          src: '',
          id: ''
        }
        // {
        //   src: '',
        //   id: ''
        // },
      ],
      link: '',
      name: '',
      inn: '',
      description: '',
      logo: {
        color: '#FFFFFF',
        src: ''
        // id: 1
      },
      socials: [
        // {
        //   link: 'https://vk.com/123131213123',
        //   type: 'vk'
        // },
      ]
    })
  }),

  created () {
    for (let i = 0; i < 24; i++) {
      let t = (i < 10) ? '0' + i : i
      this.operationMode.interval.push(t + ':00')
      this.operationMode.interval.push(t + ':10')
      this.operationMode.interval.push(t + ':20')
      this.operationMode.interval.push(t + ':30')
      this.operationMode.interval.push(t + ':40')
      this.operationMode.interval.push(t + ':50')
    }
    for (let i in this.form.operationMode) {
      if (!this.form.operationMode[i]) {
        this.form.operationMode[i] = { ...this.operationMode.default }
      }
    }
  },
  methods: {
    addSocialsLink (link) {
      this.form.socials.push(link)
    },
    setLogoColor (value) {
      this.form.logo.color = `rgba(${value.rgba.r}, ${value.rgba.g}, ${value.rgba.b}, ${value.rgba.a})`
    },
    async setLogoSrc (image) {
      this.logo = image
      try {
        let { data } = await axios.post('/1/organization/image', {
          data: {
            image
          }
        })
        this.form.logo.src = data.src
        this.form.logo.id = data.id
      } catch (e) {

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
        let { data } = await axios.post('/1/organization/logo', {
          data: {
            image
          }
        })
        if (index !== undefined && this.form.images[index]) {
          this.$set(this.form.images, index, data)
        } else {
          this.form.images.push(data)
        }
      } catch (e) {

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
      let res = await this.$swal(this.configSwal().confirm)
      if (res.value) {
        try {
          let { data } = await axios.delete('/1/organization/' + this.id)
        } catch (e) {

        }
      }
    },
    async onSave () {
      try {
        const { data } = await this.form.post('/1/management/organizations')

        console.log(data)
      } catch (e) {

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
