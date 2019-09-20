<template>
  <div
    v-click-outside="hideAddresses"
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
                 @click="$emit('select',address)"
            >
              Выбрать
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { fetchAddresses } from '~/utils'
import axios from 'axios'

let fetchAddressesInstance = fetchAddresses(axios)

export default {
  components: {
    'MaterialInput': () => import('~/components/Edit/Inputs/MaterialInput'),
  },
  props: {
    initValue: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    address: '',
    showAddresses: false,
    addresses: [],
    updateId: null
  }),
  beforeMount () {
    this.onInputAddress(this.initValue)
  },
  methods: {
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
  }
}
</script>

<style>

</style>
