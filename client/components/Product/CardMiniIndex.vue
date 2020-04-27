<template>
  <div class="product-card-mini__wrapper">
    <div class="product-card-mini__img">
      <div
        v-lazy:background-image="{
          src: item.images[0].src,
          loading: '/placeholders/cover.jpg'
        }"
        v-if="item.images && item.images[0] && item.images[0].src"
        data-loading="/placeholders/cover.jpg"
        class="product-card-mini__img__content bg-cover"
        role="img">
        <div v-if="item.currency_id"
             :class="{'product-card-mini__label--present':item.currency_id === 3}"
             class="product-card-mini__label">
          <present-card
            v-if="item.currency_id === 3"/>
          <span v-else-if="item.value">
            <template v-if="item.currency_id === 1">
              {{ item.value }}%
            </template>
            <template v-else-if="item.currency_id === 2">
              {{ item.value }}₽
            </template>
            <template v-else-if="item.currency_id === 4">
              {{ item.value }} <bonus/>
            </template>
            <template v-else-if="item.currency_id === 5">
              {{ item.value }} <cashback/>
            </template>
            <template v-else>
              {{ item.value }}₽
            </template>
          </span>
        </div>
      </div>
      <div
        v-else :style="{backgroundImage: '/placeholders/cover.jpg'}"
        class="product-card-mini__img__content bg-cover"
        role="img">
        <div v-if="item.currency_id"
             :class="{'product-card-mini__label--present':item.currency_id === 3}"
             class="product-card-mini__label">
          <present-card
            v-if="item.currency_id === 3"/>
          <span v-else-if="item.value">
            {{ item.value }}{{ (item.currency_id === 1)? '%' : '₽' }}
          </span>
        </div>
      </div>

    </div>
    <div class="product-card-mini__body" v-html="(item.name)?splitReplaceShort(item.name, 63):''"/>
  </div>
</template>

<script>

export default {
  components: {
    'Bonus': () => import('~/components/Icons/Bonus'),
    'Cashback': () => import('~/components/Icons/Cashback'),
    'PresentCard': () => import('~/components/Icons/PresentCard')
  },
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  methods: {
    splitReplaceShort (str, length) {
      if (!str) {
        return str
      }
      let arrStr = str.split('\n')
      if (arrStr.length > 3) {
        str = arrStr[0] + ((arrStr[1]) ? '<br>' + arrStr[1] : '') + ((arrStr[2]) ? '<br>' + arrStr[2] : '') + '...'
      } else {
        if (str.length > length) {
          str = str.slice(0, length).trim()
          str += '...'
        }
        str.replaceAll('\n', '<br>')
      }
      return str
    }
  }
}
</script>

<style>

</style>
