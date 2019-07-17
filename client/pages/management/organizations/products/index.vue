<template>
  <div>
    <div class="container mb-5">
      <h5 class="mb-2">
        Акции организации
      </h5>
      <search-input
        :value="search"
        @input="setSearch"
      />
    </div>

    <div class="container container--long-offset">
      <div class="row">
        <div
          class="col-md-6 col-lg-4 mb-4 mb-sm-5 text-right"
        >
          <router-link :to="{ name: 'management.organizations.create' }" class="btn btn-outline-primary btn-block btn-sm d-md-none" >
            + Добавить акцию
          </router-link>
          <router-link :to="{ name: 'management.organizations.create' }" class="card--empty d-none d-md-flex"/>
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
        :value="page"
        :page-count="pageCount"
        :page-range="3"
        :margin-pages="1"
        :hide-prev-next="true"
        :container-class="'pagination'"
        :page-class="'page-item'"
        prev-class="d-none"
        next-class="d-none"
        @input="setPage"/>

    </div>
  </div>
</template>

<script>

import mixinSwal from '~/mixins/sweetalert2'
import axios from 'axios'
import { mapActions, mapGetters } from 'vuex'
import SearchInput from '~/components/SearchInput'
import DynamicLabelInput from '~/components/Edit/Inputs/DynamicLabelInput'
import Paginate from 'vuejs-paginate/src/components/Paginate.vue'
import ThumbProduct from '~/components/Edit/ThumbProduct.vue'

export default {
  components: {
    SearchInput,
    ThumbProduct,
    DynamicLabelInput,
    Paginate
  },
  mixins: [
    mixinSwal
  ],
  middleware: ['auth', 'management/organizations'],
  head () {
    return {
      title: 'Мои организации',
      bodyAttrs: {
        class: 'theme-default'
      }
    }
  },
  data: () => ({
  }),
  computed: {
    ...mapGetters({
      search: 'organizations/getSearch',
      items: 'organizations/getItems',
      pageCount: 'organizations/getPageCount',
      page: 'organizations/getPage'
    })
  },
  methods: {
    ...mapActions({
      setSearch: 'organizations/setSearch',
      setPage: 'organizations/setPage',
      fetchItems: 'organizations/fetchItems'
    }),
    async deleteHandle (id) {
      let res = await this.$confirmDelete()
      if (res.value) {
        try {
          let { data } = await axios.delete('organization/' + id)
          this.fetchItems()
        } catch (e) {
          this.fetchItems()
        }
      }
    }
  }

}
</script>

<style>
</style>
