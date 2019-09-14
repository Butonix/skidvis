<template>
  <div>
    <div class="container mb-5">
      <search-input
        v-model="prods.urlQuery.search"
        autofocus="autofocus"
        form-class="mb-4"
      />
    </div>
    <products
      :params="prodsParams"
      type="wishlist"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import BuildList from '~/mixins/list'
import { getFavicon } from '~/utils'
import axios from 'axios'

const globalNamespace = 'prods'

const List = BuildList({
  axios,
  globalNamespace,
  apiUrl: 'products',
  pathResponse: 'list.data',
  pathTotal: 'list.total',
  allowedParams: ['whereIn'],
  apiQuery: {
    ordering: 'created_at',
    orderingDir: 'desc'
  },
  urlQuery: {
    perPage: 12
  },
  buildWatchers ({ beforeTypes, getWatcher, gN }) {
    return {
      'wishlist': async function (v) {
        if (!this.check) {
          if (v.length === 0) {
            this.$set(this[gN].apiQuery, 'whereIn', [0])
          } else {
            this.$set(this[gN].apiQuery, 'whereIn', [...v])
          }
        } else {
          if (this[gN].apiQuery.whereIn) {
            this.$delete(this[gN].apiQuery, 'whereIn')
          }
          console.log(v)
        }
        await getWatcher({ type: beforeTypes.SEARCH }).call(this)
      },
      'check': async function (v) {
        console.log(v, this.wishlist.length)
        if (v) {
          this[gN].apiUrl = 'user/wishlist'
          if (this[gN].apiQuery.whereIn) {
            this.$delete(this[gN].apiQuery, 'whereIn')
          }
        } else {
          this[gN].apiUrl = 'products'
          if (this.wishlist.length === 0) {
            this.$set(this[gN].apiQuery, 'whereIn', [0])
          } else {
            this.$set(this[gN].apiQuery, 'whereIn', [...this.wishlist])
          }
        }
        await getWatcher({ type: beforeTypes.SEARCH }).call(this)
      }
    }
  }
})

export default {
  components: {
    'SearchInput': () => import('~/components/SearchInput'),
    'Products': () => import('~/components/Products')
  },
  mixins: [List.mixin],
  head () {
    return {
      title: this.$route.meta.title,
      bodyAttrs: {
        class: 'theme-default'
      },
      ...getFavicon()
    }
  },
  asyncData: async ({ params, error, app, query }) => {
    let check = app.store.getters['auth/check']
    let wishlist = app.store.getters['auth/wishlist']
    let data

    if (check) {
      data = await List.getStartData({
        error,
        query,
        defaultData: {
          apiUrl: 'user/wishlist'
        }
      })
    } else {
      if (wishlist.length === 0) {
        wishlist = [0]
      }
      data = await List.getStartData({
        error,
        query,
        defaultData: {
          apiUrl: 'products'
        },
        defaultApiQuery: {
          whereIn: [...wishlist]
        }
      })
    }

    return data
  },
  computed: mapGetters({
    wishlist: 'auth/wishlist',
    check: 'auth/check'
  })
}
</script>

<style>
</style>
