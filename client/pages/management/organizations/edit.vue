<template>
  <div class="organizations-edit">
    <full-slider
      :images="mainImages"
    />
    <div class="container">
      <thumbs-file-input
        :images="mainImages"
        @change="setMainImage"
        @delete="deleteTempMainImage"
      />
      <div class="row mt-xl-3">
        <div class="col mb-4 pt-3 d-none d-xl-block">
          <material-input
            :value="link"
            name="link"
            placeholder="Ссылка на ваш сайт"
            @input="setTempLink($event.target.value)"
          />
        </div>
        <div class="organizations-edit__logo custom-col mb-4 pt-3 pt-xl-0">
          <logo-file-input
            :image="logo"
            @change="setTempLogo"
            @delete="deleteTempLogo"
          />
        </div>
        <div class="col-md col-lg-6 col-xl mb-4 pt-xl-3">
          <material-input
            :value="link"
            name="link"
            placeholder="Ссылка на ваш сайт"
            form-class="d-block d-xl-none"
            @input="setTempLink($event.target.value)"
          />
          <material-input
            :value="link"
            name="link"
            placeholder="Ссылка на ваш сайт"
            @input="setTempLink($event.target.value)"
          />
        </div>
      </div>
      <div class="row justify-content-center">
        <div class="col-lg-8 organizations-edit__editor">
          <material-input
            :value="name"
            name="name"
            placeholder="Введите название компании"
            @input="setTempName($event.target.value)"
          />
          <material-textarea
            :value="description"
            name="link"
            placeholder="Почему к вам стоит прийти?"
            data-align="center"
            form-class="my-5"
            @input="setTempDescription($event.target.value)"
          />
          <material-input
            :value="name"
            name="inn"
            placeholder="ИНН"
            @input="setTempName($event.target.value)"
          />
        </div>
      </div>
      <div class="text-center">
        Из 39 точек в 19 действуют акции
        <div class="btn btn-primary">
          <fa icon="map-marker-alt" />
          На карте
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import FullSlider from '~/components/FullSlider'
import ThumbsFileInput from '~/components/Edit/ThumbsFileInput'
import MaterialInput from '~/components/Edit/Inputs/MaterialInput'
import MaterialTextarea from '~/components/Edit/Inputs/MaterialTextarea'
import LogoFileInput from '~/components/Edit/LogoFileInput'

export default {
  layout: 'edit',
  middleware: 'auth',
  components: {
    MaterialTextarea,
    FullSlider,
    ThumbsFileInput,
    LogoFileInput,
    MaterialInput
  },
  data: () => ({}),
  computed: {
    ...mapGetters({
      mainImages: 'organization/getTempMainImages',
      item: 'organization/getItem',
      link: 'organization/getTempLink',
      name: 'organization/getTempName',
      description: 'organization/getTempDescription',
      logo: 'organization/getTempLogo'
    })
  },
  methods: {
    ...mapActions({
      setMainImage: 'organization/setTempMainImage',
      setTempLink: 'organization/setTempLink',
      setTempName: 'organization/setTempName',
      setTempDescription: 'organization/setTempDescription',
      deleteTempMainImage: 'organization/deleteTempMainImage',
      setTempLogo: 'organization/setTempLogo',
      deleteTempLogo: 'organization/deleteTempLogo',
    }),
    onChange (image) {
      console.log('New picture selected!')
      if (image) {
        console.log('Picture loaded.')
        this.image = image
      } else {
        console.log('FileReader API not supported: use the form, Luke!')
      }
    }
  },
  // eslint-disable-next-line vue/order-in-components
  created () {
    this.$store.dispatch('organization/setItem', this.$route.params.id)
  }
}
</script>

<style>
</style>
