<template>
  <div>
    <div class="container mb-5">
      <h5 class="mb-2">
        Акции организации
      </h5>
      <search-input
        v-model="params.search"
        autofocus="autofocus"
      />
    </div>

    <div class="container container--long-offset">
      <div class="row">
        <div
          class="col-md-6 col-lg-4 mb-4 mb-sm-5 text-right"
        >
          <router-link :to="{ name: 'management.organizations.products.create', params: { organizationId } }" class="btn btn-outline-primary btn-block btn-sm d-md-none" >
            + Добавить акцию
          </router-link>
          <router-link :to="{ name: 'management.organizations.products.create', params: { organizationId } }" class="card--empty d-none d-md-flex"/>
        </div>
        <div
          v-for="(item, index) in items"
          :key="index"
          class="col-md-6 col-lg-4 mb-5"
        >
          <div class="card card--product w-100 h-100">
            <div class="card-img-top">
              <div v-if="item.currency_id && item.value" class="card-img-top__label">
                {{ item.value }}{{ (item.currency_id === 1)? '%' : '₽' }}
              </div>
              <div class="embed-responsive">
                <div class="embed-responsive-item">
                  <img
                    v-lazy="item.images[0].src"
                    v-if="item.images && item.images[0] && item.images[0].src"
                    :data-id="item.id" :alt="item.name"
                    :title="item.name"
                    src="/placeholders/loading_spinner.gif"
                  >
                </div>
              </div>
            </div>
            <label class="card-body pb-2 pt-4" v-html="item.short_description"/>
            <div class="card-buttons mt-auto text-nowrap">
              <router-link :to="{ name: 'management.organizations.products.edit', params: { organizationId: organizationId, productId: item.id } }" class="card-btn card-btn--full btn btn-outline-primary" >
                <fa icon="pencil-alt" class="mr-2"/>Редактировать страницу
              </router-link>
              <div class="card-buttons__controls">
                <div class="card-buttons__controls__left"><fa :icon="['fas', 'chevron-left']"/></div>
                <div class="card-buttons__controls__delete">
                  <div class="card-buttons__controls__chevron"/>
                  <fa :icon="['far', 'trash-alt']"/> Удалить акцию
                </div>
                <div class="card-buttons__controls__right"><fa :icon="['fas', 'chevron-right']"/></div>
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
        next-class="d-none"/>

    </div>
  </div>
</template>

<script>
import { getQueryData, watchList } from '~/utils'
import axios from 'axios'
import SearchInput from '~/components/SearchInput'
import DynamicLabelInput from '~/components/Edit/Inputs/DynamicLabelInput'
import Paginate from 'vuejs-paginate/src/components/Paginate.vue'
import ThumbProduct from '~/components/Edit/ThumbProduct.vue'

let listWatchInstancePage = watchList(axios, 'indexApiUrl', 'page')
let listWatchInstanceSearch = watchList(axios, 'indexApiUrl', 'search')
let listWatchInstanceDelete = watchList(axios, 'indexApiUrl', 'delete')

export default {
  components: {
    SearchInput,
    ThumbProduct,
    DynamicLabelInput,
    Paginate
  },
  middleware: ['auth'],
  head () {
    return {
      title: 'Мои акции',
      bodyAttrs: {
        class: 'theme-default'
      }
    }
  },
  asyncData: async ({ params, error, app, query }) => {
    let indexApiUrl
    let list = {}
    let params_ = getQueryData({ query })

    let organizationId = params.organizationId

    if (organizationId) {
      indexApiUrl = 'management/organizations/' + organizationId + '/products'
      try {
        let { data } = await axios.get(indexApiUrl, {
          params: params_
        })
        list = data.products
        console.log(data.products)
      } catch (e) {
        error({ statusCode: 404, message: 'Organization not found' })
      }
    }

    return {
      list,
      params: params_,
      organizationId: organizationId,
      indexApiUrl
    }
  },
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
  methods: {
    async deleteHandle (id) {
      let res = await this.$confirmDelete()
      if (res.value) {
        try {
          await axios.delete('management/organizations/' + this.organizationId + '/products/' + id)
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
