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
            Все адреса организации ({{ items.length }}):
          </h5>
        </div>
        <div class="col-12 col-md-auto mb-2">
          <div class="btn btn-outline-primary btn-sm" @click="showModalAddPoint">
            + Добавить адрес
          </div>
        </div>
      </div>
    </div>
    <div v-if="items.length" class="container" style="min-height: 400px">
      <div v-for="(item, key) in items" :key="key" class="row mb-4">
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
    <div v-else style="min-height: 300px" class="container d-flex align-items-center justify-content-center">
      <div class="mb-4">
        Адреса еще не добавлены
      </div>
    </div>
    <div class="container mt-5">

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
    <modal name="add-point" @closed="closedModalAddPoint">
      <div class="basic-modal">

        <material-input
          v-model="form.full_street"
          :form="form"
          field="full_street"
          type-input="inline"
          placeholder="Адрес точки"
          form-class="mb-4"
        />

        <material-input
          v-model="form.name"
          :form="form"
          field="name"
          type-input="inline"
          placeholder="Название точки"
          form-class="mb-4"
        />

        <material-input
          v-model="form.email"
          :form="form"
          field="email"
          type-input="inline"
          placeholder="Эл. почта"
          form-class="mb-4"
        />

        <material-input
          v-model="form.phone"
          :form="form"
          field="phone"
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
        <div class="text-center mt-5">
          <button class="btn btn-outline-primary mr-2"
                  @click="addPoint"
          >
            Добавить адрес
          </button>
          <button class="btn btn-outline-danger ml-2"
                  @click="$modal.pop()"
          >
            Отменить
          </button>
        </div>
      </div>
    </modal>
  </div>
</template>

<script>
import { getQueryData, watchList } from '~/utils'
import Form from 'vform'
import axios from 'axios'
import { mapActions, mapGetters } from 'vuex'

let listWatchInstancePage = watchList(axios, 'indexApiUrl', 'page')
let listWatchInstanceSearch = watchList(axios, 'indexApiUrl', 'search')
let listWatchInstanceDelete = watchList(axios, 'indexApiUrl', 'delete')

export default {
  components: {
    'SearchInput': () => import('~/components/SearchInput'),
    'MaterialInput': () => import('~/components/Edit/Inputs/MaterialInput'),
    'vSelect': () => import('vue-select'),
    'Paginate': () => import('vuejs-paginate/src/components/Paginate.vue')
  },
  middleware: ['auth'],
  head () {
    return {
      title: 'Мои точки',
      bodyAttrs: {
        class: 'theme-business'
      }
    }
  },
  asyncData: async ({ params, error, app, query }) => {
    let indexApiUrl
    let list = {}
    let dataOrg = {}
    let params_ = getQueryData({ query })

    await app.store.dispatch('variables/fetchTimezones')

    let operationMode = app.store.getters['variables/getDefaultOperationModeSelected']
    let timezone = app.store.getters['variables/getDefaultTimezone']
    let organizationId = params.organizationId

    if (organizationId) {
      indexApiUrl = 'management/organizations/' + organizationId + '/points'
      try {
        let req = await axios.get('management/organizations/' + organizationId)
        dataOrg = req.data

        if (dataOrg.organization.operationMode) {
          operationMode = dataOrg.organization.operationMode
        } else if (dataOrg.organization) {
          dataOrg.organization['operationMode'] = operationMode
        }
        if (dataOrg.organization.timezone) {
          timezone = dataOrg.organization.timezone
        } else if (dataOrg.organization) {
          dataOrg.organization['timezone'] = timezone
        }

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
      data: dataOrg,
      params: params_,
      organizationId: organizationId,
      operationMode: { ...app.store.getters['variables/getOperationMode'] },
      indexApiUrl,
      form: {
        operationMode,
        timezone,
        name: '',
        full_street: '',
        email: '',
        phone: ''
      }
    }
  },
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
    setDefaultFormData () {
      this.form.name = ''
      this.form.full_street = ''
      this.form.email = ''
      this.form.phone = ''
      this.form.timezone = this.data.organization.timezone
      this.form.operationMode = this.data.organization.operationMode
    },
    async deleteHandle (id) {
      let res = await this.$confirmDelete()
      if (res.value) {
        try {
          await axios.delete('management/organizations/' + this.organizationId + '/points/' + id)
          listWatchInstanceDelete.call(this)
        } catch (e) {
          listWatchInstanceDelete.call(this)
        }
      }
    },
    closedModalAddPoint () {
      this.setDefaultFormData()
    },
    showModalAddPoint () {
      this.$modal.push('add-point')
    },
    reloadList () {
      listWatchInstanceDelete.call(this)
    },
    async addPoint () {
      try {
        await this.form.post(`management/organizations/${this.organizationId}/points`)
        this.reloadList()
        await this.$callToast({
          type: 'success',
          text: 'Данные успешно сохранены',
          duration: 3000
        })
        this.setDefaultFormData()
      } catch (e) {
        await this.$callToast({
          type: 'error',
          text: 'Сохранить не удалось'
        })
      }
    },

    close () {
      this.$modal.pop()
    }
  }

}
</script>

<style>
</style>
