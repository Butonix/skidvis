<template>
  <div ref="start">
    <div class="container orgs mb-5">
      <search-input
        v-model="orgs.urlQuery.search"
        autofocus="autofocus"
        form-class="mb-4"
      />
      <div v-if="getFavCategoriesSorted.length" class="d-flex justify-content-between">
        <div class="text-muted small mb-2">
          Категории
        </div>
        <div class=" mb-2">
          <a v-if="orgs.urlQuery.categories.length" href="javascript:void(0)" class="mr-2 text-muted small cursor-pointer"
             @click="clearSelectedCategories">
            Сбросить
          </a>
          <a href="javascript:void(0)" class="text-muted small cursor-pointer"
             @click="handleAllCats">
            Все <chevron style="transform-origin: center; transform: rotate(-90deg)"/>
          </a>
        </div>
      </div>
      <categories-scroll
        :categories="getFavCategoriesSorted"
        :categories-active-ids="orgs.urlQuery.categories"
        @clickitem="filter('categories', $event)"
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

    <modal name="save-categories">
      <div class="basic-modal categories-modal">
        <div class="position-relative">
          <div :class="{'active': loadingCategories}" class="preloader"/>
          <div class="">
            Выбрано {{ orgs.urlQuery.categories.length }} из {{ getCategories.length }}
            <div class="">
              <div class="d-flex">
                <search-input
                  v-model="categoriesSearch"
                  form-class="mb-4 flex-grow-1"
                  autofocus="autofocus"
                />
                <div v-if="orgs.urlQuery.categories.length" class="pl-3">
                  <div class="btn btn-primary btn-sm"
                       @click="clearSelectedCategories">
                    Сбросить
                  </div>
                </div>
              </div>
              <categories>
                <category
                  v-for="(category, key) in categoriesSelected"
                  :active="true"
                  :key="'categories-selected-'+key"
                  :label="category.name"
                  :src-active="category.images.default.active || '/img/categories/entertainment/entertainment-default-active.svg'"
                  :src="category.images.default.normal || '/img/categories/entertainment/entertainment-default-normal.svg'"
                  @click="filter('categories', category)"
                />
                <category
                  v-for="(category, key) in getCategoriesSearchable"
                  v-if="!categoriesSelected[category.id]"
                  :key="'categories-'+key"
                  :label="category.name"
                  :src-active="category.images.default.active || '/img/categories/entertainment/entertainment-default-active.svg'"
                  :src="category.images.default.normal || '/img/categories/entertainment/entertainment-default-normal.svg'"
                  @click="filter('categories', category)"
                />
              </categories>
            </div>
          </div>
        </div>
        <div class="text-center mt-4 mt-xs-5">
          <button class="btn btn-outline-primary ml-sm-2 mb-3 mb-sm-0 btn-sm--sm"
                  @click="$modal.pop()"
          >
            Готово
          </button>
        </div>
      </div>
    </modal>

  </div>
</template>

<script>
import Fuse from 'fuse.js'
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
  allowedParams: ['city_id', 'categories'],
  urlQuery: {
    perPage: 50
  },
  buildWatchers ({ beforeTypes, getWatcher, globalNamespace }) {
    return {
      [`${globalNamespace}.urlQuery.categories`]: getWatcher({ type: beforeTypes.SEARCH }),
      [`${globalNamespace}.urlQuery.city_id`]: getWatcher({ type: beforeTypes.SEARCH }),
      'city': function (v) {
        if (v.id) {
          this.urlQuery.city_id = v.id
        }
      }
    }
  }
})

export default {
  components: {
    'Chevron': () => import('~/components/Icons/Chevron'),
    'Flag': () => import('~/components/Flag'),
    'SearchInput': () => import('~/components/SearchInput'),
    'CardLogo': () => import('~/components/Product/CardLogo'),
    'CategoriesScroll': () => import('~/components/CategoriesScroll'),
    'Categories': () => import('~/components/Categories'),
    'Category': () => import('~/components/Category'),
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
    let favCategories = {}
    let categoriesSelected = {}
    let city = app.store.getters['auth/city']

    if (typeof query.city_id !== 'undefined' && query.city_id !== city.id) {
      await app.store.dispatch('auth/setCity', query.city_id)
    }

    let data = await List.getStartData({
      query,
      defaultApiQuery: {

      },
      defaultUrlQuery: {
        categories: [],
        city_id: city.id
      }
    })

    try {
      let { data } = await axios.get('categories', {
        params: {
          products: 1,
          favorites: 1,
          perPage: 100000,
          orWhereIn: query.categories || []
        }
      })
      favCategories = data
    } catch (e) {
      console.log(e)
    }
    return {
      ...data,
      categoriesSelected,
      favCategories
    }
  },
  data: () => ({
    loadingList: false,
    isLoadMore: false,
    loadedMoreList: true,
    errorsImages: {},

    categories: {},
    fuseCategories: null,
    categoriesSearch: '',
    loadingCategories: true,
    categoriesTotal: 0
  }),
  computed: {
    ...mapGetters({
      wishlist: 'auth/wishlist',
      city: 'auth/city'
    }),
    getCategories () {
      return (this.categories.list && this.categories.list.data) ? this.categories.list.data : []
    },
    getCategoriesSearchable () {
      return (this.fuseCategories && this.categoriesSearch.length > 0) ? this.fuseCategories.search(this.categoriesSearch) : this.getCategories
    },
    getFavCategories () {
      return (this.getCategories.length) ? this.getCategories
        : ((this.favCategories.list && this.favCategories.list.data) ? this.favCategories.list.data : [])
    },
    getFavCategoriesSorted () {
      let active = []
      let noActive = []
      if (this.orgs.urlQuery.categories && this.orgs.urlQuery.categories.length && this.getFavCategories.length) {
        for (let i in this.getFavCategories) {
          let cat = this.getFavCategories[i]
          if (this.orgs.urlQuery.categories.indexOf(cat.id) !== -1) {
            active.push(cat)
          } else {
            noActive.push(cat)
          }
        }
        return active.concat(noActive)
      } else {
        return this.getFavCategories
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
    clearSelectedCategories () {
      this.orgs.urlQuery.categories = []
      this.categoriesSelected = {}
    },
    async handleAllCats () {
      this.$modal.push('save-categories')
      if (!this.getCategories.length) {
        this.loadingCategories = true
        try {
          let { data } = await axios.get('categories', {
            params: {
              products: 1,
              perPage: 1000000,
              page: 1
            }
          })
          this.categories = data
          this.fuseCategories = new Fuse(this.getCategories, {
            shouldSort: true,
            threshold: 0.6,
            location: 0,
            distance: 100,
            maxPatternLength: 32,
            minMatchCharLength: 1,
            keys: [
              'name'
            ]
          })
        } catch (e) {
          console.log(e)
          await this.$callToast({
            type: 'error',
            text: 'Загрузить все категории не удалось'
          })
          this.$modal.pop()
        }
        this.loadingCategories = false
      }
    },
    filter (type, item) {
      switch (type) {
        case 'categories':
          let id = Number(item.id)
          let index = this.orgs.urlQuery.categories.indexOf(id)
          if (index === -1) {
            this.orgs.urlQuery.categories.push(id)
            this.categoriesSelected[id] = { ...item }
          } else {
            this.$delete(this.orgs.urlQuery.categories, index)
            this.$delete(this.categoriesSelected, id)
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
