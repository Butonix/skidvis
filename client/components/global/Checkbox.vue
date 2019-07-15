<template>
  <div class="custom-control custom-checkbox d-flex">
    <input
      :name="name"
      :checked="internalValue"
      :id="id"
      type="checkbox"
      class="custom-control-input"
      @click="handleClick">
    <label :for="id" class="custom-control-label my-auto">
      <slot/>
    </label>
  </div>
</template>

<script>
export default {
  name: 'Checkbox',

  props: {
    name: { type: String, default: 'checkbox' },
    value: { type: Boolean, default: false },
    checked: { type: Boolean, default: false }
  },

  data: () => ({
    id: 1,
    internalValue: false
  }),

  watch: {
    value (val) {
      this.internalValue = val
    },

    checked (val) {
      this.internalValue = val
    },

    internalValue (val, oldVal) {
      if (val !== oldVal) {
        this.$emit('input', val)
      }
    }
  },
  created () {
    this.internalValue = this.value

    if ('checked' in this.$options.propsData) {
      this.internalValue = this.checked
    }
  },
  mounted () {
    this.id = ((this.name) ? this.name + '-' : '') + Math.ceil(Math.random() * 100000000)
  },

  methods: {
    handleClick (e) {
      this.$emit('click', e)

      if (!e.isPropagationStopped) {
        this.internalValue = e.target.checked
      }
    }
  }
}
</script>
