<template>
  <div :style="(user.avatar && user.avatar.src)?`background-image: url(${user.avatar.src});`:null"
       class="avatar"
       v-text="(user.avatar && user.avatar.src)?'':user.initials || 'АК'"/>
</template>

<script>

export default {
  props: {
    user: {
      type: Object,
      required: true
    }
  }
}
</script>

<style>

</style>
