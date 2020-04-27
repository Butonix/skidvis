<template>
  <div class="nuxt-error">
    <breadcrumbs v-if="error && error.statusCode === 403"/>
    <component :is="errorPage" :error="error" />
  </div>
</template>
<script>
import error404 from '~/components/error/404'
import error403 from '~/components/error/403'
import error500 from '~/components/error/500'

export default {
  name: 'NuxtError',
  layout: 'default',
  middleware: ['reactData'],
  props: {
    error: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    errorPage () {
      if (this.error.statusCode === 404) {
        return error404
      }
      if (this.error.statusCode === 403) {
        return error403
      }
      // catch everything else
      return error500
    }
  }
}
</script>
