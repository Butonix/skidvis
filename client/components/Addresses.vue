<template>
  <div class="addresses">
    <h5 class="mb-4">
      {{ label }} (39):
    </h5>
    <div class="addresses__wrapper">
      <div class="addresses__search">
        <material-input
          placeholder="Поиск..."
          @input="onSearch"
        />
      </div>
      <ul class="addresses__list list-unstyled">
        <li v-for="(address, key) in addresses" :key="key">
          <fa icon="map-marker-alt" />
          {{ address.address }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import MaterialInput from '~/components/Edit/Inputs/MaterialInput'

export default {
  components: {
    MaterialInput
  },
  props: {
    label: {
      type: String,
      default: 'Все адреса'
    },
    addresses: {
      type: Array,
      default: () => ([])
    }
  },
  methods: {
    onSearch (event) {
      console.log(event)
    }
  }
}
</script>

<style>

</style>
