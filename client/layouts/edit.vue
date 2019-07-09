<template>
  <div class="layout theme-edit">
    <div class="d-none1">
      <navbar/>
    </div>

    <nuxt/>

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
  computed: {
  }
}
</script>
