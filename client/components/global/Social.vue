<template>
  <div
    :data-type="type"
    :class="'social-icon' + ((classBox !== '') ? ' ' + classBox : '')"
    @click="$emit('click', $event)"
    @mouseleave="$emit('mouseleave', $event)"
    @mouseenter="$emit('mouseenter', $event)"
    @mousedown="$emit('mousedown', $event)"
    @mouseup="$emit('mouseup', $event)"
  >
    <fa :icon="icon" />
  </div>
</template>

<script>

export default {
  name: 'Social',
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
      'ok': 'odnoklassniki',
      'odnoklassniki': 'odnoklassniki',
      'facebook': 'facebook-f',
      'google': 'google',
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
