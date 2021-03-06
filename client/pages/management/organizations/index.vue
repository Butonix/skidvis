<template>
  <div ref="start">
    <breadcrumbs/>
    <div class="container mb-5">
      <h5 class="mb-2">
        Мои организации
      </h5>
      <search-input
        v-model="orgs.urlQuery.search"
        autofocus="autofocus"
      />
    </div>

    <div class="container container--long-offset">
      <div class="row position-relative">
        <div :class="{'active': orgsIsLoading}"
             class="loading-list"
        />
        <div
          v-if="isAdministrator"
          class="col-md-6 col-lg-4 mb-4 mb-sm-5 text-right"
        >
          <router-link :to="{ name: 'management.organizations.create' }"
                       class="btn btn-outline-primary btn-block btn-sm d-md-none">
            + Добавить организацию
          </router-link>
          <router-link :to="{ name: 'management.organizations.create' }" class="card--empty d-none d-md-flex" />
        </div>
        <transition
          v-for="(item, index) in orgsItems"
          :key="index"
          name="fade" mode="out-in"
        >
          <div
            class="col-md-6 col-lg-4 mb-5"
          >
            <div class="card w-100 h-100">
              <router-link
                :to="{ name: 'organizations.show', params: { organizationId: item.id } }"
                :class="{
                  'error-logo':(errorsImages.logo)?errorsImages.logo[item.id]:false,
                }"
                class="card-img-top d-block"
                @click.native="$sTB()"
              >
                <div v-if="!item.is_published" class="card-img-top__message">
                  <div>
                    Не опубликован
                  </div>
                </div>
                <div class="embed-responsive embed-responsive-1by1">
                  <div class="embed-responsive-item">
                    <card-logo
                      :img="(item.logo && item.logo.src)?item.logo.src:undefined"
                      :color="(item.logo && item.logo.color)?item.logo.color:undefined"
                      :title="item.name"
                      :alt="item.name"
                      :id="item.id"
                    />
                  </div>
                </div>
              </router-link>
              <div class="card-header border-0 py-0">
                <div class="text-dark text-center" v-text="item.name" />
              </div>
              <div class="card-body pb-3">
                <div class="d-flex justify-content-around mb-4">
                  <router-link
                    v-if="isAdministrator || isManagement"
                    :to="{ name: 'management.organizations.points.index', params: { organizationId: item.id } }"
                    class="btn btn-gray btn-sm px-4 px-lg-3 px-xl-4"
                    @click.native="$sTB()">
                    <span class="px-2">Адреса</span>
                  </router-link>
                  <router-link
                    v-if="isAdministrator || isManagement"
                    :to="{ name: 'management.organizations.products.index', params: { organizationId: item.id } }"
                    class="btn btn-gray btn-sm px-4 px-lg-3 px-xl-4"
                    @click.native="$sTB()">
                    <span class="px-2">Акции</span>
                  </router-link>
                </div>
                <div v-if="isSuperAdministrator" class="d-flex justify-content-around mb-4">
                  <router-link
                    :to="{ name: 'management.organizations.services', params: { organizationId: item.id } }"
                    class="btn btn-gray btn-sm px-4 px-lg-3 px-xl-4"
                    @click.native="$sTB()">
                    <span class="px-2">Платные сервисы</span>
                  </router-link>
                </div>
              </div>
              <div v-if="isAdministrator" class="card-buttons mt-auto text-nowrap">
                <router-link :to="{ name: 'management.organizations.edit', params: { organizationId: item.id } }"
                             class="card-btn card-btn--left text-muted btn btn-outline-secondary"
                             @click.native="$sTB()">
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
        </transition>

      </div>

      <paginate-list
        :params="orgsParams"
      />

    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import BuildList from '~/mixins/list'
import { getFavicon } from '~/utils'
import axios from 'axios'

const globalNamespace = 'orgs'

const List = BuildList({
  axios,
  globalNamespace,
  apiUrl: 'management/organizations',
  pathResponse: 'list.data',
  pathTotal: 'list.total',
  urlQuery: {
    perPage: 11
  }
})
const wacherListDelete = List.getWatcher({ type: List.afterTypes.DELETE })

export default {
  components: {
    'SearchInput': () => import('~/components/SearchInput'),
    'CardLogo': () => import('~/components/Product/CardLogo'),
    'PaginateList': () => import('~/components/PaginateList')
  },
  middleware: ['auth'],
  mixins: [List.mixin],
  head () {
    return {
      title: 'Мои организации',
      bodyAttrs: {
        class: 'theme-business theme-management'
      },
      ...getFavicon('business')
    }
  },
  asyncData: async ({ query, error }) => {
    let data = await List.getStartData({
      error,
      query,
      defaultUrlQuery: {
        perPage: 11
      }
    })

    return data
  },
  data: () => ({
    errorsImages: {}
  }),
  computed: mapGetters({
    isSuperAdministrator: 'auth/isSuperAdministrator',
    isAdministrator: 'auth/isAdministrator',
    isManagement: 'auth/isManagement'
  }),
  beforeMount () {
    this.$Lazyload.$off('error')
    this.$Lazyload.$on('error', this.onErrorImg)
  },
  methods: {
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
    async deleteHandle (id) {
      let res = await this.$confirmDelete()
      if (res.value) {
        try {
          await axios.delete('management/organizations/' + id)
          wacherListDelete.call(this)
        } catch (e) {
          wacherListDelete.call(this)
        }
      }
    }
  }

}
</script>

<style>
</style>
