<template>
  <transition name="fade" mode="out-in">
    <div>
      <div class="container">
        <h5>
          Закладки
        </h5>
        <div class="tab-panel tab-panel--slim mt-3">
          <router-link :to="{ name: 'bookmarks.products' }" :class="{'active': $route.name === 'bookmarks.products'}"
                       class="tab tab-default"
          >
            Акции
          </router-link>
          <router-link :to="{ name: 'bookmarks.articles' }" :class="{'active': $route.name === 'bookmarks.articles'}"
                       class="tab tab-blog"
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
import blog from '~/mixins/blog'

export default {
  middleware: ['reactData'],
  mixins: [blog]
}
</script>

<style>
</style>
