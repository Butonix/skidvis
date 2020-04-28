<template>
  <div v-if="currency_id"
       :class="{
         'card-img-top__label--present':currency_id === 3 && isCard,
         'product-card-mini__label--present':currency_id === 3 && isCardMini,
         'product__slider__label--present':currency_id === 3 && isProductPage,
         'card-img-top__label': isCard,
         'product-card-mini__label': isCardMini,
         'product__slider__label': isProductPage,
  }">
    <template v-if="currency_id === 3">
      <present-card
        v-if="isCard || isCardMini"/>
      <present-page
        v-else-if="isProductPage"/>
    </template>
    <template v-else-if="value">
      <template v-if="currency_id === 1">
        {{ value }}%
      </template>
      <template v-else-if="currency_id === 2">
        {{ value }}₽
      </template>
      <template v-else-if="currency_id === 4">
        {{ value }}<bonus class="ml-1"/>
      </template>
      <template v-else-if="currency_id === 5">
        {{ value }}<cashback class="ml-1"/>
      </template>
      <template v-else-if="currency_id === 6">
        {{ value }}<bonus-percent class="ml-1"/>
      </template>
      <template v-else>
        {{ value }}₽
      </template>
    </template>
  </div>
</template>

<script>

export default {
  name: 'Value',
  components: {
    'PresentPage': () => import('~/components/Icons/PresentPage'),
    'PresentCard': () => import('~/components/Icons/PresentCard'),
    'Bonus': () => import('~/components/Icons/Bonus'),
    'BonusPercent': () => import('~/components/Icons/BonusPercent'),
    'Cashback': () => import('~/components/Icons/Cashback')
  },
  props: {
    type: {
      type: String,
      default: 'card'
    },
    currency_id: {
      type: Number,
      default: 2
    },
    value: {
      type: Number,
      default: undefined
    }
  },
  computed: {
    isCard () {
      return this.type === 'card'
    },
    isCardMini () {
      return this.type === 'card-mini'
    },
    isProductPage () {
      return this.type === 'product-page'
    }
  }
}
</script>

<style scoped>

</style>
