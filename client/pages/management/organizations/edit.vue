<template>
  <div class="organizations-edit">
    <full-slider
      :images="mainImages"
    />
    <div class="container">
      <thumbs-file-input
        :images="mainImages"
        @change="setItemMainImage"
        @delete="deleteItemMainImage"
      />
      <div class="row justify-content-center">
        <div class="col-lg-8 organizations-edit__editor">

          <div class="row mt-xl-3">
            <div class="col">
              <div class="organizations-edit__logo">
                <div class="text-center small pb-2">
                  Логотип организации
                </div>
                <div
                  :style="{color:logoColor}"
                  class="organizations-edit__logo-file-input">
                  <logo-file-input
                    :src="logoSrc"
                    @change="setItemLogoSrc"
                    @delete="deleteItemLogo"
                  />
                </div>
              </div>
              <material-input
                :value="link"
                form-class="mb-4"
                placeholder="Ссылка на ваш сайт"
                @input="setItemLink"
              />
              <material-input
                :value="name"
                placeholder="Введите название компании"
                @input="setItemName"
              />
              <material-input
                :value="inn"
                placeholder="ИНН"
                @input="setItemInn"
              />
            </div>
            <div class="col-auto">
              <div class="text-center small pb-2">
                Цвет заливки логотипа
              </div>
              <no-ssr>
                <sketch-picker :value="logoColor" @input="setItemLogoColor" />
              </no-ssr>
            </div>
          </div>
          <material-textarea
            :value="description"
            name="link"
            placeholder="Почему к вам стоит прийти?"
            data-align="center"
            form-class="my-5"
            @input="setItemDescription"
          />
          <social-links
            :links="socials"
            @add="addItemSocialsLink"
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
          v-if="item.id"
          class="btn btn-outline-danger ml-2"
          @click="onDelete"
        >
          Удалить
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import FullSlider from '~/components/FullSlider'
import ThumbsFileInput from '~/components/Edit/ThumbsFileInput'
import SocialLinks from '~/components/Edit/SocialLinks'
import MaterialInput from '~/components/Edit/Inputs/MaterialInput'
import MaterialTextarea from '~/components/Edit/Inputs/MaterialTextarea'
import LogoFileInput from '~/components/Edit/LogoFileInput'
import Addresses from '~/components/Addresses'
import mixinSwal from '~/mixins/sweetalert2'

export default {
  components: {
    MaterialTextarea,
    FullSlider,
    ThumbsFileInput,
    LogoFileInput,
    Addresses,
    MaterialInput,
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
  }),
  computed: {
    ...mapGetters({
      mainImages: 'organization/getItemMainImages',
      item: 'organization/getItem',
      link: 'organization/getItemLink',
      name: 'organization/getItemName',
      inn: 'organization/getItemInn',
      description: 'organization/getItemDescription',
      logoSrc: 'organization/getItemLogoSrc',
      addresses: 'organization/getItemAddresses',
      socials: 'organization/getItemSocials',
      logoColor: 'organization/getItemLogoColor'
    })
  },
  methods: {
    ...mapActions({
      setItemMainImage: 'organization/setItemMainImage',
      setItemLink: 'organization/setItemLink',
      setItemName: 'organization/setItemName',
      setItemInn: 'organization/setItemInn',
      setItemDescription: 'organization/setItemDescription',
      deleteItemMainImage: 'organization/deleteItemMainImage',
      setItemLogoSrc: 'organization/setItemLogoSrc',
      deleteItemLogo: 'organization/deleteItemLogo',
      addItemSocialsLink: 'organization/addItemSocialsLink',
      setItemLogoColor: 'organization/setItemLogoColor'
    }),
    onChange (image) {
      console.log('New picture selected!')
      if (image) {
        console.log('Picture loaded.')
        this.image = image
      } else {
        console.log('FileReader API not supported: use the form, Luke!')
      }
    },
    onInput (hue) {

    },
    async onDelete () {
      let res = await this.$swal(this.configSwal().confirm)
      if (res.value) {
        console.log(123)
      }
    },
    async onSave () {
      console.log(123)
    }
  },
  // eslint-disable-next-line vue/order-in-components
  created () {
    this.$store.dispatch('organization/setItem', this.$route.params.id)
  }
}
</script>

<style>
  .organizations-edit__logo-file-input .picture-preview{
    background-color: currentColor!important;
  }
</style>
