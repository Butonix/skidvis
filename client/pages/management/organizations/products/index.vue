<template>
  <div>
    <div class="container mb-5">
      <h5 class="mb-2">
        Акции организации
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
              <dynamic-label-input
                class-wrapper="card-img-top__label"
                class-box="card-img-top__label__input"
                class-input="ff-mplus-1p"
              />
              <thumb-product

              />
            </div>
            <label class="card-body pb-2 pt-4">
              <textarea cols="30" rows="4" placeholder="Короткое описание">123123213</textarea>
            </label>
            <div class="card-buttons mt-auto text-nowrap">
              <router-link :to="{ name: 'management.organizations.edit', params: { id: item.id } }" class="card-btn card-btn--full btn btn-outline-primary" >
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
        list = data
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
