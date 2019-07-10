<template>
  <div :class="'material-input '+formClass"
       :data-align="dataAlign">
    <textarea
      :id="id"
      :type="type"
      :class="inputClass"
      :name="name"
      :rows="rows"
      :cols="cols"
      required
      @input="$emit('input', $event.target.value)"
      v-html="value"
    />
    <label :for="id" v-html="placeholder"/>
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
    },
    dataAlign: {
      type: String,
      default: 'left'
    },
    cols: {
      type: String,
      default: '50'
    },
    rows: {
      type: String,
      default: '4'
    }
  },
  computed: {
    id () {
      return ((this.name) ? this.name + '-' : '') + Math.ceil(Math.random() * 100000000)
    }
  },
  methods: {
  }
}
</script>

<style>
</style>
