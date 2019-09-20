<template>
  <div class="list-box">
    <div class="list-box__wrapper">

      <div v-for="(address, key) in addresses" :key="address.id" class="row mb-2 no-gutters pt-2">
        <div v-if="!selectedAddresses" class="col-auto text-primary pl-1">
          <fa icon="map-marker-alt" />
        </div>
        <div v-if="!selectedAddresses" class="col pl-2">
          <div>
            <a href="javascript:void(0)" class="text-primary" @click="$emit('pointClick', address)" v-html="address.street+((address.name)?'('+address.name+')':'')"/>
          </div>
          {{ address.operationModeText }}
          <span v-if="address.phone && defaultPhone !== address.phone">, <a :href="'tel:'+getLinkTel(address.phone)" class="text-black-50">{{ address.phone }}</a></span>
          <span v-if="address.email && defaultEmail !== address.email">, <a :href="'mailto:'+address.email" class="text-black-50">{{ address.email }}</a></span>
        </div>
        <div v-if="selectedAddresses" class="col-12 pl-2 pr-2">
          <checkbox
            :value="selectedAddresses.indexOf(address.id) !== -1"
            @input="$emit('change', {
              id: address.id,
              value: $event,
            })"
          >
            <div class="text-primary" v-html="address.street+((address.name)?'('+address.name+')':'')"/>
          </checkbox>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { getLinkTel } from '~/utils'

export default {
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
    }
  }
}
</script>

<style>

</style>
