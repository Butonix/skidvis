<template>
  <div class="points-index">
    <breadcrumbs/>
    <div class="container mb-5">
      <h5 class="mb-2">
        Мои организации
      </h5>
      <search-input
        v-if="params"
        v-model="params.search"
        autofocus="autofocus"
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
          <div class="btn btn-outline-primary btn-sm" @click="onAdd">
            + Добавить адрес
          </div>
        </div>
      </div>
    </div>

    <transition
      v-if="items.length"
      name="fade" mode="out-in">
      <div class="container position-relative" style="min-height: 400px">
        <div :class="{'active': loadingList}"
             class="loading-list"
        />
        <transition
          v-for="(item, index) in items"
          :key="index"
          name="fade" mode="out-in"
        >
          <div class="row mb-4">
            <div class="col-auto text-primary pr-0">
              <fa icon="map-marker-alt" />
            </div>
            <div class="col pl-2">
              <div class="text-primary">
                {{ item.full_street }} {{ (item.name)?`(${item.name})`:'' }}
                <span class="sli sli--edit" @click="onEdit(index)"><fa icon="pencil-alt" /></span>
                <span class="sli sli--delete" @click="onDelete(index)"><fa :icon="['far', 'trash-alt']"/></span>
              </div>
              {{ item.operationModeText }}
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
        </transition>
      </div>
    </transition>
    <transition
      v-else
      name="fade" mode="out-in">
      <div style="min-height: 300px" class="container d-flex align-items-center justify-content-center">
        <div class="mb-4">
          Адреса еще не добавлены
        </div>
      </div>
    </transition>

    <div class="container mt-5">

      <paginate
        v-if="params && pageCount && pageCount > 1"
        v-model="params.page"
        :page-count="pageCount"
        :page-range="3"
        :margin-pages="1"
        :hide-prev-next="true"
        :container-class="'pagination'"
        :page-class="'page-item'"
        prev-class="d-none"
        next-class="d-none"
        @click.native="onClickLink"
      />

    </div>
    <modal name="save-point">
      <div class="basic-modal">

        <div v-if="form.full_street" class="row mb-4">
          <div class="col-auto text-primary pr-0">
            <fa icon="map-marker-alt" />
          </div>
          <div class="col pl-2 text-primary">
            {{ form.full_street }}
            <span class="sli sli--edit"
                  @click="onEditAddress"
            ><fa icon="pencil-alt" /></span>
          </div>
          <div class="col-12">
            <no-ssr>
              <div v-if="form && form.errors" :class="{ 'is-invalid': form.errors.has('full_street') }">
                <has-error :form="form" field="full_street"/>
              </div>
            </no-ssr>
          </div>
        </div>

        <div v-else class="row mb-4">
          <div class="col-auto text-muted pr-0">
            <fa icon="map-marker-alt" />
          </div>
          <div class="col pl-2 text-muted">
            Адрес не добавлен, используйте поиск ниже для его добавления
          </div>
          <div class="col-12">
            <no-ssr>
              <div v-if="form && form.errors" :class="{ 'is-invalid': form.errors.has('full_street') }">
                <has-error :form="form" field="full_street"/>
              </div>
            </no-ssr>
          </div>
        </div>

        <div
          v-click-outside="hideAddresses"
          v-if="!form.full_street"
          :class="{'show': showAddresses}"
          class="points-index__addresses">

          <material-input
            :value="address"
            type-input="inline"
            placeholder="Поиск адреса"
            form-class="mb-4"
            @click="onInputAddress(address)"
            @input="onInputAddress"
          />

          <div class="points-index__addresses__collapse">
            <div
              class="points-index__addresses__list">
              <div v-for="(address, key) in addresses"
                   :key="key" class="row mb-2">
                <div class="col-auto text-primary pr-0 pt-1">
                  <fa icon="map-marker-alt" />
                </div>
                <div class="col pl-2 text-primary">
                  <div class="d-inline-block pt-1">
                    {{ address.value }}
                  </div>
                  <div class="btn btn-outline-primary float-right ml-2 btn-sm"
                       @click="onSelectAddress(address)"
                  >
                    Выбрать
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        <material-input
          v-model="form.name"
          :form="form"
          field="name"
          type-input="inline"
          placeholder="Название адреса"
          form-class="mb-4 mt-5"
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
          type="tel"
          :form="form"
          field="phone"
          type-input="inline"
          placeholder="Телефон"
          form-class="mb-5"
        />

        <div class="">
          Режим работы по адресу
        </div>
        <div class="mb-5">
          <div v-for="(value, index) in form.operationMode" :key="index" class="row">
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

        <div class="text-center mt-5">
          <button v-if="updateId" class="btn btn-outline-primary mr-2"
                  @click="savePoint"
          >
            Сохранить адрес
          </button>
          <button v-else class="btn btn-outline-primary mr-2"
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
import { getQueryData, watchList, fetchAddresses } from '~/utils'
import Form from 'vform'
import axios from 'axios'
import { mapActions, mapGetters } from 'vuex'

let fetchAddressesInstance = fetchAddresses(axios)
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
      title: 'Мои адреса',
      bodyAttrs: {
        class: 'theme-business'
      }
    }
  },
  asyncData: async ({ params, error, app, query }) => {
    let indexApiUrl
    let collection = {}
    let dataOrg = {}
    let params_ = getQueryData({ query })

    let operationMode = app.store.getters['variables/getDefaultOperationModeSelected']
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

        let { data } = await axios.get(indexApiUrl, {
          params: params_
        })
        collection = data
      } catch (e) {
        error({ statusCode: 404, message: 'Organization not found' })
      }
    }

    return {
      collection,
      data: dataOrg,
      params: params_,
      organizationId: organizationId,
      operationMode: { ...app.store.getters['variables/getOperationMode'] },
      indexApiUrl,
      form: {
        operationMode,
        name: '',
        street: '',
        full_street: '',
        city_kladr_id: '',
        latitude: '',
        longitude: '',
        payload: null,
        email: '',
        phone: ''
      }
    }
  },
  data: () => ({
    loadingList: false,
    address: '',
    showAddresses: false,
    addresses: [],
    updateId: null
  }),
  watch: {
    'params.search': listWatchInstanceSearch,
    'params.page': listWatchInstancePage
  },
  async beforeMount () {
    if (!(this.form instanceof Form)) {
      this.form = new Form(this.form)
    }
  },
  computed: {
    ...mapGetters({
      getReactData: 'variables/getReactData'
    }),
    items () {
      return (this.collection.list && this.collection.list.data) ? this.collection.list.data : []
    },
    pageCount () {
      return (this.collection.list && this.collection.list.total) ? Math.ceil(this.collection.list.total / this.params.perPage) : 0
    }
  },
  methods: {
    async onEditAddress () {
      let address = this.form.full_street
      this.form.full_street = ''
      this.onInputAddress(address)
    },
    async onSelectAddress (v) {
      let data = await fetchAddressesInstance({ query: v.unrestricted_value, count: 1 })
      if (data[0]) {
        let address = data[0]
        this.form.full_street = address.value
        let street = []
        if (address.data.area_with_type) {
          street.push(address.data.area_with_type)
        }
        if (address.data.settlement_with_type) {
          street.push(address.data.settlement_with_type)
        }
        if (address.data.street_with_type) {
          street.push(address.data.street_with_type)
        }
        if (address.data.house_type && address.data.house) {
          street.push(address.data.house_type + ' ' + address.data.house)
        }
        if (address.data.flat_type && address.data.flat) {
          street.push(address.data.flat_type + ' ' + address.data.flat)
        }
        this.form.street = street.join(', ')
        this.form.city_kladr_id = address.data.city_kladr_id
        this.form.latitude = address.data.geo_lat
        this.form.longitude = address.data.geo_lon
        this.form.payload = { ...address }
      }
    },
    async onInputAddress (v) {
      this.address = v
      if (v.length) {
        this.addresses = await fetchAddressesInstance({ query: v, count: 10 })
        if (this.addresses.length) {
          this.showAddresses = true
        } else {
          this.showAddresses = false
        }
      } else {
        this.showAddresses = false
        this.addresses = []
      }
    },
    hideAddresses () {
      this.showAddresses = false
    },
    async onDelete (key) {
      let res = await this.$confirmDelete()
      if (res.value) {
        try {
          await axios.delete(`management/organizations/${this.organizationId}/points/${this.items[key].id}`)
          await this.$callToast({
            type: 'success',
            text: 'Адрес успешно удален'
          })
          this.reloadList()
        } catch (e) {
          await this.$callToast({
            type: 'error',
            text: 'Удалить не удалось'
          })
        }
      }
    },
    onEdit (key) {
      this.form.name = this.items[key].name
      this.form.street = this.items[key].street
      this.form.full_street = this.items[key].full_street
      this.form.email = this.items[key].email
      this.form.phone = this.items[key].phone
      this.form.operationMode = this.items[key].operationMode
      this.updateId = this.items[key].id

      this.form.city_kladr_id = this.items[key].city_kladr_id
      this.form.latitude = this.items[key].latitude
      this.form.longitude = this.items[key].longitude
      this.form.payload = this.items[key].payload

      this.$modal.push('save-point')
    },
    setDefaultFormData () {
      let name = ''

      try {
        name = this.getReactData['organizationId'][this.$route.params['organizationId']].name
      } catch (e) {
      }

      this.address = ''
      this.showAddresses = false
      this.addresses = []

      this.form.name = name
      this.form.street = ''
      this.form.full_street = ''
      this.form.email = ''
      this.form.phone = ''
      this.form.operationMode = this.data.organization.operationMode

      this.form.city_kladr_id = ''
      this.form.latitude = ''
      this.form.longitude = ''
      this.form.payload = null
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
    onAdd () {
      this.updateId = null
      this.setDefaultFormData()
      this.$modal.push('save-point')
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
          text: 'Адрес успешно добавлен',
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
    async savePoint () {
      try {
        await this.form.patch(`management/organizations/${this.organizationId}/points/${this.updateId}`)
        this.reloadList()
        await this.$callToast({
          type: 'success',
          text: 'Адрес успешно изменен',
          duration: 3000
        })
      } catch (e) {
        await this.$callToast({
          type: 'error',
          text: 'Сохранить не удалось'
        })
      }
    },

    close () {
      this.$modal.pop()
    },
    onClickLink () {
      this.$scrollTo(document.documentElement.getElementsByTagName('body')[0])
    }
  }

}
</script>

<style>
</style>
