<template>
  <hooper class="full-slider"
          :wheelControl="false">
    <slide class="full-slider__placeholder full-slider__slide">
      Загрузите фотографии своей компании
    </slide>
  </hooper>
</template>

<script>
    import { Hooper, Slide } from 'hooper';


    export default {
        components: {
            Hooper,
            Slide
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
    height: 425px;
    &__slide{
      height: 100%;
    }
    &__placeholder{
      background: #8C8C8C;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
</style>
