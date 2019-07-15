<template>
  <div class="layout">
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
  computed: {
  }
}
</script>
