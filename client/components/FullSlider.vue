<template>
  <div class="full-slider">
    <div v-if="!sliderReady" class="full-slider__preloader"
         :style="(images.length > 0)?{backgroundImage:`url(${images[0].src})`}:placeholder"></div>
    <hooper class="full-slider__slider"
            @slide.once="initSlider"
            :wheelControl="false">
        <slide v-if="images.length === 0">
            <div class="full-slider__placeholder full-slider__slide">
                Загрузите фотографии своей компании
            </div>
        </slide>
        <slide v-else v-for="(image, index) in images"
               :key="index">
            <div class="full-slider__slide" :style="{backgroundImage:`url(${image.src})`}"></div>
        </slide>
    </hooper>
  </div>
</template>

<script>
    import {mapState} from 'vuex';
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

        computed: mapState({
            placeholder: state => state.variables.placeholders["1920x700"],
            pattern: state => state.variables.placeholders.pattern,
        }),

        methods: {
            initSlider()
            {
                console.log(this.placeholder);
                this.sliderReady = true;

            }
        }
    }
</script>

<style>

</style>
