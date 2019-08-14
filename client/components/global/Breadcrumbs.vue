<template>
  <div :class="{[boxClass]:!!boxClass}"
       class="container">
    <ol
      v-if="breadcrumbs.length"
      :class="{[brsClass]:!!brsClass}"
      class="breadcrumb"
    >
      <li class="breadcrumb-item">
        <router-link
          :to="{ name: 'welcome'}"
        >
          Главная
        </router-link>
      </li>
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
  props: {
    boxClass: {
      type: String,
      default: ''
    },
    brsClass: {
      type: String,
      default: ''
    }
  },
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
      let res = ''
      let params = this.$route.params
      if (bc instanceof Function) {
        res = bc.call(this, params)
      } else if (bc instanceof Object) {
        let reactData = this.$store.getters['variables/getReactData']
        let name = bc.name
        let length = bc.length
        if (reactData[name] && params[name] && reactData[name][Number(params[name])]) {
          let res_ = reactData[name][Number(params[name])]
          if (res_.name) {
            res = res_.name
            if (res.length > (length || 20)) {
              res = res.slice(0, (length || 20))
              res += '...'
            }
          }
        }
      } else {
        res = bc
      }

      return res
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
