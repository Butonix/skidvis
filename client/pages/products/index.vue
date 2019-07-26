<template>
  <div>
    <div class="container mb-5">
      <h5 class="mb-2">
        Все акции
      </h5>
      <search-input
        v-model="params.search"
        autofocus="autofocus"
      />
    </div>

    <div class="container container--long-offset">
      <div class="row">
        <div
          v-for="(item, index) in items"
          :key="index"
          class="col-md-6 col-lg-4 mb-5"
        >
          <div class="card card--product w-100 h-100">
            <router-link :to="{ name: 'products.show', params: { productId: item.id } }" class="card-img-top d-block" >
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
            </router-link>
            <label class="card-body pb-2 pt-4" v-html="(item.short_description)?item.short_description.replaceAll('\n', '<br>'):''"/>
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
import Paginate from 'vuejs-paginate/src/components/Paginate.vue'

let listWatchInstancePage = watchList(axios, 'indexApiUrl', 'page')
let listWatchInstanceSearch = watchList(axios, 'indexApiUrl', 'search')

export default {
  components: {
    SearchInput,
    Paginate
  },
  middleware: ['auth'],
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
    let list = {}
    let params_ = getQueryData({ query })

    let organizationId = params.organizationId

    if (organizationId) {
      indexApiUrl = 'management/products'
      try {
        let { data } = await axios.get(indexApiUrl, {
          params: params_
        })
        list = data.products
      } catch (e) {
        error({ statusCode: 500, message: 'Упс' })
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
  }
}
</script>

<style>
</style>
