<template>
  <div class="layout" :class="{'page-loaded': loaded}">
    <main>
      <navbar/>
      <breadcrumbs/>
      <nuxt/>
    </main>


    <app-footer/>
  </div>
</template>

<script>
import Navbar from '~/components/Navbar'
import AppFooter from '~/components/Footer'

export default {
  components: {
    Navbar,
    AppFooter
  },
  data: () => ({
    loaded: false
  }),
  computed: {
  },
  mounted () {
    this.loaded = true
  }
}
</script>
