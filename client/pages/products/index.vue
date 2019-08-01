<template>
  <div>
    <div class="container mb-5">
      <search-input
        v-model="params.search"
        autofocus="autofocus"
        form-class="mb-4"
      />
      <div class="text-muted small mb-2">
        Категории
      </div>
      <categories>
        <category
          v-for="(category, key) in getCategories"
          :key="'categories-'+key"
          :active="params.categories.indexOf(String(category.id)) !== -1"
          :label="category.name"
          :src-active="category.images.default.active || '/img/categories/entertainment/entertainment-default-active.svg'"
          :src="category.images.default.normal || '/img/categories/entertainment/entertainment-default-normal.svg'"
          @click="filter('categories',category)"
        />
      </categories>
    </div>

    <div class="container container--long-offset">
      <div class="row">
        <div
          v-for="(item, index) in items"
          v-if="items.length"
          :key="index"
          class="col-md-6 col-lg-4 mb-5"
        >
          <div
            class="card card--product w-100 h-100"
          >
            <router-link :to="{ name: 'products.show', params: { productId: item.id } }"
                         :class="{
                           'with-logo':item.organization_logo,
                           'error-logo':(errorsImages.logo)?errorsImages.logo[item.id]:false,
                           'error-cover':(errorsImages.cover)?errorsImages.cover[item.id]:false
                         }"
                         class="card-img-top d-block" >
              <div v-if="item.currency_id && item.value" class="card-img-top__label">
                {{ item.value }}{{ (item.currency_id === 1)? '%' : '₽' }}
              </div>
              <div class="embed-responsive">
                <div class="embed-responsive-item">

                  <div
                    v-lazy:background-image="{
                      src: item.images[0].src,
                      loading: '/placeholders/cover.jpg'
                    }"
                    v-if="item.images && item.images[0] && item.images[0].src"
                    data-loading="/placeholders/cover.jpg"
                    class="card-img-top__cover bg-cover"
                    role="img"/>
                  <div
                    v-else :style="{backgroundImage: '/placeholders/cover.jpg'}"
                    class="card-img-top__cover img-cover"
                    role="img"/>

                  <card-logo
                    v-if="item.organization_logo"
                    :img="item.organization_logo"
                    :color="item.organization_color"
                    :title="item.name"
                    :alt="item.name"
                    :id="item.id"
                  />
                </div>
              </div>
            </router-link>
            <label class="card-body pb-2 pt-4"
                   v-html="((item.short_description)?item.short_description.replaceAll('\n', '<br>'):((item.name)?item.name.replaceAll('\n', '<br>'):''))"
            />
            <div class="card-footer">
              <div class="card-footer__address">
                <div :title="(item.points[0])?((item.points[0].street)?item.points[0].street:item.points[0].full_street):''"
                     class="card-footer__address__wrapper"
                >
                  <div class="card-footer__address__text"
                       v-text="(item.points[0])?((item.points[0].street)?item.points[0].street:item.points[0].full_street):''"
                  />
                </div>
                <div
                  v-if="item.points[1]"
                  class="card-footer__address__btn btn btn-sm btn-gray"
                  @click="activeAddresses ? activeAddresses = 0 : activeAddresses = item.id"
                >
                  еще {{ item.points.length - 1 }}
                </div>
              </div>
              <div class="card-footer__wishlist">
                <flag v-if="wishlist.indexOf(item.id) !== -1" :active="true" class-box="ml-1" title="Удалить из избранного"
                      @click="removeFromWishlist(item.id)"
                />
                <flag v-else :active="false" class-box="ml-1" title="Добавить в избранное"
                      @click="pushInWishlist(item.id)"
                />
              </div>
              <div
                v-if="item.points[1]"
                :class="{'active': activeAddresses === item.id}"
                :style="{
                  maxHeight: (activeAddresses === item.id)? (3 + 2.5 * (item.points.length - 1)) + 'rem': '3rem'
                }"
                class="card-footer__list-address__wrapper"
              >
                <ul class="card-footer__list-address list-unstyled text-muted">
                  <li
                    v-for="(point, index) in item.points"
                    v-if="index !== 0"
                    :key="'list-address__item-'+index"
                    :title="(point.street)?point.street:point.full_street"
                    class="card-footer__list-address__item"
                  >
                    <div class="card-footer__list-address__link" v-text="(point.street)?point.street:point.full_street"/>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="col-12">
          <h5 class="text-center py-5">
            Ничего не нашлось :(
          </h5>
        </div>
      </div>

      <paginate
        v-if="pageCount && pageCount > 1"
        v-model="params.page"
        :page-count="pageCount"
        :page-range="3"
        :margin-pages="1"
        :hide-prev-next="true"
        :container-class="'pagination'"
        :page-class="'page-item'"
        prev-class="d-none"
        next-class="d-none"/>

    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { getQueryData, watchList } from '~/utils'
import axios from 'axios'
import Paginate from 'vuejs-paginate/src/components/Paginate.vue'

let listWatchInstancePage = watchList(axios, 'indexApiUrl', 'page')
let listWatchInstanceSearch = watchList(axios, 'indexApiUrl', 'search')

export default {
  components: {
    'Flag': () => import('~/components/Flag'),
    'SearchInput': () => import('~/components/SearchInput'),
    'CardLogo': () => import('~/components/Product/CardLogo'),
    'Category': () => import('~/components/Category'),
    'Categories': () => import('~/components/Categories'),
    Paginate
  },
  middleware: [],
  head () {
    return {
      title: 'Все акции',
      bodyAttrs: {
        class: 'theme-default'
      }
    }
  },
  asyncData: async ({ params, error, app, query }) => {
    let indexApiUrl
    let collection = {}
    let categories = {}
    let city = app.store.getters['auth/city']

    let params_ = getQueryData({ query,
      defaultData: {
        categories: [],
        city_id: city.id
      }
    })

    if (Number(params_.city_id) !== Number(city.id)) {
      await app.store.dispatch('auth/setCity', params_.city_id)
    }

    indexApiUrl = 'products'
    try {
      let { data } = await axios.get(indexApiUrl, {
        params: params_
      })
      collection = data
    } catch (e) {
      error({ statusCode: 500, message: 'Упс' })
    }

    try {
      let { data } = await axios.get('categories', {
        // params: params_
      })
      categories = data
    } catch (e) {
      console.log(e)
    }

    return {
      categories,
      collection,
      params: params_,
      indexApiUrl
    }
  },
  data: () => ({
    errorsImages: {},
    activeAddresses: 0
  }),
  computed: {
    ...mapGetters({
      wishlist: 'auth/wishlist',
      city: 'auth/city'
    }),
    getCategories () {
      return (this.categories.list && this.categories.list.data) ? this.categories.list.data : []
    },
    items () {
      return (this.collection.list && this.collection.list.data) ? this.collection.list.data : []
    },
    pageCount () {
      return (this.collection.list && this.collection.list.total) ? Math.ceil(this.collection.list.total / this.params.perPage) : 0
    }
  },
  watch: {
    'params.search': listWatchInstanceSearch,
    'params.categories': listWatchInstanceSearch,
    'params.page': listWatchInstancePage,
    'city': function (v) {
      if (v.id) {
        this.params.city_id = v.id
        listWatchInstanceSearch.call(this)
      }
    }
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
    filter (type, item) {
      switch (type) {
        case 'categories':
          let index = this.params.categories.indexOf(String(item.id))
          if (index === -1) {
            this.params.categories.push(String(item.id))
          } else {
            this.$delete(this.params.categories, index)
          }
          break
      }
    },
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
    }
  }
}
</script>

<style>
</style>
