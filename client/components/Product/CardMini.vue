<template>
  <div class="d-flex">
    <div
      v-if="disabled"
      class="product-card-mini"
      @click="$emit('click')"
    >
      <card-mini-index
        :item="item"
      />
    </div>
    <router-link
      v-else
      :to="{ name: 'products.show', params: { productId: item.id } }"
      class="product-card-mini"
      @click.native="$sTB()">
      <card-mini-index
        :item="item"
      />
    </router-link>
  </div>
</template>

<script>

export default {
  components: {
    'CardMiniIndex': () => import('~/components/Product/CardMiniIndex')
  },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      required: true
    }
  }
}
</script>

<style>

</style>
