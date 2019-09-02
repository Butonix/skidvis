<template>
  <div :class="{'loading':loading}" class="photo-input">
    <no-ssr>
      <div v-if="src" class="photo-input__remove"
           @click="onDelete"
      />
      <picture-input
        :crop="crop"
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
        @change="onChange"
      />
    </no-ssr>
  </div>
</template>

<script>

export default {
  components: {
    // 'PictureInput': () => import('~/components/PictureInput').then(m => m.default || m)
  },
  props: {
    crop: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    src: {
      type: String,
      default: ''
    },
    width: {
      type: Number,
      default: 306
    },
    height: {
      type: Number,
      default: 117
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
