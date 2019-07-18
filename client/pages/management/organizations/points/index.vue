<template>
  <div>
    <div class="container mb-5">
      <h5 class="mb-2">
        Мои организации
      </h5>
      <search-input
        v-model="params.search"
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
          <div class="btn btn-outline-primary btn-sm" @click="addPoint">
            + Добавить адрес
          </div>
        </div>
      </div>
    </div>
    <div class="container" style="min-height: 500px">
      <div v-for="item in items" class="row mb-4">
        <div class="col-auto text-primary pr-0">
          <fa icon="map-marker-alt" />
        </div>
        <div class="col pl-2">
          <div class="text-primary">
            {{ item.full_street }} {{ (item.name)?`(${item.name})`:'' }}
          </div>
          {{ item.time }}
          <div class="font-weight-bolder d-block d-md-none">
            <div>
              {{ item.email }}
            </div>
            {{ item.phone }}
          </div>
        </div>
        <div class="col-4 font-weight-bolder d-none d-md-block">
          <div>
            {{ item.email }}
          </div>
          {{ item.phone }}
        </div>
      </div>
    </div>
    <div class="container mt-5">

      <paginate
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
    <modal name="add-point">
      <div class="basic-modal">

        <material-input
          type-input="inline"
          placeholder="Название точки"
          form-class="mb-4"
        />

        <material-input
          type-input="inline"
          placeholder="Эл. почта"
          form-class="mb-4"
        />

        <material-input
          type-input="inline"
          placeholder="Телефон"
          form-class="mb-5"
        />

        <div class="">
          Режим работы по адресу
        </div>
        <div class="row my-4">
          <div class="col-4 col-lg-4 col-xl-3">
            Часовой пояс
          </div>
          <div class="col-6 col-lg-6 col-xl-6">
            <v-select :clearable="false" v-model="form.timezone" :reduce="item => item.value" :options="getTimezones" label="label"/>
          </div>
        </div>
        <div v-for="(value, index) in form.operationMode" class="row">
          <div class="col-lg-4 col-xl-3 d-flex align-items-center py-1">
            {{ operationMode.data[index].label }}
          </div>
          <div class="col-lg-6 col-xl-7 py-1">
            <v-select
              :clearable="false"
              v-model="value.start"
              :options="operationMode.interval"
              class="v-select--time mr-2"
            />
            <v-select
              :clearable="false"
              v-model="value.end"
              :options="operationMode.interval"
              class="v-select--time mr-5"
            />
            <div class="d-inline-block">
              <checkbox v-model="value.active" />
            </div>
          </div>
        </div>
      </div>
    </modal>
  </div>
</template>

<script>
import { getQueryData, watchList } from '~/utils'
import Form from 'vform'
import MaterialInput from '~/components/Edit/Inputs/MaterialInput'
import axios from 'axios'
import { mapActions, mapGetters } from 'vuex'
import SearchInput from '~/components/SearchInput'
import Paginate from 'vuejs-paginate/src/components/Paginate.vue'
import vSelect from 'vue-select'

let listWatchInstancePage = watchList(axios, 'management/organizations', 'page')
let listWatchInstanceSearch = watchList(axios, 'management/organizations', 'search')
let listWatchInstanceDelete = watchList(axios, 'management/organizations', 'delete')

export default {
  components: {
    SearchInput,
    MaterialInput,
    vSelect,
    Paginate
  },
  middleware: ['auth'],
  head () {
    return {
      title: 'Мои точки',
      bodyAttrs: {
        class: 'theme-edit'
      }
    }
  },
  asyncData: async ({ params, error, app, query }) => {
    let list = {}
    let params_ = getQueryData({ query })

    await app.store.dispatch('variables/fetchTimezones')

    let operationMode = app.store.getters['variables/getDefaultOperationModeSelected']
    let timezone = app.store.getters['variables/getDefaultTimezone']
    let organizationId = params.organizationId

    if (organizationId) {
      try {
        let { data } = await axios.get('management/organizations/' + organizationId + '/points', {
          params: params_
        })
        console.log(data)
        list = data
      } catch (e) {
        error({ statusCode: 404, message: 'Organization not found' })
      }
    }

    return {
      list,
      params: params_,
      organizationId: organizationId,
      operationMode: { ...app.store.getters['variables/getOperationMode'] },
      form: {
        operationMode,
        timezone
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
      }
    ]
  }),
  watch: {
    'params.search': listWatchInstanceSearch,
    'params.page': listWatchInstancePage
  },
  async beforeMount () {
    if (!(this.form instanceof Form)) {
      this.form = new Form(this.form)
    }
    this.fetchTimezones()
  },
  computed: {
    ...mapGetters({
      getTimezones: 'variables/getTimezones'
    }),
    items () {
      return (this.list && this.list.data) ? this.list.data : []
    },
    pageCount () {
      return (this.list && this.list.total) ? Math.ceil(this.list.total / this.params.perPage) : 0
    }
  },
  methods: {
    ...mapActions({
      fetchTimezones: 'variables/fetchTimezones'
    }),
    async deleteHandle (id) {
      let res = await this.$confirmDelete()
      if (res.value) {
        try {
          let { data } = await axios.delete('management/organizations/' + this.organizationId + '/points/' + id)
          listWatchInstanceDelete.call(this)
        } catch (e) {
          listWatchInstanceDelete.call(this)
        }
      }
    },
    addPoint () {
      this.$modal.push('add-point')
    },

    close () {
      this.$modal.pop()
    }
  }

}
</script>

<style>
</style>
