<template>
  <div v-if="true">
    <div class="container mb-5">
      <h5 class="mb-2">
        Мои организации
      </h5>
      <search-input
        v-model="params.search"
      />
    </div>

    <div class="container container--long-offset">
      <div class="row">
        <div
          class="col-md-6 col-lg-4 mb-4 mb-sm-5 text-right"
        >
          <router-link :to="{ name: 'management.organizations.create' }"
                       class="btn btn-outline-primary btn-block btn-sm d-md-none">
            + Добавить организацию
          </router-link>
          <router-link :to="{ name: 'management.organizations.create' }" class="card--empty d-none d-md-flex" />
        </div>
        <div
          v-for="(item, index) in items"
          :key="index"
          class="col-md-6 col-lg-4 mb-5"
        >
          <div class="card w-100 h-100">
            <router-link
              :to="{ name: 'management.organizations.edit', params: { organizationId: item.id } }"
              :class="{'p-3': (item.logo && item.logo.src && !errorLogos[item.id]), 'pb-3': !(item.logo && item.logo.src && !errorLogos[item.id])}"
              class="card-img-top d-block"
            >
              <div class="embed-responsive embed-responsive-1by1">
                <div
                  :style="{backgroundColor: (item.logo && item.logo.color)?item.logo.color:'#FFFFFF'}"
                  class="embed-responsive-item">
                  <img
                    v-lazy="item.logo.src"
                    v-if="item.logo && item.logo.src"
                    :data-id="item.id" :alt="item.name"
                    :title="item.name"
                    class="card-img-top--no-error"
                    src="/placeholders/loading_spinner.gif"
                    @error="onError">
                  <div v-else class="img-cover w-100 h-100" style="background-image: url('/placeholders/logo.svg');" />
                  <div class="card-img-top--error img-cover w-100 h-100" style="background-image: url('/placeholders/error.svg');" />
                </div>
              </div>
            </router-link>
            <div class="card-header border-0 py-0">
              <div class="text-dark text-center" v-text="item.name" />
            </div>
            <div class="card-body pb-3">
              <div class="d-flex justify-content-around mb-4">
                <router-link
                  :to="{ name: 'management.organizations.points.index', params: { organizationId: item.id } }"
                  class="btn btn-gray btn-sm px-4">
                  <span class="px-2">Точки</span>
                </router-link>
                <router-link
                  :to="{ name: 'management.organizations.products.index', params: { organizationId: item.id } }"
                  class="btn btn-gray btn-sm px-4">
                  <span class="px-2">Акции</span>
                </router-link>
              </div>
              <p v-if="item.description" class="card-text pt-3"
                 v-html="(item.description)?item.description.replaceAll('\n', '<br>'):item.description" />
            </div>
            <div class="card-buttons mt-auto text-nowrap">
              <router-link :to="{ name: 'management.organizations.edit', params: { organizationId: item.id } }"
                           class="card-btn card-btn--left text-muted btn btn-outline-secondary">
                <fa icon="pencil-alt" class="mr-2" />
                Редактировать
              </router-link>
              <div
                class="card-btn card-btn--right btn btn-outline-danger"
                @click="deleteHandle(item.id)"
              >
                Удалить
              </div>
            </div>
          </div>
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
        next-class="d-none" />

    </div>
  </div>
</template>

<script>
import { getQueryData, watchList } from '~/utils'
import axios from 'axios'

let listWatchInstancePage = watchList(axios, 'indexApiUrl', 'page')
let listWatchInstanceSearch = watchList(axios, 'indexApiUrl', 'search')
let listWatchInstanceDelete = watchList(axios, 'indexApiUrl', 'delete')

export default {
  components: {
    'SearchInput': () => import('~/components/SearchInput'),
    'Paginate': () => import('vuejs-paginate/src/components/Paginate.vue')
  },
  middleware: ['auth'],
  head () {
    return {
      title: 'Мои организации',
      bodyAttrs: {
        class: 'theme-business'
      }
    }
  },
  asyncData: async ({ query }) => {
    let indexApiUrl = 'management/organizations'
    let list = {}
    let params = getQueryData({ query })

    try {
      const { data } = await axios.get(indexApiUrl, { params })
      list = data
    } catch (e) {
    }
    return {
      indexApiUrl,
      params,
      list
    }
  },
  data: () => ({
    errorLogos: {}
  }),
  computed: {
    items () {
      return (this.list && this.list.data) ? this.list.data : []
    },
    pageCount () {
      return (this.list && this.list.total) ? Math.ceil(this.list.total / this.params.perPage) : 0
    }
  },
  watch: {
    'params.search': listWatchInstanceSearch,
    'params.page': listWatchInstancePage
  },
  mounted () {
    let vm = this
    this.$Lazyload.$on('error', function ({ bindType, el, naturalHeight, naturalWidth, $parent, src, loading, error }, formCache) {
      let id = el.getAttribute('data-id')
      if (id) {
        vm.$set(vm.errorLogos, Number(id), true)
      }
    })
  },
  beforeDestroy () {
    this.$Lazyload.$off('loaded')
  },
  methods: {
    onError (e) {
      console.log(e)
    },
    async deleteHandle (id) {
      let res = await this.$confirmDelete()
      if (res.value) {
        try {
          await axios.delete('management/organizations/' + id)
          listWatchInstanceDelete.call(this)
        } catch (e) {
          listWatchInstanceDelete.call(this)
        }
      }
    }
  }

}
</script>

<style>
</style>
