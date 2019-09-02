<template>
  <div ref="start">
    <breadcrumbs/>
    <div class="container mb-5">
      <h5 class="mb-2">
        Акции организации
      </h5>
      <search-input
        v-model="prods.urlQuery.search"
        autofocus="autofocus"
      />
    </div>

    <div class="container container--long-offset">
      <div class="row position-relative">
        <div :class="{'active': prodsIsLoading}"
             class="loading-list"
        />
        <div
          class="col-md-6 col-lg-4 mb-4 mb-sm-5 text-right"
        >
          <router-link :to="{ name: 'management.organizations.products.create', params: { organizationId } }" class="btn btn-outline-primary btn-block btn-sm d-md-none" >
            + Добавить акцию
          </router-link>
          <router-link :to="{ name: 'management.organizations.products.create', params: { organizationId } }" class="card--empty d-none d-md-flex"/>
        </div>

        <transition
          v-for="(item, index) in prodsItems"
          :key="index"
          name="fade" mode="out-in"
        >
          <div
            class="col-md-6 col-lg-4 mb-5"
          >
            <div class="card card--product w-100 h-100">
              <router-link :to="{ name: 'products.show', params: { productId: item.id } }"
                           :class="{
                             'with-logo':item.organization_logo,
                             'error-logo':(errorsImages.logo)?errorsImages.logo[item.id]:false,
                             'error-cover':(errorsImages.cover)?errorsImages.cover[item.id]:false
                           }"
                           class="card-img-top d-block"
                           @click.native="$sTB()">
                <div v-if="!item.is_published" class="card-img-top__message">
                  <div>
                    Не опубликован
                  </div>
                </div>
                <div v-if="item.currency_id"
                     :class="{'card-img-top__label--present':item.currency_id === 3}"
                     class="card-img-top__label">
                  <present-card
                    v-if="item.currency_id === 3"/>
                  <span v-else-if="item.value">
                    {{ item.value }}{{ (item.currency_id === 1)? '%' : '₽' }}
                  </span>
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
              <label class="card-body pb-2 pt-4" v-html="(item.name)?item.name.replaceAll('\n', '<br>'):''"/>
              <div class="card-buttons mt-auto text-nowrap">
                <router-link :to="{ name: 'management.organizations.products.edit', params: { organizationId: organizationId, productId: item.id } }"
                             class="card-btn card-btn--full btn btn-outline-primary"
                             @click.native="$sTB()">
                  <fa icon="pencil-alt" class="mr-2"/>Редактировать акцию
                </router-link>
                <div class="card-buttons__controls">
                  <div class="card-buttons__controls__left d-none"><fa :icon="['fas', 'chevron-left']"/></div>
                  <div class="card-buttons__controls__delete"
                       @click="deleteHandle(item.id)"
                  >
                    <div class="card-buttons__controls__chevron"/>
                    <fa :icon="['far', 'trash-alt']"/> Удалить акцию
                  </div>
                  <div class="card-buttons__controls__right d-none"><fa :icon="['fas', 'chevron-right']"/></div>
                </div>
              </div>
            </div>
          </div>
        </transition>

      </div>

      <paginate-list
        :params="prodsParams"
      />

    </div>
  </div>
</template>

<script>
import BuildList from '~/mixins/list'
import { getFavicon } from '~/utils'
import axios from 'axios'

const globalNamespace = 'prods'

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
    'PresentCard': () => import('~/components/Icons/PresentCard'),
    'CardLogo': () => import('~/components/Product/CardLogo'),
    'SearchInput': () => import('~/components/SearchInput'),
    'PaginateList': () => import('~/components/PaginateList')
  },
  middleware: ['auth'],
  mixins: [List.mixin],
  head () {
    return {
      title: 'Мои акции',
      bodyAttrs: {
        class: 'theme-business'
      },
      ...getFavicon('business')
    }
  },
  asyncData: async ({ params, error, app, query }) => {
    let organizationId = params.organizationId
    let data = await List.getStartData({
      query,
      defaultData: {
        apiUrl: `management/organizations/${organizationId}/products`
      },
      defaultUrlQuery: {
        perPage: 11
      }
    })

    return {
      ...data,
      organizationId
    }
  },
  data: () => ({
    loadingList: false,
    errorsImages: {}
  }),
  beforeMount () {
    this.$Lazyload.$off('error')
    this.$Lazyload.$on('error', this.onErrorImg)
  },
  methods: {
    async deleteHandle (id) {
      let res = await this.$confirmDelete()
      if (res.value) {
        try {
          await axios.delete('management/organizations/' + this.organizationId + '/products/' + id)
          wacherListDelete.call(this)
        } catch (e) {
          wacherListDelete.call(this)
        }
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
