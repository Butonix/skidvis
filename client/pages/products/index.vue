<template>
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
</template>

<script>
import FullSlider from '~/components/FullSlider'

export default {
  components: {
    FullSlider
  },
  head () {
    return {
      title: 'Акции',
      bodyAttrs: {
        class: 'theme-default'
      }
    }
  },
  asyncData: () => ({
    images: [],
    logo: '',
    productId: undefined
  })
}
</script>

<style>
</style>
