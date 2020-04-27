<template>
  <div :class="{'loading':loading}" class="thumbs-file-input__thumb photo-input">
    <client-only>
      <div v-if="src" class="photo-input__remove"
           @click="onDelete"/>
      <picture-input
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
        :width="width"
        :height="height"
        button-class="d-none"
        @change="onChange" />
    </client-only>
  </div>
</template>

<script>

export default {
  components: {
    // 'PictureInput': () => import('~/components/PictureInput')
  },
  props: {
    width: {
      type: String | Number,
      default: 1920
    },
    height: {
      type: String | Number,
      default: 700
    },
    loading: {
      type: Boolean,
      default: false
    },
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
