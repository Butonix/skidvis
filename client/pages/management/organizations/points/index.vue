<template>
  <div class="points-index">
    <breadcrumbs/>
    <div class="container mb-5">
      <h5 class="mb-2">
        Мои организации
      </h5>
      <search-input
        v-model="pts.urlQuery.search"
        autofocus="autofocus"
      />
    </div>
    <div class="container">
      <div class="row mb-4">
        <div class="col-12 col-md mb-2">
          <h5>
            Все адреса организации ({{ ptsTotal }}):
          </h5>
        </div>
        <div class="col-12 col-md-auto mb-2">
          <div v-if="isAdministrator" class="btn btn-outline-primary btn-sm" @click="onAdd">
            + Добавить адрес
          </div>
        </div>
      </div>
    </div>

    <transition
      v-if="ptsItems[0]"
      name="fade" mode="out-in">
      <div class="container position-relative" style="min-height: 400px">
        <div :class="{'active': ptsIsLoading}"
             class="loading-list"
        />
        <transition
          v-for="(item, index) in ptsItems"
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
                <span v-if="isAdministrator" class="sli sli--edit" @click="onEdit(index)"><fa icon="pencil-alt" /></span>
                <span v-if="isAdministrator" class="sli sli--delete" @click="onDelete(index)"><fa :icon="['far', 'trash-alt']"/></span>
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

      <paginate-list
        :params="ptsParams"
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
          :form="form"
          type="tel"
          field="phone"
          type-input="inline"
          placeholder="Телефон"
          form-class="mb-5"
        />

        <div class="d-flex mb-3">
          <div class="mr-3">
            Режим работы по адресу:
          </div>
          <div class="btn-group">
            <div :class="{'active':!form.own_schedule}"
                 class="btn btn-outline-primary btn-sm"
                 @click="form.own_schedule = false"
            >
              Организации
            </div>
            <div :class="{'active':form.own_schedule}"
                 class="btn btn-outline-primary btn-sm"
                 @click="form.own_schedule = true"
            >
              Свой
            </div>
          </div>
        </div>
        <div v-if="form.own_schedule" class="mb-5" title="Собственный режим работы">
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
        <div v-else class="mb-5 half-hidden" title="Режим работы организации">
          <div v-for="(value, index) in data.organization.operationMode" :key="index" class="row">
            <div class="col-lg-4 col-xl-3 d-flex align-items-center py-1">
              {{ operationMode.data[index].label }}
            </div>
            <div class="col-lg-6 col-xl-7 py-1">
              <v-select
                :clearable="false"
                :value="value.start"
                :options="operationMode.interval"
                class="v-select--time mr-2"
              />
              <v-select
                :clearable="false"
                :value="value.end"
                :options="operationMode.interval"
                class="v-select--time mr-5"
              />
              <div class="d-inline-block">
                <checkbox :value="value.active" />
              </div>
            </div>
          </div>
        </div>

        <div v-if="isAdministrator" class="text-center mt-5">
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
import BuildList from '~/mixins/list'
import { fetchAddresses, getFavicon } from '~/utils'
import Form from 'vform'
import axios from 'axios'
import { mapGetters } from 'vuex'

let fetchAddressesInstance = fetchAddresses(axios)

const globalNamespace = 'pts'

const List = BuildList({
  axios,
  globalNamespace,
  apiUrl: 'management/organizations',
  pathResponse: 'list.data',
  pathTotal: 'list.total',
  urlQuery: {
    perPage: 3
  }
})
const wacherList = List.getWatcher({ type: List.beforeTypes.SEARCH })
const wacherListDelete = List.getWatcher({ type: List.afterTypes.DELETE })

export default {
  components: {
    'PaginateList': () => import('~/components/PaginateList'),
    'SearchInput': () => import('~/components/SearchInput'),
    'MaterialInput': () => import('~/components/Edit/Inputs/MaterialInput'),
    'vSelect': () => import('vue-select')
  },
  middleware: ['auth'],
  mixins: [List.mixin],
  head () {
    return {
      title: 'Мои адреса',
      bodyAttrs: {
        class: 'theme-business'
      },
      ...getFavicon('business')
    }
  },
  asyncData: async ({ params, error, app, query }) => {
    let organizationId = params.organizationId
    let data = await List.getStartData({
      query,
      defaultData: {
        apiUrl: `management/organizations/${organizationId}/points`
      }
    })
    let dataOrg = {}

    let operationMode = app.store.getters['variables/getDefaultOperationModeSelected']

    if (organizationId) {
      try {
        let req = await axios.get('management/organizations/' + organizationId)
        dataOrg = req.data
        if (dataOrg.organization.operationMode) {
          operationMode = dataOrg.organization.operationMode
        } else if (dataOrg.organization) {
          dataOrg.organization['operationMode'] = operationMode
        }
      } catch (e) {
        error({ statusCode: e.response.status })
      }
    }

    return {
      ...data,
      data: dataOrg,
      organizationId: organizationId,
      operationMode: { ...app.store.getters['variables/getOperationMode'] },
      form: {
        operationMode,
        name: '',
        street: '',
        full_street: '',
        city_kladr_id: '',
        latitude: '',
        longitude: '',
        payload: null,
        own_schedule: false,
        email: '',
        phone: ''
      }
    }
  },
  data: () => ({
    address: '',
    showAddresses: false,
    addresses: [],
    updateId: null
  }),
  computed: mapGetters({
    getReactData: 'variables/getReactData',
    isAdministrator: 'auth/isAdministrator',
    isManagement: 'auth/isManagement'
  }),
  async beforeMount () {
    if (!(this.form instanceof Form)) {
      this.form = new Form(this.form)
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
          await axios.delete(`management/organizations/${this.organizationId}/points/${this.ptsItems[key].id}`)
          await this.$callToast({
            type: 'success',
            text: 'Адрес успешно удален'
          })
          wacherListDelete.call(this)
        } catch (e) {
          await this.$callToast({
            type: 'error',
            text: 'Удалить не удалось'
          })
        }
      }
    },
    onEdit (key) {
      this.form.own_schedule = this.ptsItems[key].own_schedule
      this.form.name = this.ptsItems[key].name
      this.form.street = this.ptsItems[key].street
      this.form.full_street = this.ptsItems[key].full_street
      this.form.email = this.ptsItems[key].email
      this.form.phone = this.ptsItems[key].phone
      this.form.operationMode = this.ptsItems[key].operationMode
      this.updateId = this.ptsItems[key].id

      this.form.city_kladr_id = this.ptsItems[key].city_kladr_id
      this.form.latitude = this.ptsItems[key].latitude
      this.form.longitude = this.ptsItems[key].longitude
      this.form.payload = this.ptsItems[key].payload

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

      this.form.own_schedule = false
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
    onAdd () {
      this.updateId = null
      this.setDefaultFormData()
      this.$modal.push('save-point')
    },
    reloadList () {
      wacherList.call(this)
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
    }
  }

}
</script>

<style>
</style>
