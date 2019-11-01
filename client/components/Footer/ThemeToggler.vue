<template>
  <div>
    <div v-if="label" :class="{'active': black}" class="footer__toggle" @click="setBlack(black?0:1)">
      <div class="footer__toggle__label" v-html="black?'Ночная тема':'Дневная тема'">
        Ночная тема
      </div>
    </div>
    <div v-title-tippy="black?'Ночная тема':'Дневная тема'" v-else :class="{'active': black}" class="footer__toggle"
         @click="setBlack(black?0:1)"/>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  props: {
    label: {
      type: Boolean,
      default: true
    }
  },
  computed: mapGetters({
    black: 'variables/black'
  }),
  methods: mapActions({
    setBlack: 'variables/setBlack'
  })
}
</script>

<style>

</style>
