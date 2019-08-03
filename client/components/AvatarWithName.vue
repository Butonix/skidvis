<template>
  <div class="d-flex align-items-center justify-content-start">
    <avatar
      :user="user"
    />
    <div v-if="user.f_name && user.l_name" class="pl-2 ml-1 font-weight-bolder" v-text="user.f_name + ' ' + user.l_name.trim().charAt(0).toUpperCase() + '.'"/>
    <div v-else-if="user.f_name && user.m_name" class="pl-2 ml-1 font-weight-bolder" v-text="user.f_name + ' ' + user.m_name.trim().charAt(0).toUpperCase() + '.'"/>
    <div v-else-if="user.f_name" class="pl-2 ml-1 font-weight-bolder" v-text="user.f_name"/>
    <div v-else-if="user.email" class="pl-2 ml-1 font-weight-bolder" v-text="user.email"/>
    <div v-else class="pl-2 ml-1 font-weight-bolder" v-text="'АК'"/>
  </div>
</template>

<script>

export default {
  components: {
    'Avatar': () => import('~/components/Avatar'),
  },
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
