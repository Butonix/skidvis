<template>
  <div :class="{'page-loaded': loaded}" class="layout">
    <main>
      <navbar/>
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
