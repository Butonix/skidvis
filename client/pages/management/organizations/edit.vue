<template>
  <form class="organizations-edit overflow-hidden"
        @submit.prevent @keydown="form.onKeydown($event)">
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
              <div class="row">
                <div class="col-sm">
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
                </div>
                <div class="col-sm-auto d-flex d-md-none flex-column">
                  <div class="text-center small pb-2 pt-4 pt-sm-0">
                    Цвет заливки логотипа
                  </div>
                  <div class="color-box__wrapper">
                    <div
                      :style="{backgroundColor: logoColor}"
                      :class="{'active':isActiveClassColorBox}"
                      class="color-box" @click="isActiveClassColorBox = !isActiveClassColorBox"
                    />
                    <div class="color-box__close" @click="isActiveClassColorBox = !isActiveClassColorBox"/>
                    <no-ssr>
                      <sketch-picker :value="logoColor" class="mx-auto" @input="setItemLogoColor" />
                    </no-ssr>
                  </div>
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
            <div class="col-auto d-none d-md-block">
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

      <modal name="example">
        <div class="basic-modal color-modal">
          <div class="text-center pb-2">
            Цвет заливки логотипа
          </div>
          <no-ssr>
            <sketch-picker :value="logoColor" @input="setItemLogoColor" />
          </no-ssr>
        </div>
      </modal>

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
  </form>
</template>

<script>
import Form from 'vform'
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
    isActiveClassColorBox: false,
    form: new Form({
      email: ''
    })
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
    async onDelete () {
      let res = await this.$swal(this.configSwal().confirm)
      if (res.value) {
        console.log(123)
      }
    },
    async onSave () {
      try {
        const { data } = await this.form.post('/password/email')

        console.log(data);
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
