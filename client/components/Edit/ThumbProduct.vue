<template>
  <div :class="{'loading':loading}" class="photo-input--product">
    <client-only>
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
        width="324"
        height="131"
        button-class="d-none"
        @change="onChange" />
    </client-only>
  </div>
</template>

<script>

export default {
  components: {
    // 'PictureInput': () => import('~/components/PictureInput').then(m => m.default || m)
  },
  props: {
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
      return (this.image.src) ? this.image.src : ''
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

<style lang="scss">
  .photo-input--product{
    cursor: pointer;
    position: relative;

    .preview-container {
      position: relative !important;
      max-width: none!important;
      width: 100% !important;
      z-index: 2;
      &:hover {
        .picture-inner {
          &:before {
            opacity: 1;
          }
        }
      }
      @media (hover: none) {
        .picture-inner {
          &:before {
            opacity: 1;
          }
        }
      }
    }
    .picture-preview{
      &.dragging-over~{
        .picture-inner {
          &:before {
            opacity: 1;
          }
        }
      }
    }
    .picture-preview{
      border-radius: 0 !important;
      border: none!important;
      background: radial-gradient(331.84px at 100% 0%, #00C2FF 0%, #0096FF 100%);
    }
    .picture-inner {
      position: absolute !important;
      margin: 0 !important;
      left: 0 !important;
      top: 0 !important;
      right: 0 !important;
      bottom: 0 !important;
      display: block;
      width: 100% !important;
      height: 100% !important;
      border: none!important;

      &:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 1;
        transition: .2s;
        background: center no-repeat url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzgiIGhlaWdodD0iMzEiIHZpZXdCb3g9IjAgMCAzOCAzMSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMzQuODMzMyA0LjU0MjQySDI2LjY3OTJMMjQuNDYyNSAwSDEzLjUzNzVMMTEuMjQxNyA0LjU0MjQySDMuMTY2NjdDMS40MjUgNC41NDI0MiAwIDUuOTc2ODYgMCA3LjczMDA4VjI3LjczMjZDMCAyOS40ODU5IDEuNDI1IDMwLjkyMDMgMy4xNjY2NyAzMC45MjAzSDM0LjgzMzNDMzYuNTc1IDMwLjkyMDMgMzggMjkuNDg1OSAzOCAyNy43MzI2VjcuNzMwMDhDMzggNS45NzY4NiAzNi41NzUgNC41NDI0MiAzNC44MzMzIDQuNTQyNDJaTTI3LjE1NDIgMjAuNDgwN0gyMC45NzkyVjI2LjY5NjdIMTcuMDIwOFYyMC40ODA3SDEwLjg0NThWMTYuNDk2MUgxNy4wMjA4VjEwLjM1OTlIMjAuOTc5MlYxNi41NzU4SDI3LjE1NDJWMjAuNDgwN1oiIGZpbGw9IndoaXRlIi8+PC9zdmc+);
      }
    }
  }
</style>
