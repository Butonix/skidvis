<template>
  <div
    :class="classWrapper"
    class="dynamic-input"
  >
    <span>{{ value }}</span>
    <div
      :class="classBox"
      class="dynamic-input__box"
    >
      <input
        :name="name"
        :value="value"
        :class="classInput"
        :placeholder="placeholder"
        type="text"
        required
        @keypress="onlyNumber"
        @input="$emit('input', $event.target.value)"
      >
    </div>
  </div>
</template>

<script>

export default {
  props: {
    name: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text',
      validator: function (value) {
        return ['text', 'number', 'percent'].indexOf(value) !== -1
      }
    },
    value: {
      type: String | Number,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    classWrapper: {
      type: String,
      default: ''
    },
    classBox: {
      type: String,
      default: ''
    },
    classInput: {
      type: String,
      default: ''
    }
  },
  methods: {
    onlyNumber (event) {
      if (this.type === 'number') {
        if (!/\d/.test(event.key) && event.key !== '.') return event.preventDefault()
      }
      if (this.type === 'percent') {
        if (!/\d/.test(event.key) && event.key !== '.') return event.preventDefault()
        let value = Number(event.target.value + event.key)
        if (value > 100) {
          return event.preventDefault()
        }
      }
    }
  }
}
</script>

<style>
</style>
