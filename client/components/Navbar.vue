<template>
  <nav class="navbar">
    <div class="container navbar__container">
      <router-link :to="{ name: user ? 'home' : 'welcome' }" class="navbar__brand">
        <div class="navbar__brand__label">
          сервис скидок
        </div>
        <full-logo/>
      </router-link>

      <div class="">
        <div class="cursor-pointer nav-link">
          <span class="pr-1">{{ cityName }}</span>
          <chevron/>
        </div>
        <div>
          <ul class="navbar__nav list-unstyled">
            <nav-item :to="{ name: 'products' }" class-link="nav-link--default">
              Все акции
            </nav-item>
            <nav-item :to="{ name: 'organizations' }" class-link="nav-link--default">
              Все компании
            </nav-item>
            <nav-item :to="{ name: 'business' }" class-link="nav-link--business">
              Бизнесу
            </nav-item>
            <nav-item :to="{ name: 'blog' }" class-link="nav-link--blog icon-blog">
              Блог
            </nav-item>
            <nav-item :to="{ name: 'contacts' }" class-link="nav-link--default">
              Контакты
            </nav-item>
          </ul>
        </div>
      </div>
      <div class="ml-auto">
        <flag :count="wishCount"/>
      </div>
      <div class="ml-4">
        <div v-if="user" class="auth-collapse">
          <button v-if="user.avatar && user.avatar.src" class="btn btn-outline-primary btn-auth btn-auth--active">
            <img :src="user.avatar.src">
          </button>
          <button v-else class="btn btn-outline-primary btn-auth btn-auth--active text-uppercase">
            {{ user.initials || 'АК' }}
          </button>
          <div class="auth-collapse__wrapper">
            <ul class="auth-collapse__list list-unstyled">
              <nav-item :to="{ name: 'management.organizations.index' }">
                Организации
              </nav-item>
              <li class="nav-item">
                <div class="nav-link cursor-pointer" @click.prevent="logout">
                  Выйти
                </div>
              </li>
            </ul>
          </div>
        </div>
        <router-link v-else :to="{ name: 'login' }"
                     class="btn btn-outline-primary btn-auth">
          Войти
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    'vSelect': () => import('vue-select'),
    'NavItem': () => import('~/components/Navbar/NavItem'),
    'Chevron': () => import('~/components/Icons/Chevron'),
    'Flag': () => import('~/components/Icons/Flag'),
    'FullLogo': () => import('~/components/Navbar/FullLogo')
  },

  data: () => ({
    appName: process.env.appName
  }),

  computed: mapGetters({
    user: 'auth/user',
    cities: 'auth/cities',
    wishCount: 'auth/wishCount',
    cityName: 'auth/cityName',
    city: 'auth/city'
  }),

  methods: {
    ...mapActions({
      setCity: 'auth/setCity'
    }),
    async logout () {
      // Log out the user.
      await this.$store.dispatch('auth/logout')

      // Redirect to login.
      this.$router.push({ name: 'login' })
    }
  }
}
</script>

<style>
</style>
