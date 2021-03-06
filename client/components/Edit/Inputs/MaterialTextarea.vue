<template>
  <div :class="formClass_" :data-align="dataAlign">
    <textarea-autosize
      ref="materialInput"
      :id="id"
      :class="inputClass_"
      :name="name"
      :type="type"
      :readonly="readonly"
      :rows="rows"
      :cols="cols"
      :value="getValue"
      :min-height="30"
      :max-height="350"
      required
      @input="$emit('input', $event)"
    />
    <label :for="id" v-html="placeholder"/>
    <div class="material-input__line"/>
    <has-error v-if="form && form.errors" :form="form" :field="field"/>
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
    size: {
      type: String,
      default: '',
      validator: function (value) {
        return ['', 'sm'].indexOf(value) !== -1
      }
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
        return ['', 'inline', 'review'].indexOf(value) !== -1
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
    },
    dataAlign: {
      type: String,
      default: 'left'
    },
    cols: {
      type: String | Number,
      default: '50'
    },
    rows: {
      type: String | Number,
      default: '4'
    }
  },
  data: () => ({
    typesInput: {
      '': '',
      'inline': 'material-input--inline',
      'review': 'material-input--review'
    }
  }),
  computed: {
    id () {
      return ((this.name) ? this.name + '-' : '') + Math.ceil(Math.random() * 100000000)
    },
    getValue () {
      return (this.value) ? this.value : ''
    },
    formClass_ () {
      let typeClass = this.typesInput[this.typeInput]
      let formClass = this.formClass
      let sizeClass = (this.size) ? ' material-input--' + this.size : ''
      if (!typeClass.isEmpty()) { typeClass = ' ' + typeClass }
      if (!formClass.isEmpty()) { formClass = ' ' + formClass }
      return 'material-input' + typeClass + formClass + sizeClass
    },
    inputClass_ () {
      let res = {
        'ff-montserrat': true
      }
      if (this.inputClass) {
        res = { ...res, [this.inputClass]: true }
      }
      if (this.form && this.form.errors) {
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
