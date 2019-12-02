<template>
  <a
    v-if="link"
    :href="link"
    :data-type="type"
    :class="{
      ['social-icon--'+mode]:!!mode,
      ['social-icon--'+size]:!!size,
    }"
    class="social-icon"
    target="_blank"
    @click="onClick"
    @mouseleave="$emit('mouseleave', $event)"
    @mouseenter="$emit('mouseenter', $event)"
    @mousedown="$emit('mousedown', $event)"
    @mouseup="$emit('mouseup', $event)"
  >
    <fa :icon="icon" />
  </a>
  <span
    v-else
    :data-type="type"
    :class="{
      ['social-icon--'+mode]:!!mode,
      ['social-icon--'+size]:!!size,
    }"
    class="social-icon"
    @click="onClick"
    @mouseleave="$emit('mouseleave', $event)"
    @mouseenter="$emit('mouseenter', $event)"
    @mousedown="$emit('mousedown', $event)"
    @mouseup="$emit('mouseup', $event)"
  >
    <fa :icon="icon" />
  </span>
</template>

<script>

export default {
  name: 'Social',
  props: {
    link: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      required: true
    },
    size: {
      type: String,
      validator: function (value) {
        return ['', 'lg'].indexOf(value) !== -1
      },
      default: ''
    },
    mode: {
      type: String,
      validator: function (value) {
        return ['', 'outline', 'shadow'].indexOf(value) !== -1
      },
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
      'twitter': 'twitter',
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
