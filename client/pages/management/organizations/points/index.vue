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
    <div class="container">
      <div class="row mb-4">
        <div class="col-12 col-md mb-2">
          <h5>
            Все адреса организации (39):
          </h5>
        </div>
        <div class="col-12 col-md-auto mb-2">
          <router-link :to="{ name: 'management.organizations.create' }" class="btn btn-outline-primary btn-sm" >
            + Добавить организацию
          </router-link>
        </div>
      </div>
    </div>
    <div class="container" style="min-height: 500px">
      <div v-for="point in points" class="row mb-4">
        <div class="col-auto text-primary pr-0">
          <fa icon="map-marker-alt" />
        </div>
        <div class="col pl-2">
          <div class="text-primary">
            {{ point.address }} {{ (point.name)?`(${point.name})`:'' }}
          </div>
          {{ point.time }}
          <div class="font-weight-bolder d-block d-md-none">
            <div>
              {{ point.email }}
            </div>
            {{ point.phone }}
          </div>
        </div>
        <div class="col-4 font-weight-bolder d-none d-md-block">
          <div>
            {{ point.email }}
          </div>
          {{ point.phone }}
        </div>
      </div>
    </div>
    <div class="container mt-5">

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
  components: {
    SearchInput,
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
        class: 'theme-edit'
      }
    }
  },
  data: () => ({
    points: [
      {
        name: 'ТРЦ «Питерленд»',
        address: 'Беговая, Приморский пр-т, 72, этаж 3',
        time: '10:00-21:00',
        email: 'info@sdk.jfhlksdhjfg.com',
        phone: '8 9122 938-00-33'
      },
      {
        name: 'ТРЦ «Питерленд»',
        address: 'Беговая, Приморский пр-т, 72, этаж 3',
        time: '10:00-21:00',
        email: 'info@sdk.jfhlksdhjfg.com',
        phone: '8 9122 938-00-33'
      },
      {
        name: 'ТРЦ «Питерленд»',
        address: 'Беговая, Приморский пр-т, 72, этаж 3',
        time: '10:00-21:00',
        email: 'info@sdk.jfhlksdhjfg.com',
        phone: '8 9122 938-00-33'
      },
      {
        name: 'ТРЦ «Питерленд»',
        address: 'Беговая, Приморский пр-т, 72, этаж 3',
        time: '10:00-21:00',
        email: 'info@sdk.jfhlksdhjfg.com',
        phone: '8 9122 938-00-33'
      },
      {
        name: 'ТРЦ «Питерленд»',
        address: 'Беговая, Приморский пр-т, 72, этаж 3',
        time: '10:00-21:00',
        email: 'info@sdk.jfhlksdhjfg.com',
        phone: '8 9122 938-00-33'
      },
      {
        name: 'ТРЦ «Питерленд»',
        address: 'Беговая, Приморский пр-т, 72, этаж 3',
        time: '10:00-21:00',
        email: 'info@sdk.jfhlksdhjfg.com',
        phone: '8 9122 938-00-33'
      },
      {
        name: 'ТРЦ «Питерленд»',
        address: 'Беговая, Приморский пр-т, 72, этаж 3',
        time: '10:00-21:00',
        email: 'info@sdk.jfhlksdhjfg.com',
        phone: '8 9122 938-00-33'
      },
      {
        name: 'ТРЦ «Питерленд»',
        address: 'Беговая, Приморский пр-т, 72, этаж 3',
        time: '10:00-21:00',
        email: 'info@sdk.jfhlksdhjfg.com',
        phone: '8 9122 938-00-33'
      },
      {
        name: 'ТРЦ «Питерленд»',
        address: 'Беговая, Приморский пр-т, 72, этаж 3',
        time: '10:00-21:00',
        email: 'info@sdk.jfhlksdhjfg.com',
        phone: '8 9122 938-00-33'
      },
      {
        name: 'ТРЦ «Питерленд»',
        address: 'Беговая, Приморский пр-т, 72, этаж 3',
        time: '10:00-21:00',
        email: 'info@sdk.jfhlksdhjfg.com',
        phone: '8 9122 938-00-33'
      }
    ]
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
