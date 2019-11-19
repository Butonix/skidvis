<template>
  <div class="points-index">
    <breadcrumbs />
    <div class="container mb-5">
      <h5 v-if="data.organization.name" class="mb-2">
        {{ data.organization.name }}
      </h5>
      <div class="row">
        <div class="col">
          <search-input
            v-model="pts.urlQuery.search"
            autofocus="autofocus"
          />
        </div>
        <div class="col-auto">
          <dropdown :options="perPageArray"
                    v-model="perPage"
                    class="mb-3"
                    btn-class="btn btn-sm btn-gray"
                    h-align="right"
                    placeholder="Количество"
          />
        </div>
      </div>
    </div>
    <div class="container">
      <div class="row mb-4">
        <div class="col-12 col-lg mb-2">
          <h5>
            Все адреса организации&nbsp;({{ ptsTotal }}):
          </h5>
        </div>
        <div class="col-12 col-lg-auto">
          <div class="d-flex flex-column flex-sm-row justify-content-end">
            <div v-if="isAdministrator" class="btn btn-outline-primary btn-sm mb-2" @click="onImportSimple">
              + Импортировать
            </div>
            <div v-if="isAdministrator" class="btn btn-outline-primary btn-sm mb-2 ml-sm-2" @click="onAdd">
              + Добавить адрес
            </div>
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
                <span v-if="item.metro_line_color" :style="'color: #'+item.metro_line_color"><metro /></span> {{
                item.full_street }} {{ (item.name)?`(${item.name})`:'' }}
                <span v-if="isAdministrator" class="sli sli--edit" @click="onEdit(index)"><fa
                  icon="pencil-alt" /></span>
                <span v-if="isAdministrator" class="sli sli--delete" @click="onDelete(index)"><fa
                  :icon="['far', 'trash-alt']" /></span>
              </div>
              {{ item.operationModeText.replaceAll('00:00-00:00', 'круглосуточно') }}
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
              <template v-if="item.phone && item.extension">
                (доб.{{ item.extension }})
              </template>
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

      <div v-if="organizationId" class="container pt-5">
        <div class="d-flex align-items-center justify-content-center h-100">
          <router-link
            :to="{ name: 'management.organizations.edit', params: { organizationId } }"
            class="btn btn-gray btn-sm px-4 mr-2"
            @click.native="$sTB()">
            <span class="px-2">Организация</span>
          </router-link>
          <router-link
            :to="{ name: 'management.organizations.products.index', params: { organizationId } }"
            class="btn btn-gray btn-sm px-4"
            @click.native="$sTB()">
            <span class="px-2">Акции</span>
          </router-link>
        </div>
        <div v-if="isSuperAdministrator" class="d-flex justify-content-around mt-3">
          <router-link
            :to="{ name: 'management.organizations.services', params: { organizationId } }"
            class="btn btn-gray btn-sm px-4 px-lg-3 px-xl-4"
            @click.native="$sTB()">
            <span class="px-2">Платные сервисы</span>
          </router-link>
        </div>
      </div>

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
                <has-error :form="form" field="full_street" />
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
                <has-error :form="form" field="full_street" />
              </div>
            </no-ssr>
          </div>
        </div>

        <addresses-select
          v-if="!form.full_street"
          :init-value="address"
          @select="onSelectAddress($event)" />

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
          form-class="mb-0"
        />

        <div class="row mb-5">
          <div class="col-12 col-md">
            <material-input
              v-model="form.phone"
              :form="form"
              type="tel"
              field="phone"
              type-input="inline"
              placeholder="Телефон"
              form-class="mb-0"
            />
          </div>
          <div class="col-12 col-md-auto">
            <material-input
              v-model="form.extension"
              :form="form"
              type="number"
              field="extension"
              type-input="inline"
              placeholder="Добавочный номер"
              form-class="mb-0"
            />
          </div>
        </div>

        <div class="d-flex flex-wrap mb-3">
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
                  @click="close"
          >
            Отменить
          </button>
        </div>
      </div>
    </modal>

    <modal name="import-point">
      <div class="basic-modal">
        <div :class="{'active': import_.simple.loading}"
             class="loading-list"
        />
        <h5 class="text-center">
          Простой импорт
        </h5>
        <material-textarea
          v-model="import_.simple.text"
          placeholder="Импорт"
          data-align="left"
          size="sm"
          rows="3"
        >
          <div class="text-muted small">
            <div>Перечислите адреса, каждый адрес на новой строчке. Например:</div>
            <div>г Санкт-Петербург, ул Благодатная, д 63 к 1</div>
            <div>г Санкт-Петербург, Загородный пр-кт, д 47</div>
          </div>
        </material-textarea>

        <div v-if="isImportSimpleErrors" class="py-4">
          <h5 v-if="getLengthCollectionImportSimple" class="text-center mb-4">
            Адресов с ошибками {{ getAddressesWithErrorsImportSimple.length }} из {{ getLengthCollectionImportSimple }}
          </h5>

          <button
            v-if="isImportSimpleErrorFoundTheRepetition"
            class="btn btn-sm btn-outline-danger mr-2"
            @click="addAllErrorsRepetitionToIgnoreImportSimple"
          >
            Разрешить все повторения
          </button>
          <button
            class="btn btn-sm btn-outline-danger mr-2"
            @click="removeAllFilledAddressesImportSimple"
          >
            Удалить все ошибки
          </button>
        </div>

        <transition
          v-if="isImportSimpleErrors"
          name="fade" mode="out-in">
          <div class="container py-3">
            <transition
              v-for="address in getAddressesWithErrorsImportSimple"
              :key="address.addressIndex"
              name="fade" mode="out-in"
            >
              <div
                v-if="import_.simple.editIndex !== address.addressIndex"
                class="row mb-4">
                <div class="col-auto text-primary pr-0">
                  <fa icon="map-marker-alt" />
                </div>
                <div class="col pl-2">
                  <div class="text-primary">
                    {{ address.full_street }}
                    <span class="sli sli--edit" @click="onEditImportSimple(address.addressIndex)"><fa
                      icon="pencil-alt" /></span>
                    <span class="sli sli--delete" @click="onRemoveImportSimple(address.addressIndex)"><fa
                      :icon="['far', 'trash-alt']" /></span>
                  </div>
                  <div v-for="(error, errorIndex) in getErrorsImportSimple(address.addressIndex)" :key="errorIndex">
                    <span class="text-danger">
                      &mdash;&nbsp;{{ importErrors[error] }}
                    </span>
                    <div v-if="error === 'FOUND_THE_REPETITION'" class="btn btn-sm btn-success mr-2 py-0 px-2"
                         @click="addErrorImportSimple(address.addressIndex, error, 'ignoreErrors')">
                      <fa icon="check" />
                      Разрешить повторение
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="row mb-4">
                <div class="col pl-2">
                  <addresses-select
                    :init-value="address.full_street"
                    @select="onSelectImportSimple(address.addressIndex, $event)" />
                </div>
                <div class="col-auto pr-0">
                  <span class="sli sli--edit h5" @click="onCloseEditImportSimple()"><fa icon="times" /></span>
                </div>
              </div>
            </transition>
          </div>
        </transition>

        <div class="text-center mt-5">
          <button
            class="btn btn-outline-primary mr-2"
            @click="saveSimpleImport"
          >
            Импортировать
          </button>
          <button class="btn btn-outline-danger ml-2"
                  @click="close"
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
import { difference, cloneDeep, compact } from 'lodash'

let fetchAddressesInstance = fetchAddresses(axios)

const globalNamespace = 'pts'

const List = BuildList({
  axios,
  globalNamespace,
  apiUrl: 'management/organizations',
  pathResponse: 'list.data',
  pathTotal: 'list.total',
  urlQuery: {
    perPage: 20
  }
})
const wacherList = List.getWatcher({ type: List.beforeTypes.SEARCH })
const wacherListDelete = List.getWatcher({ type: List.afterTypes.DELETE })

export default {
  components: {
    'Dropdown': () => import('~/components/Dropdown'),
    'Metro': () => import('~/components/Icons/Metro'),
    'AddressesSelect': () => import('~/components/Points/AddressesSelect'),
    'PaginateList': () => import('~/components/PaginateList'),
    'SearchInput': () => import('~/components/SearchInput'),
    'MaterialInput': () => import('~/components/Edit/Inputs/MaterialInput'),
    'MaterialTextarea': () => import('~/components/Edit/Inputs/MaterialTextarea'),
    'vSelect': () => import('vue-select')
  },
  middleware: ['auth'],
  mixins: [List.mixin],
  head () {
    return {
      title: 'Мои адреса',
      bodyAttrs: {
        class: 'theme-business theme-management'
      },
      ...getFavicon('business')
    }
  },
  asyncData: async ({ params, error, app, query }) => {
    let organizationId = params.organizationId

    let perPage = {
      id: 1,
      perPage: 20,
      name: 20
    }

    let perPageArray = [
      {
        id: 1,
        perPage: 20,
        name: 20
      },
      {
        id: 2,
        perPage: 50,
        name: 50
      },
      {
        id: 3,
        perPage: 100,
        name: 100
      },
      {
        id: 4,
        perPage: 150,
        name: 150
      },
      {
        id: 5,
        perPage: 200,
        name: 200
      },
      {
        id: 6,
        perPage: 500,
        name: 500
      }
    ]

    if (query.perPage) {
      query.perPage = Number(query.perPage)
      if (query.perPage !== perPage.perPage) {
        let def = true
        for (let i in perPageArray) {
          let pP = perPageArray[i]
          if (pP.perPage === query.perPage) {
            perPage = { ...pP }
            def = false
            break
          }
        }
        if (def) {
          query.perPage = perPage.perPage
        }
      }
    }

    let data = await List.getStartData({
      error,
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

    let fields = {
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
      phone: '',
      extension: ''
    }

    let res = {
      fields,
      ...data,
      data: dataOrg,
      organizationId: organizationId,
      operationMode: { ...app.store.getters['variables/getOperationMode'] },
      form: {
        ...fields
      },
      perPageArray,
      perPage
    }

    return res
  },
  data: () => ({
    import_: {
      defaultSimple: {
        loading: false,
        cache: {
          text: ''
        },
        text: '',
        editIndex: null,
        collection: [],
        ignoreErrors: []
      },
      simple: {
        loading: false,
        cache: {
          text: ''
        },
        text: '',
        editIndex: null,
        collection: [],
        ignoreErrors: []
      }
    },
    importErrors: {
      FOUND_THE_REPETITION: 'Найдено повторение в списке адресов',
      MORE_THAN_ONE_RESULT: 'Найдено больше одного результата',
      NO_RESULTS: 'Адрес не найден'
    },
    address: '',
    updateId: null
  }),
  computed: {
    ...mapGetters({
      getReactData: 'variables/getReactData',
      isSuperAdministrator: 'auth/isSuperAdministrator',
      isAdministrator: 'auth/isAdministrator',
      isManagement: 'auth/isManagement'
    }),
    getLengthCollectionImportSimple () {
      return this.import_.simple.collection.length
    },
    getAddressesWithErrorsImportSimple () {
      return this.import_.simple.collection.filter((value, index) => {
        let res = false
        value.addressIndex = index
        if (!this.isAccessImportSimple(index)) {
          res = true
        }
        return res
      })
    },
    isImportSimpleErrors () {
      return !!this.getAddressesWithErrorsImportSimple.length
    },
    isImportSimpleErrorFoundTheRepetition () {
      let t = 'FOUND_THE_REPETITION'
      if (this.import_.simple.ignoreErrors.indexOf(t) !== -1) {
        return false
      }
      let count = 0
      for (let i in this.getAddressesWithErrorsImportSimple) {
        let item = this.getAddressesWithErrorsImportSimple[i]
        if (item.errors.indexOf(t) !== -1 && (!item.ignoreErrors || (item.ignoreErrors && item.ignoreErrors.indexOf(t) === -1))) {
          count++
        }
        if (count > 1) {
          return true
        }
      }
      return false
    }
  },
  watch: {
    perPage () {
      this.pts.urlQuery.page = 1
      this.pts.urlQuery.perPage = this.perPage.perPage
      this.reloadList()
      console.log(this.perPage)
    }
  },
  async beforeMount () {
    if (!(this.form instanceof Form)) {
      this.form = new Form(this.form)
    }
  },
  methods: {
    async onEditAddress () {
      this.address = this.form.full_street
      this.form.full_street = ''
    },

    async getSelectAddress (v, type = 'default') {
      let res
      let data = await fetchAddressesInstance({ query: v.unrestricted_value, count: 1 })
      switch (type) {
        case 'simpleImport':
          if (data.length === 0) {
            return { error: 'NO_RESULTS' }
          }
          if (data.length > 1) {
            return { error: 'MORE_THAN_ONE_RESULT' }
          }
          break
        default:
          break
      }
      if (data[0]) {
        res = {}
        let address = data[0]
        res.full_street = address.value
        let street = address.value
        if (address.data.region_with_type) {
          street = street.replace(address.data.region_with_type + ', ', '')
        }
        if (address.data.city_with_type) {
          street = street.replace(address.data.city_with_type + ', ', '')
        }
        res.street = street
        res.city_kladr_id = address.data.city_kladr_id
        res.latitude = address.data.geo_lat
        res.longitude = address.data.geo_lon
        res.payload = { ...address }
      }
      return res
    },
    async onSelectAddress (v, th = this.form) {
      let data = await this.getSelectAddress(v)
      if (data && !data.error) {
        for (let i in data) {
          th[i] = data[i]
        }
      }
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
      for (let name in this.fields) {
        this.form[name] = this.ptsItems[key][name]
      }

      this.updateId = this.ptsItems[key].id
      this.$modal.push('save-point')
    },
    getDefaultFormData () {
      let name = ''

      try {
        name = this.getReactData['organizationId'][this.$route.params['organizationId']].name
      } catch (e) {
      }

      this.address = ''
      this.showAddresses = false
      this.addresses = []

      return { ...this.fields, name }
    },
    setDefaultFormData (toThis = this, toName = 'form', compact = null) {
      let data = this.getDefaultFormData()
      if (!compact) {
        data = new Form(data)
      } else {
        data = compact(data)
      }
      this.$set(toThis, toName, data)
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
        // this.reloadList()
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
      try {
        let { data } = await axios.get(`management/organizations/${this.organizationId}/points/${this.updateId}`)
        let point = data.point
        for (let i in this.pts.collection) {
          if (this.pts.collection[i].id === this.updateId) {
            this.$set(this.pts.collection, i, point)
            break
          }
        }
      } catch (e) {
        await this.$callToast({
          type: 'error',
          text: 'Обновить данные точки на странице не удалось'
        })
      }
    },
    setDefaultImportSimple () {
      this.$set(this.import_, 'simple', cloneDeep(this.import_.defaultSimple))
    },
    resetImportSimple () {
      this.$set(this.import_.simple, 'collection', [])
      this.$set(this.import_.simple, 'ignoreErrors', [])
      this.onCloseEditImportSimple()
    },
    onImportSimple () {
      this.setDefaultImportSimple()
      this.$modal.push('import-point')
    },
    addErrorImportSimple (index, type, name = 'errors') {
      if (!this.import_.simple.collection[index][name]) {
        this.$set(this.import_.simple.collection[index], name, [type])
      } else if (this.import_.simple.collection[index][name].indexOf(type) === -1) {
        this.import_.simple.collection[index][name].push(type)
      }
    },
    async addAllErrorsRepetitionToIgnoreImportSimple () {
      let t = 'FOUND_THE_REPETITION'
      if (this.import_.simple.ignoreErrors.indexOf(t) === -1) {
        this.import_.simple.ignoreErrors.push(t)
      }
      await this.saveSimpleImport()
    },
    getErrorsImportSimple (index) {
      let item = this.import_.simple.collection[index]
      let errors = item.errors || []
      if (errors.length) {
        if (item.ignoreErrors && item.ignoreErrors.length) {
          errors = difference(errors, item.ignoreErrors)
        }
        if (this.import_.simple.ignoreErrors.length) {
          errors = difference(errors, this.import_.simple.ignoreErrors)
        }
      }
      return errors
    },
    isAccessImportSimple (index) {
      let errors = this.getErrorsImportSimple(index)
      return errors.length === 0
    },
    async removeAllFilledAddressesImportSimple () {
      // Удаление по индексам нужно начинать с конца
      let keys = Object.keys(this.import_.simple.collection).reverse()
      for (let i in keys) {
        let index = keys[i]
        if (!this.isAccessImportSimple(index)) {
          this.onRemoveImportSimple(index)
        }
      }
      if (this.getLengthCollectionImportSimple) {
        await this.saveSimpleImport()
      }
    },
    onRemoveImportSimple (index) {
      this.$delete(this.import_.simple.collection, index)
    },
    onEditImportSimple (index) {
      this.$set(this.import_.simple, 'editIndex', index)
    },
    onCloseEditImportSimple () {
      this.$set(this.import_.simple, 'editIndex', null)
    },
    async onSelectImportSimple (index, value) {
      await this.onSelectAddress(value, this.import_.simple.collection[index])
      if (this.import_.simple.collection[index].errors) {
        this.$delete(this.import_.simple.collection[index], 'errors')
      }
      this.onCloseEditImportSimple()
      await this.saveSimpleImport()
    },
    async saveSimpleImport () {
      this.import_.simple.loading = true

      if (this.import_.simple.text && this.import_.simple.text.trim()) {
        if (this.import_.simple.cache.text !== this.import_.simple.text || this.import_.simple.collection.length === 0) {
          this.resetImportSimple()
          this.import_.simple.cache.text = this.import_.simple.text
          let fullStreets = this.import_.simple.text.split('\n')
          fullStreets = compact(fullStreets)
          for (let i in fullStreets) {
            let data = this.getDefaultFormData()
            let fullStreet = fullStreets[i].trim()
            let address = await this.getSelectAddress({ unrestricted_value: fullStreet }, 'simpleImport')
            if (address.error) {
              data.full_street = fullStreet
            } else {
              data = { ...data, ...address }
            }
            this.import_.simple.collection.push(data)
            let index = this.import_.simple.collection.length - 1

            if (address.error) {
              this.addErrorImportSimple(index, address.error)
            }
          }
        }

        if (this.import_.simple.collection.length) {
          try {
            let addresses = this.import_.simple.collection.map(v => v.full_street)
            addresses = compact(addresses)
            if (addresses.length) {
              let { data } = await axios.post(`management/organizations/${this.organizationId}/points/check`, {
                addresses
              })
              if (data.duplicates.length) {
                for (let i in data.duplicates) {
                  let index = data.duplicates[i]
                  this.addErrorImportSimple(index, 'FOUND_THE_REPETITION')
                }
              }
            }
          } catch (e) {
            console.log(e)
            await this.$callToast({
              type: 'error',
              text: 'Ошибка при импортировании'
            })
          }
        }

        if (!this.isImportSimpleErrors) {
          try {
            await axios.post(`management/organizations/${this.organizationId}/points/import/simple`, {
              addresses: this.import_.simple.collection
            })
            this.setDefaultImportSimple()
            this.reloadList()
            await this.$callToast({
              type: 'success',
              text: 'Адреса импортированы'
            })
          } catch (e) {
            console.log(e)
            await this.$callToast({
              type: 'error',
              text: 'Ошибка при импортировании'
            })
          }
        }
      }

      this.import_.simple.loading = false
    },

    close () {
      this.$modal.pop()
    }
  }

}
</script>

<style>
</style>
