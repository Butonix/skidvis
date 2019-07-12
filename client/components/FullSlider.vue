<template>
  <div class="full-slider">
    <div v-if="!sliderReady" :style="(images.length > 0)?{backgroundImage:`url(${images[0].src})`}:''"
         class="full-slider__preloader">
      <div v-if="images.length === 0" class="full-slider__placeholder full-slider__slide">
        Загрузите фотографии своей компании
      </div>
    </div>
    <hooper :wheel-control="false"
            class="full-slider__slider"
            @slide.once="initSlider">
      <slide v-if="images.length === 0">
        <div class="full-slider__placeholder full-slider__slide">
          Загрузите фотографии своей компании
        </div>
      </slide>
      <slide v-for="(image, index) in images" v-else
             :key="index">
        <div :style="{backgroundImage:`url(${image.src})`}" class="full-slider__slide"/>
      </slide>
    </hooper>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { Hooper, Slide } from 'hooper'

export default {
  components: {
    Hooper,
    Slide
  },
  props: {
    images: {
      type: Array,
      default: () => ([])
    }
  },
  data: () => ({
    sliderReady: false
  }),

  computed: mapState({
    placeholder: state => state.variables.placeholders['1920x700'],
    pattern: state => state.variables.placeholders.pattern
  }),

  methods: {
    initSlider () {
      this.sliderReady = true
    }
  }
}
</script>

<style>

</style>
