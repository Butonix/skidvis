<template>
  <div
    :data-type="type"
    :class="'social-icon' + ((classBox !== '') ? ' ' + classBox : '')"
  >
    <fa :icon="icon" />
  </div>
</template>

<script>

export default {
  props: {
    // eslint-disable-next-line vue/require-default-prop
    type: {
      type: String
    },
    classBox: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    icons: {
      'vk': 'vk',
      'odnoklassniki': 'odnoklassniki',
      'facebook': 'facebook-f',
      'instagram': 'instagram'
    }
  }),
  computed: {
    icon () {
      return ['fab', this.icons[this.type]]
    }
  }
}
</script>

<style>
</style>
