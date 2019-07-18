<template>
  <div :class="{'loading':loading}" class="photo-input">
    <no-ssr>
      <div v-if="src" class="photo-input__remove"
           @click="onDelete"
      />
      <picture-input
        :crop="false"
        :prefill="src"
        :alert-on-error="false"
        :custom-strings="{
          upload: '',
          drag: '',
          tap: '',
          change: '',
          remove: '',
          select: '',
          selected: '',
          fileSize: '',
          fileType: '',
          aspect: '',
        }"
        width="306"
        height="117"
        button-class="d-none"
        @change="onChange"/>
    </no-ssr>
  </div>
</template>

<script>

export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    src: {
      type: String,
      default: ''
    }
  },
  computed: {
  },
  methods: {
    async onDelete (event) {
      let res = await this.$confirmDelete()
      if (res.value) {
        this.$emit('delete', event)
      }
    },
    onChange (image) {
      if (image) {
        this.$emit('change', image)
      } else {
        console.log('FileReader API not supported: use the , Luke!')
      }
    }
  }
}
</script>

<style>
</style>
