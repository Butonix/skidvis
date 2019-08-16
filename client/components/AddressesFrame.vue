<template>
  <div class="list-box">
    <div class="list-box__wrapper">

      <div v-for="(address, key) in addresses" :key="address.id" class="row mb-2 no-gutters pt-2">
        <div v-if="!selectedAddresses" class="col-auto text-primary pl-1">
          <fa icon="map-marker-alt" />
        </div>
        <div v-if="!selectedAddresses" class="col pl-2">
          <div class="text-primary" v-html="address.full_street+((address.name)?'('+address.name+')':'')"/>
          {{ address.operationModeText }}
        </div>
        <div v-if="selectedAddresses" class="col-12 pl-2 pr-2">
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

export default {
  props: {
    selectedAddresses: {
      type: Array,
      default: undefined
    },
    addresses: {
      type: Array,
      default: undefined
    }
  }
}
</script>

<style>

</style>
