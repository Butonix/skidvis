<template>
  <div class="photo-input">
    <no-ssr>
      <div v-if="src" class="photo-input__remove"
           @click="onDelete"
      />
      <picture-input
        :crop="false"
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
        width="306"
        height="117"
        button-class="d-none"
        @change="onChange"/>
    </no-ssr>
  </div>
</template>

<script>
import mixinSwal from '~/mixins/sweetalert2'

export default {
  mixins: [mixinSwal],
  props: {
    src: {
      type: String,
      default: ''
    }
  },
  computed: {
  },
  methods: {
    async onDelete (event) {
      let res = await this.$swal(this.configSwal().confirm)
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
