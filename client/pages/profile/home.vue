<template>
  <transition name="fade" mode="out-in">
    <div>
      <div class="container">
        <h5 v-html="(check)?'Мой профиль':$route.meta.title">
          Мой профиль
        </h5>
        <div v-if="check" class="tab-panel tab-panel--slim mt-3">
          <router-link :to="{ name: 'profile.show' }" :class="{'active': $route.name === 'profile.show'}"
                       class="tab"
          >
            Данные
          </router-link>
          <router-link :to="{ name: 'profile.wishlist' }" :class="{'active': $route.name === 'profile.wishlist'}"
                       class="tab"
          >
            Акции
          </router-link>
          <router-link :to="{ name: 'profile.bookmarks' }" :class="{'active': $route.name === 'profile.bookmarks'}"
                       class="tab"
          >
            Статьи
          </router-link>
        </div>
      </div>
      <router-view/>
    </div>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import blog from '~/mixins/blog'

export default {
  middleware: ['reactData'],
  mixins: [blog],
  computed: {
    ...mapGetters({
      check: 'auth/check'
    })
  }
}
</script>

<style>
</style>
