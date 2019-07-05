<template>
  <div class="">
      <full-slider></full-slider>
    123
  </div>
</template>

<script>
    import FullSlider from '~/components/FullSlider'

    export default {
        middleware: 'auth',
        components:{
            FullSlider
        },
        computed: {
            tabs () {
                return [
                    {
                        icon: 'user',
                        name: this.$t('profile'),
                        route: 'settings.profile'
                    },
                    {
                        icon: 'lock',
                        name: this.$t('password'),
                        route: 'settings.password'
                    }
                ]
            }
        },
        mounted() {

        }
    }
</script>

<style>
  .settings-card .card-body {
    padding: 0;
  }
</style>
