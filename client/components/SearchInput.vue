<template>
  <label :class="{
    'search-input': true,
    [formClass]: !!formClass,
    ['search-input--'+typeStyle]: !!typeStyle
  }">
    <input
      ref="input"
      :type="type"
      :value="value"
      :placeholder="placeholder"
      :name="name"
      :class="{
        'ff-montserrat': !typeStyle,
        [inputClass]: !!inputClass
      }"
      :autofocus="!!autofocus"
      @input="$emit('input', $event.target.value)"
      @keyup="$emit('keyup', $event)"
    >
    <div class="search-input__line"/>
    <div v-if="value" class="search-input__close" @click="onClear">
      <fa icon="times"/>
    </div>
    <div class="search-input__lupe">
      <lupe/>
    </div>
  </label>
</template>

<script>
import Lupe from '~/components/Icons/Lupe'

export default {
  components: {
    Lupe
  },
  props: {
    typeStyle: {
      type: String,
      default: ''
    },
    formClass: {
      type: String,
      default: ''
    },
    inputClass: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    name: {
      type: String,
      default: ''
    },
    value: {
      type: String | Number,
      default: ''
    },
    autofocus: {
      type: Boolean | Number | String,
      default: false
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  methods: {
    onClear () {
      this.$emit('input', '')
      this.focus()
    },
    focus () {
      setTimeout(() => {
        this.$refs.input.focus()
      }, 300)
    }
  }
}
</script>

<style>
</style>
