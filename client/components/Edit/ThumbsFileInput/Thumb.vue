<template>
  <div class="thumbs-file-input__thumb photo-input">
    <no-ssr>
      <div v-if="src" class="photo-input__remove"
           @click="onDelete"/>
      <picture-input
        :prefill="src"
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
        width="1920"
        height="700"
        button-class="d-none"
        @change="onChange" />
    </no-ssr>
  </div>
</template>

<script>

export default {
  props: {
    image: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
    showDelete: false
  }),
  computed: {
    src () {
      return (this.image[480] && this.image[480].src) ? this.image[480].src : ((this.image.src) ? this.image.src : '')
    }
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
        this.$emit('change', {
          image
        })
      } else {
        console.log('FileReader API not supported: use the , Luke!')
      }
    }
  }
}
</script>

<style>
</style>
