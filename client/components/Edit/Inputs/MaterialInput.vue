<template>
  <div :class="formClass_"
       @click="$emit('click', $event)">
    <input
      v-mask="'+7 ### ###-##-##'"
      v-if="type === 'tel'"
      ref="materialInput"
      :id="id"
      :class="inputClass_"
      :value="value"
      :name="name"
      :type="getType"
      :readonly="readonly"
      :autocomplete="autocomplete"
      required
      @input="$emit('input', $event.target.value)"
    >
    <input
      v-mask="'#####################'"
      v-else-if="type === 'number'"
      ref="materialInput"
      :id="id"
      :class="inputClass_"
      :value="value"
      :name="name"
      :type="getType"
      :readonly="readonly"
      :autocomplete="autocomplete"
      required
      @input="$emit('input', $event.target.value)"
    >
    <input
      v-else
      ref="materialInput"
      :id="id"
      :class="inputClass_"
      :value="value"
      :name="name"
      :type="getType"
      :readonly="readonly"
      :autocomplete="autocomplete"
      required
      @input="$emit('input', $event.target.value)"
    >
    <label :for="id" v-html="placeholder"/>
    <div class="material-input__line"/>
    <has-error v-if="form && form.errors" :form="form" :field="field"/>
    <slot/>
  </div>
</template>

<script>
import { mask } from 'vue-the-mask'

export default {
  directives: {
    mask
  },
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
      default: undefined
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
    getType () {
      let res = 'text'

      if (this.type === 'password') {
        res = 'password'
      }

      return res
    },
    id () {
      return ((this.name) ? this.name + '-' : '') + Math.ceil(Math.random() * 100000000)
    },
    autocomplete () {
      return (this.type === 'password') ? 'new-password' : 'off'
    },
    formClass_ () {
      let typeClass = this.typesInput[this.typeInput]
      let formClass = this.formClass
      if (!typeClass.isEmpty()) { typeClass = ' ' + typeClass }
      if (!formClass.isEmpty()) { formClass = ' ' + formClass }
      return {
        ['material-input' + typeClass + formClass]: true
      }
    },
    inputClass_ () {
      let res = {
        'ff-montserrat': (this.typeInput === 'inline')
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
