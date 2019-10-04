<template>
  <div class="list-box">
    <div class="list-box__wrapper">

      <div v-for="(address, key) in addresses" :key="address.id" class="row mb-0 no-gutters pt-2 flex-nowrap">
        <div v-if="!selectedAddresses" class="col-auto text-primary pl-1 pr-2">
          <fa icon="map-marker-alt" />
        </div>
        <div v-if="!selectedAddresses" class="col">
          <div>
            <a href="javascript:void(0)" class="text-primary" @click="onClick(address)">
              <metro :color="address.metro_line_color" :station="address.metro_station_name" :line="address.metro_line_name" :distance="address.metro_distance"/>
            <span v-html="address.street+((address.name)?'('+address.name+')':'')"/></a>
          </div>
          {{ address.operationModeText.replaceAll('00:00-00:00', 'круглосуточно') }}
          <span v-if="address.phone && defaultPhone !== address.phone">, <a :href="'tel:'+getLinkTel(address.phone)" class="text-black-50">{{ address.phone }}</a></span>
          <span v-if="address.email && defaultEmail !== address.email">, <a :href="'mailto:'+address.email" class="text-black-50">{{ address.email }}</a></span>
        </div>
        <div v-if="selectedAddresses" class="col-12 px-2">
          <checkbox
            :value="selectedAddresses.indexOf(address.id) !== -1"
            @input="$emit('change', {
              id: address.id,
              value: $event,
            })"
          >
            <div class="text-primary" v-html="address.full_street+((address.name)?'('+address.name+')':'')"/>
          </checkbox>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { getLinkTel } from '~/utils'

export default {
  components: {
    'Metro': () => import('~/components/MetroWithTooltip')
  },
  props: {
    selectedAddresses: {
      type: Array,
      default: undefined
    },
    addresses: {
      type: Array,
      default: undefined
    },
    defaultEmail: {
      type: String,
      default: ''
    },
    defaultPhone: {
      type: String,
      default: ''
    }
  },
  methods: {
    getLinkTel (str) {
      return getLinkTel(str)
    },
    onClick (address) {
      this.$emit('pointClick', address)
    }
  }
}
</script>

<style>

</style>
