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
          <div class="btn btn-outline-primary btn-sm" @click="addPoint">
            + Добавить адрес
          </div>
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
    <modal name="example">
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
            <v-select :clearable="false" v-model="selected" :options="[{label: '13:23, Москва, Санкт-Петербу 13:23, Москва, Санкт-Петербу 13:23, Москва, Санкт-Петербу 13:23, Москва, Санкт-Петербу', value: '1'}, {label: '13:23, Москва, Санкт-Петерб123у', value: '2'}, {label: '13:23, Москва, Санкт-Петербу', value: '3'}]"/>
          </div>
        </div>
        <div
          v-for="(value, index) in form.operationMode"
          class="row"
        >
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
import Form from 'vform'
import MaterialInput from '~/components/Edit/Inputs/MaterialInput'
import mixinSwal from '~/mixins/sweetalert2'
import axios from 'axios'
import { mapActions, mapGetters } from 'vuex'
import SearchInput from '~/components/SearchInput'
import Paginate from 'vuejs-paginate/src/components/Paginate.vue'
import vSelect from 'vue-select'

export default {
  components: {
    SearchInput,
    MaterialInput,
    vSelect,
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
    selected: { label: '13:23, Москва, Санкт-Петербу 13:23, Москва, Санкт-Петербу 13:23, Москва, Санкт-Петербу 13:23, Москва, Санкт-Петербу', value: '1' },
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
    ],
    operationMode: {
      interval: [],
      default: {
        start: '07:00',
        end: '20:00',
        active: true
      },
      data: {
        mon: {
          label: 'Понедельник'
        },
        tue: {
          label: 'Вторник'
        },
        web: {
          label: 'Среда'
        },
        thu: {
          label: 'Четверг'
        },
        fri: {
          label: 'Пятница'
        },
        sat: {
          label: 'Суббота'
        },
        sun: {
          label: 'Воскресенье'
        }
      }
    },
    form: new Form({
      operationMode: {
        mon: null,
        tue: null,
        web: null,
        thu: null,
        fri: null,
        sat: null,
        sun: null
      },
      name: '',
      email: '',
      phone: ''
    })
  }),

  created () {
    for (let i = 0; i < 24; i++) {
      let t = (i < 10) ? '0' + i : i
      this.operationMode.interval.push(t + ':00')
      this.operationMode.interval.push(t + ':10')
      this.operationMode.interval.push(t + ':20')
      this.operationMode.interval.push(t + ':30')
      this.operationMode.interval.push(t + ':40')
      this.operationMode.interval.push(t + ':50')
    }
    for (let i in this.form.operationMode) {
      if (!this.form.operationMode[i]) {
        this.form.operationMode[i] = { ...this.operationMode.default }
      }
    }
  },
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
    },
    addPoint () {
      this.$modal.push('example')
    },

    close () {
      this.$modal.pop()
    }
  }

}
</script>

<style>
</style>
