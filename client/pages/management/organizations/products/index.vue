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
            + Добавить организацию
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
              <router-link :to="{ name: 'management.organizations.edit', params: { id: item.id } }" class="d-block">
                <div class="embed-responsive embed-responsive-1by1">
                  <div
                    class="embed-responsive-item">
                    <img v-lazy="item.logo.src" v-if="item.logo && item.logo.src" :alt="item.name" :title="item.name" src="/placeholders/loading_spinner.gif">
                  </div>
                </div>
              </router-link>
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
import Paginate from 'vuejs-paginate/src/components/Paginate.vue'

export default {
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
  components: {
    SearchInput,
    Paginate
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
      let res = await this.$swal(this.configSwal().confirm)
      if (res.value) {
        try {
          let { data } = await axios.delete('/1/organization/' + id)
          this.fetchItems()
        } catch (e) {
          this.fetchItems()
        }
      }
    }
  },
  mounted () {
    console.log('mounted', this.data)
  }

}
</script>

<style>
</style>
