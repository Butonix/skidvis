<template>
  <div class="full-slider">
<!--    <swiper>-->
<!--      &lt;!&ndash; slides &ndash;&gt;-->
<!--      <swiper-slide class="full-slider__slide">-->
<!--        <div class="w-100 h-100 bg-secondary">-->
<!--          Slide-->
<!--        </div>-->
<!--      </swiper-slide>-->
<!--      <swiper-slide class="full-slider__slide">-->
<!--        <div class="w-100 h-100 bg-secondary">-->
<!--          Slide-->
<!--        </div>-->
<!--      </swiper-slide>-->
<!--      <swiper-slide class="full-slider__slide">-->
<!--        <div class="w-100 h-100 bg-secondary">-->
<!--          Slide-->
<!--        </div>-->
<!--      </swiper-slide>-->
<!--      <swiper-slide class="full-slider__slide">-->
<!--        <div class="w-100 h-100 bg-secondary">-->
<!--          Slide-->
<!--        </div>-->
<!--      </swiper-slide>-->
<!--    </swiper>-->
<!--    <vue-glide-->
<!--      type="carousel"-->
<!--      :perView="1"-->
<!--      class="">-->
<!--      <vue-glide-slide class="full-slider__slide" v-for="i in 10" :key="i">-->
<!--        <div class="w-100 h-100 bg-secondary">-->
<!--          Slide {{ i }}-->
<!--        </div>-->
<!--      </vue-glide-slide>-->
<!--    </vue-glide>-->
  </div>
</template>

<script>
    import { Glide, GlideSlide } from 'vue-glide-js'


    export default {
        components: {
            [Glide.name]: Glide,
            [GlideSlide.name]: GlideSlide
        },

        data: () => ({

        }),

        computed: {

        },

        methods: {

        }
    }
</script>

<style scoped lang="scss">

  .full-slider{
    &__slide{
      height: 425px;
    }
  }
</style>
