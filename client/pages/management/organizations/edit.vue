<template>
  <div>
    <full-slider></full-slider>
    <div class="container">
      <thumbs-file-input></thumbs-file-input>
    </div>
  </div>
</template>

<script>
    import FullSlider from '~/components/FullSlider'
    import ThumbsFileInput from '~/components/ThumbsFileInput'

    export default {
        middleware: 'auth',
        components:{
            FullSlider,
            ThumbsFileInput,
        },
    }
</script>

<style>

</style>
