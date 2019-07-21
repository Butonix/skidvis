<template>
  <form class="products-edit overflow-hidden"
        @submit.prevent @keydown="form.onKeydown($event)">
    <div class="container">
      <div class="row">
        <div class="product__content">
          <div class="product__slider">
            <full-slider
              :images="images"
            />

          </div>
        </div>
        <div class="product__sidebar"/>
      </div>
    </div>

  </form>
</template>

<script>
import Form from 'vform'
import FullSlider from '~/components/FullSlider'

export default {
  components: {
    FullSlider
  },
  head () {
    return {
      title: 'Редактирование акции',
      bodyAttrs: {
        class: 'theme-business'
      }
    }
  },
  middleware: 'auth',
  data: () => ({
    images: [],
    logo: '',
    id: undefined,
    form: new Form({
      images: [],
      link: '',
      name: '',
      inn: '',
      description: '',
      logo: {
        color: '#FFFFFF',
        src: ''
        // id: 1
      }
    })
  })
}
</script>

<style>
</style>
