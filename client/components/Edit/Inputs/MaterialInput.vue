<template>
  <div :class="formClass_">
    <input
      ref="materialInput"
      :id="id"
      :class="inputClass_"
      :value="value"
      :name="name"
      :type="type"
      :readonly="readonly"
      required
      @input="$emit('input', $event.target.value)"
    >
    <label :for="id" v-html="placeholder"/>
    <div class="material-input__line"/>
    <has-error v-if="form" :form="form" :field="field"/>
    <slot/>
  </div>
</template>

<script>

export default {
  props: {
    autofocus: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    form: {
      type: Object,
      default: undefined
    },
    field: {
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
    formClass_ () {
      let typeClass = this.typesInput[this.typeInput]
      let formClass = this.formClass
      if (!typeClass.isEmpty()) { typeClass = ' ' + typeClass }
      if (!formClass.isEmpty()) { formClass = ' ' + formClass }
      return 'material-input' + typeClass + formClass
    },
    inputClass_ () {
      let res = {
        'ff-montserrat': (this.typeInput === 'inline')
      }
      if (this.inputClass) {
        res = { ...res, [this.inputClass]: true }
      }
      if (this.form) {
        res = { ...res, 'is-invalid': this.form.errors.has(this.field) }
      }
      return res
    }
  },
  mounted () {
    if (this.autofocus && this.$refs.materialInput) {
      this.$refs.materialInput.focus()
    }
  }
}
</script>

<style>
</style>
