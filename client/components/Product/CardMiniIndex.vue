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
        <value :currency_id="item.currency_id" :value="item.value" type="card-mini"/>
      </div>
      <div
        v-else :style="{backgroundImage: '/placeholders/cover.jpg'}"
        class="product-card-mini__img__content bg-cover"
        role="img">
        <value :currency_id="item.currency_id" :value="item.value" type="card-mini"/>
      </div>

    </div>
    <div class="product-card-mini__body" v-html="(item.name)?splitReplaceShort(item.name, 63):''"/>
  </div>
</template>

<script>

export default {
  components: {
    'Value': () => import('~/components/Value'),
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
