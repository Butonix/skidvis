<template>
  <div class="full-slider">
    <div v-lazy:background-image="{src: images[0].src || '', loading: 'data:image/gif;base64,R0lGODlhEwAIAIAAAP///wAAACH5BAEAAAEALAAAAAATAAgAAAIKjI+py+0Po5yUFgA7'}" v-if="!sliderReady && images.length > 0"
         class="full-slider__preloader"/>
    <div v-if="!sliderReady && images.length === 0"
         class="full-slider__preloader">
      <div class="full-slider__placeholder full-slider__slide">
        {{ isEdit?emptyTextEdit:emptyTextShow }}
      </div>
    </div>
    <hooper :wheel-control="false"
            class="full-slider__slider"
            @slide.once="initSlider">
      <slide v-if="images.length === 0">
        <div class="full-slider__placeholder full-slider__slide cursor-pointer" @click="$emit('clickfirstslide')">
          {{ isEdit?emptyTextEdit:emptyTextShow }}
        </div>
      </slide>
      <slide v-for="(image, i) in images" v-else
             :key="i">
        <div v-if="image.src" v-lazy:background-image="{src: images[i].src || '', loading: 'data:image/gif;base64,R0lGODlhEwAIAIAAAP///wAAACH5BAEAAAEALAAAAAATAAgAAAIKjI+py+0Po5yUFgA7'}" class="full-slider__slide"/>
      </slide>
      <hooper-navigation slot="hooper-addons"/>
      <hooper-pagination slot="hooper-addons"/>
    </hooper>
    <slot/>
  </div>
</template>

<script>
// import { isNumeric } from '~/utils'
import { Hooper, Slide, Navigation as HooperNavigation, Pagination as HooperPagination } from 'hooper'

export default {
  components: {
    Hooper,
    Slide,
    HooperNavigation,
    HooperPagination
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    images: {
      type: Array,
      default: () => ([])
    }
  },
  data: () => ({
    emptyTextEdit: 'Загрузите фотографии своей компании',
    emptyTextShow: 'Компания еще не загрузила фотографии',
    sliderReady: false
    // imagesReady: {}
  }),
  // created () {
  //   console.log('beforeCreate', this.images)
  // },
  // mounted () {
  //   console.log(this.images)
  // },
  methods: {
    initSlider () {
      this.sliderReady = true
    },
    // getImageSave (i) {
    //   let src = this.getImage(i)
    //   this.$set(this.imagesReady, i, src)
    //   return src
    // },
    // getImage (i) {
    //   if (false && !this.isEdit) {
    //     try {
    //       let image = this.images[i]
    //       let keys = Object.keys(image)
    //       if (keys.length) {
    //         keys = keys.filter(isNumeric).map(Number)
    //       }
    //       if (keys.length) {
    //         let key = Math.min.apply(null, keys)
    //         if (key) {
    //           return (this.images[i][String(key)]?this.images[i][String(key)].src:null) || (this.images[i][key]?this.images[i][key].src:null) || this.images[i].src || ''
    //         }
    //       }
    //     } catch (e) {
    //       return this.images[i].src || ''
    //     }
    //   }
    //
    //   return this.images[i].src || ''
    // }
  }
}
</script>

<style>

</style>
