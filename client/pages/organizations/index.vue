<template>
  <div ref="start">
    <div class="container orgs mb-5">
      <search-input
        v-model="orgs.urlQuery.search"
        autofocus="autofocus"
        form-class="mb-4"
      />

      <filter-list
        :fuse="orgsFS_categories"
        :url-query="orgs.urlQuery"
        :filter="orgs.filters.categories"
        name="categories"
        @filter="orgsFilter('categories', $event)"
        @clearfilter="orgsClearFilter('categories')"
        @handleall="orgsHandleAll('categories')"
      />
    </div>

    <div class="container orgs__container">
      <transition
        v-if="orgsItems.length"
        name="fade" mode="out-in">
        <div
          class="orgs__row position-relative">
          <div :class="{'active': orgsIsLoading}"
               class="loading-list"
          />
          <transition
            v-for="(item, index) in orgsItems"
            :key="index"
            name="fade" mode="out-in">
            <div
              :title="item.name"
              class="orgs__col"
            >
              <router-link
                :to="{ name: 'organizations.show', params: { organizationId: item.id } }"
                class="d-block text-dark"
                @click.native="$sTB()">
                <div :style="{backgroundColor: (item.logo && item.logo.color)?item.logo.color:'#FFFFFF'}"
                     class="orgs__col__box mb-2"
                >
                  <div v-if="(item.logo && item.logo.src)?item.logo.src:null"
                       class="orgs__col__box__wrapper">
                    <img
                      v-lazy="(item.logo && item.logo.src)?item.logo.src:''"
                      :alt="item.name"
                      :title="item.name"
                      :data-id="item.id"
                      data-type="logo"
                      src="/placeholders/96x35-1920x700.gif"
                    >
                  </div>
                  <div v-else class="bg-cover w-100 h-100" style="background-image: url('/placeholders/logo.svg');" />
                </div>
                <p class="text-center" v-text="item.name"/>
              </router-link>
            </div>
          </transition>
        </div>
      </transition>
      <transition
        v-else
        name="fade" mode="out-in">
        <h5 class="text-center py-5">
          Ничего не нашлось :(
        </h5>
      </transition>

      <paginate-list
        :params="orgsParams"
      />

    </div>

    <div class="container text-center theme-business mt-5">
      <router-link :to="{ name: 'business' }" class="btn btn-primary mb-3 px-5">
        Стать партнером
      </router-link>
      <p>Продвигаем бизнес каждый день</p>
    </div>

  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import BuildList from '~/mixins/list'
import { getFavicon } from '~/utils'
import axios from 'axios'

const globalNamespace = 'orgs'

const List = BuildList({
  axios,
  globalNamespace,
  apiUrl: 'organizations',
  pathResponse: 'list.data',
  pathTotal: 'list.total',
  allowedParams: ['city_id'],
  filters: {
    categories: {
      start: {
        url: 'categories',
        pathResponse: 'list.data',
        query: {
          products: 1,
          favorites: 1,
          perPage: 100000,
          orWhereIn: []
        }
      },
      fetch: {
        url: 'categories',
        pathResponse: 'list.data',
        query: {
          products: 1,
          perPage: 1000000,
          page: 1
        }
      }
    }
  },
  urlQuery: {
    perPage: 50
  },
  buildWatchers ({ beforeTypes, getWatcher, gN }) {
    return {
      [`${gN}.urlQuery.city_id`]: function (v) {
        // if (typeof v !== 'undefined' && v !== city.id) {
        //   await app.store.dispatch('auth/setCity', query.city_id)
        // }
        getWatcher({ type: beforeTypes.SEARCH }).call(this)
      },
      'city': function (v) {
        if (v.id) {
          this[gN].urlQuery.city_id = v.id
        }
      }
    }
  }
})

export default {
  components: {
    'FilterList': () => import('~/components/FilterList'),
    'SearchInput': () => import('~/components/SearchInput'),
    'CardLogo': () => import('~/components/Product/CardLogo'),
    'PaginateList': () => import('~/components/PaginateList')
  },
  middleware: [],
  mixins: [List.mixin],
  head () {
    return {
      title: 'Все компании',
      bodyAttrs: {
        class: 'theme-default'
      },
      ...getFavicon()
    }
  },
  asyncData: async ({ params, error, app, query }) => {
    let city = app.store.getters['auth/city']

    if (typeof query.city_id !== 'undefined' && query.city_id !== city.id) {
      await app.store.dispatch('auth/setCity', query.city_id)
    }

    let data = await List.getStartData({
      query,
      defaultApiQuery: {

      },
      defaultUrlQuery: {
        city_id: city.id
      }
    })

    return data
  },
  data: () => ({
    errorsImages: {},

    categories: {},
    fuseCategories: null,
    categoriesSearch: '',
    loadingCategories: true
  }),
  computed: {
    ...mapGetters({
      wishlist: 'auth/wishlist',
      city: 'auth/city'
    }),
  },
  beforeMount () {
    this.$Lazyload.$off('error')
    this.$Lazyload.$on('error', this.onErrorImg)
  },
  methods: {
    ...mapActions({
      pushInWishlist: 'auth/pushInWishlist',
      removeFromWishlist: 'auth/removeFromWishlist'
    }),
    onErrorImg ({ el }) {
      let id = el.getAttribute('data-id')
      let type = el.getAttribute('data-type')
      if (id) {
        if (!this.errorsImages[type]) {
          this.$set(this.errorsImages, type, { [Number(id)]: true })
        } else {
          this.$set(this.errorsImages[type], Number(id), true)
        }
      }
    },
    onClickLink () {
      this.$scrollTo(this.$refs.start, 500, {
        offset: -60,
        x: false,
        y: true
      })
    }
  }
}
</script>

<style>
</style>
