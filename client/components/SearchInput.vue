<template>
  <label :class="'search-input '+formClass">
    <input
      :type="type"
      :class="inputClass"
      :value="value"
      :placeholder="placeholder"
      :name="name"
      autofocus
      @input="$emit('input', $event.target.value)"
    >
    <div class="search-input__line"/>
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
    placeholder: {
      type: String,
      default: ''
    }
  }
}
</script>

<style>
</style>
