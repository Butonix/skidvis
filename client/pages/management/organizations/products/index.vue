<template>
  <div>
    <div class="container mb-5">
      <h5 class="mb-2">
        Мои организации
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
          <div class="card w-100 h-100">
            <router-link :to="{ name: 'management.organizations.edit', params: { id: item.id } }" class="card-img-top d-block p-3">
              <div class="embed-responsive embed-responsive-1by1">
                <div
                  :style="{backgroundColor: (item.logo && item.logo.color)?item.logo.color:'#FFFFFF'}"
                  class="embed-responsive-item">
                  <img v-lazy="item.logo.src" v-if="item.logo && item.logo.src" :alt="item.name" :title="item.name" src="/placeholders/loading_spinner.gif">
                </div>
              </div>
            </router-link>
            <div class="card-header border-0 py-0">
              <div class="text-dark text-center" v-text="item.name"/>
            </div>
            <div class="card-body pb-3">
              <div class="d-flex justify-content-around mb-4">
                <a href="#" class="btn btn-gray btn-sm px-4"><span class="px-2">Точки</span></a>
                <a href="#" class="btn btn-gray btn-sm px-4"><span class="px-2">Акции</span></a>
              </div>
              <p v-if="item.description" class="card-text pt-3" v-text="item.description"/>
            </div>
            <div class="card-buttons mt-auto text-nowrap">
              <router-link :to="{ name: 'management.organizations.edit', params: { id: item.id } }" class="card-btn card-btn--left text-muted btn btn-outline-secondary" >
                <fa icon="pencil-alt" class="mr-2"/>Редактировать
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
        class: 'theme-edit'
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
