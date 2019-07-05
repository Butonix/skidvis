<template>
  <div class="full-slider">
    <div v-if="!sliderReady" class="full-slider__preloader"
         style="background: darkseagreen;"></div>
    <hooper class="full-slider__slider"
            @slide.once="initSlider"
            :wheelControl="false">
        <slide v-if="images.length === 0" class="full-slider__placeholder full-slider__slide">
            Загрузите фотографии своей компании
        </slide>
    </hooper>
  </div>
</template>

<script>
    import { Hooper, Slide } from 'hooper';


    export default {
        components: {
            Hooper,
            Slide
        },
        props: {
          images: {
              type: Array,
              default: ()=>([])
          }
        },
        data: () => ({
            sliderReady: false
        }),

        computed: {

        },

        methods: {
            initSlider()
            {
                this.sliderReady = true;

            }
        }
    }
</script>

<style>

</style>
