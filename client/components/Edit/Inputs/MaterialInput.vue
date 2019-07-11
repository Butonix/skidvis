<template>
  <div :class="formInputClass">
    <input
      :id="id"
      :class="inputClass"
      :value="value"
      :name="name"
      :type="type"
      required
      @input="$emit('input', $event.target.value)"
    >
    <label :for="id" v-html="placeholder"/>
    <div class="material-input__line"/>
    <has-error v-if="form" :form="form" field="password"/>
  </div>
</template>

<script>

export default {
  props: {
    formClass: {
      type: String,
      default: ''
    },
    inputClass: {
      type: String,
      default: ''
    },
    form: {
      type: Object,
      default: undefined
    },
    type: {
      type: String,
      default: 'text',
      validator: function (value) {
        return ['text', 'password'].indexOf(value) !== -1
      }
    },
    typeInput: {
      type: String,
      default: '',
      validator: function (value) {
        return ['', 'inline'].indexOf(value) !== -1
      }
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
  },
  data: () => ({
    typesInput: {
      '': '',
      'inline': 'material-input--inline'
    }
  }),
  computed: {
    id () {
      return ((this.name) ? this.name + '-' : '') + Math.ceil(Math.random() * 100000000)
    },
    formInputClass () {
      let typeClass = this.typesInput[this.typeInput]
      let formClass = this.formClass
      if (!typeClass.isEmpty()) { typeClass = ' ' + typeClass }
      if (!formClass.isEmpty()) { formClass = ' ' + formClass }
      return 'material-input' + typeClass + formClass
    }
  },
  methods: {}
}
</script>

<style>
</style>
