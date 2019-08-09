<template>
  <transition name="fade" mode="out-in">
    <div>
      <div class="container">
        <h5 v-html="$route.meta.title">
          Мой профиль
        </h5>
        <div class="tab-panel tab-panel--slim mt-3">
          <router-link :to="{ name: 'profile.show' }" :class="{'active': $route.name === 'profile.show'}"
                       class="tab"
          >
            Данные
          </router-link>
          <router-link :to="{ name: 'profile.wishlist' }" :class="{'active': $route.name === 'profile.wishlist'}"
                       class="tab"
          >
            Избранное
          </router-link>
        </div>
      </div>
      <router-view/>
    </div>
  </transition>
</template>

<script>

export default {
  middleware: ['auth'],
  mounted () {
  }
}
</script>

<style>
</style>
