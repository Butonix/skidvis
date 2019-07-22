<template>
  <div v-if="addresses" class="list-box">
    <div class="list-box__wrapper">

      <div v-for="(address, key) in addresses" :key="key" class="row mb-2 no-gutters">
        <div class="col-auto text-primary">
          <fa icon="map-marker-alt" />
        </div>
        <div class="col pl-2">
          <div class="text-primary" v-html="address.text"/>
        </div>
      </div>

    </div>
  </div>
</template>

<script>

export default {
  props: {
    addresses: {
      type: Array,
      default: undefined
    }
  }
}
</script>

<style>

</style>
