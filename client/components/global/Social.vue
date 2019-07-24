<template>
  <a
    :href="link"
    :data-type="type"
    :class="'social-icon' + ((classBox !== '') ? ' ' + classBox : '')"
    @click="onClick"
    @mouseleave="$emit('mouseleave', $event)"
    @mouseenter="$emit('mouseenter', $event)"
    @mousedown="$emit('mousedown', $event)"
    @mouseup="$emit('mouseup', $event)"
  >
    <fa :icon="icon" />
  </a>
</template>

<script>

export default {
  name: 'Social',
  props: {
    link: {
      type: String,
      default: '#'
    },
    type: {
      type: String,
      required: true
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
  },
  methods: {
    onClick ($event) {
      if (this.link === '#') {
        $event.preventDefault()
      }
      this.$emit('click', $event)
    }
  }
}
</script>

<style>
</style>
