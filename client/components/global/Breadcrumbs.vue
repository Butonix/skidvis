<template>
  <div class="container">
    <ol
      v-if="breadcrumbs.length"
      class="breadcrumb"
    >
      <li
        v-for="(crumb, i) in breadcrumbs"
        v-if="crumb.meta.breadcrumb"
        :key="i"
        class="breadcrumb-item"
      >
        <router-link
          v-if="breadcrumbs[i+1] && !breadcrumbs[i+1].meta.breadcrumb"
          :to="{ path: getPath(breadcrumbs[i+1]) }"
          tag="span"
          active-class="active"
        >{{ getBreadcrumb(crumb.meta.breadcrumb) }}</router-link>
        <router-link
          v-else
          :to="{ path: getPath(crumb) }"
          :tag="i != breadcrumbs.length - 1 ? 'a' : 'span'"
          active-class="active"
        >{{ getBreadcrumb(crumb.meta.breadcrumb) }}</router-link>
      </li>
    </ol>
  </div>
</template>
<script>
export default {
  name: 'Breadcrumbs',
  computed: {
    breadcrumbs () {
      return this.$route.matched.map(route => ({
        ...route,
        path: route.path.length > 0 ? route.path : '/'
      }))
    }
  },
  methods: {
    getBreadcrumb (bc) {
      return typeof bc === 'function' ? bc.call(this, this.$route.params) : bc
    },
    getPath (crumb) {
      let { path } = crumb

      for (let [key, value] of Object.entries(this.$route.params)) {
        path = path.replace(`:${key}`, value)
      }

      return path
    }
  }
}
</script>

<style></style>
