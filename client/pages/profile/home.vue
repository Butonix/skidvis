<template>
  <transition name="fade" mode="out-in">
    <div>
      <div class="container">
        <h5>
          Мой профиль
        </h5>
      </div>
      <router-view/>
    </div>
  </transition>
</template>

<script>
import blog from '~/mixins/blog'

export default {
  middleware: ['auth'],
  mixins: [blog]
}
</script>

<style>
</style>
