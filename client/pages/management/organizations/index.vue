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
          <div class="btn btn-outline-primary btn-block btn-sm d-md-none">
            + Добавить организацию
          </div>
          <router-link :to="{ name: 'management.organizations.create' }" class="card--empty d-none d-md-flex"/>
        </div>
        <div
          v-for="(item, index) in items"
          :key="index"
          class="col-md-6 col-lg-4 mb-5"
        >
          <div class="card w-100 h-100">
            <router-link :to="{ name: 'management.organizations.edit', params: { id: item.id } }" class="card-img-top d-block">
              <div class="embed-responsive embed-responsive-1by1">
                <div
                  :style="{backgroundColor: (item.logo && item.logo.color)?item.logo.color:'#FFFFFF'}"
                  class="embed-responsive-item">
                  <img v-if="item.logo && item.logo.src" :src="item.logo.src" :alt="item.name" :title="item.name">
                </div>
              </div>
            </router-link>
            <div class="card-header border-0 pb-0">
              <div class="text-dark text-center" v-text="item.name"/>
            </div>
            <div class="card-body pb-3">
              <div class="d-flex justify-content-around mb-4">
                <a href="#" class="btn btn-gray btn-sm px-4"><span class="px-2">Точки</span></a>
                <a href="#" class="btn btn-gray btn-sm px-4"><span class="px-2">Акции</span></a>
              </div>
              <p class="card-text pt-3" v-text="item.description"/>
            </div>
            <div class="card-buttons mt-auto text-nowrap">
              <a href="/" class="card-btn card-btn--left text-muted btn btn-outline-secondary">
                <fa icon="pencil-alt" class="mr-2"/>Редактировать
              </a>
              <a href="/" class="card-btn card-btn--right btn btn-outline-danger">
                Удалить
              </a>
            </div>
          </div>
        </div>
      </div>
      <!--      <pagination :data="data" @pagination-change-page="setCurrentPage"></pagination>-->
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import SearchInput from '~/components/SearchInput'
// import Paginate from 'laravel-vue-pagination'

export default {
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
    SearchInput
    // Paginate
  },
  computed: {
    ...mapGetters({
      search: 'organizations/getSearch',
      items: 'organizations/getItems',
      data: 'organizations/getData'
    })
  },
  methods: {
    ...mapActions({
      setSearch: 'organizations/setSearch',
      setCurrentPage: 'organizations/setCurrentPage'
    })
  },
  mounted () {
  }

}
</script>

<style>
</style>
