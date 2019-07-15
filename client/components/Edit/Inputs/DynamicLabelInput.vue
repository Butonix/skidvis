<template>
  <div
    :class="classWrapper"
    class="dynamic-input"
  >
    {{ value }}
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
  }
}
</script>

<style>
</style>
