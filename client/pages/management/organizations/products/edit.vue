<template>
  <form class="organizations-edit overflow-hidden"
        @submit.prevent @keydown="form.onKeydown($event)">
    <full-slider
      :images="images"
    />
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

      <div class="text-center mt-4">
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
import axios from 'axios'

export default {
  components: {
    MaterialTextarea,
    FullSlider,
    ThumbsFileInput,
    LogoFileInput,
    MaterialInput,
    SocialLinks
  },
  head () {
    return {
      title: 'Редактирование организации',
      bodyAttrs: {
        class: 'theme-business'
      }
    }
  },
  middleware: 'auth',
  data: () => ({
    isActiveClassColorBox: false,
    images: [],
    logo: '',
    id: undefined,
    form: new Form({
      images: [
        {
          1200: {
            src: '',
            id: ''
          },
          src: '',
          id: ''
        },
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
        src: '',
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
        let { data } = await axios.post('organization/image', {
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
        let { data } = await axios.post('organization/logo', {
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
      console.log(index);
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
          let { data } = await axios.delete('organization/' + this.id)
        } catch (e) {

        }
      }
    },
    async onSave () {
      try {
        const { data } = await this.form.post('management/organizations')

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
