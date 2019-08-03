<template>
  <nav class="navbar">
    <div class="container navbar__container">
      <router-link :to="{ name: 'welcome' }" class="navbar__brand">
        <div class="navbar__brand__label">
          сервис скидок
        </div>
        <full-logo/>
      </router-link>

      <div :class="{'active':openMenu}" class="navbar__menu__wrapper">
        <div class="container navbar__menu">
          <div class="d-block d-lg-none w-100 text-right">
            <div :class="{'active': openMenu}" class="nav-burger d-inline-block mb-2" @click="openMenu = !openMenu"/>
          </div>
          <div class="order-2 order-lg-1 mb-2 mb-lg-0">

            <select-alphabet
              :selected="city"
              :list="cities"
              @click="onShowCities"
              @select="setCity"
            />

            <div>
              <ul class="navbar__nav list-unstyled">
                <nav-item :to="{ name: 'products.index' }" class-link="nav-link--default">
                  Все акции
                </nav-item>
                <nav-item :to="{ name: 'organizations.index' }" class-link="nav-link--default">
                  Все компании
                </nav-item>
                <nav-item :to="{ name: 'business' }" class-link="nav-link--business">
                  Бизнесу
                </nav-item>
                <nav-item :to="{ name: 'blog.index' }" class-link="nav-link--blog icon-blog">
                  Блог
                </nav-item>
                <nav-item :to="{ name: 'contacts' }" class-link="nav-link--default">
                  Контакты
                </nav-item>
              </ul>
            </div>
          </div>
          <div class="order-3 order-lg-2 ml-lg-auto">
            <flag :count="wishCount"/>
          </div>
          <div class="order-1 order-lg-3 ml-lg-4 mb-3 mb-lg-0">
            <div v-click-outside="closeCollapse" v-if="check" :class="{'active': openCollapse}"
                 class="auth-collapse"
                 @click="openCollapse = !openCollapse">
              <button v-if="user.avatar && user.avatar.src" class="btn btn-outline-primary btn-auth btn-auth--active">
                <img :src="user.avatar.src">
              </button>
              <button v-else class="btn btn-outline-primary btn-auth btn-auth--active text-uppercase">
                {{ user.initials || 'АК' }}
              </button>
              <div class="auth-collapse__wrapper">
                <ul class="auth-collapse__list list-unstyled">
                  <nav-item :to="{ name: 'profile.show' }">
                    Профиль
                  </nav-item>
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
            <template v-else>
              <button class="btn btn-outline-primary btn-auth d-none d-xl-inline-block"
                      @click="showModalLogin"
              >
                Войти
              </button>
              <button class="btn btn-outline-primary btn-auth btn-auth--active btn-auth--sign-in d-inline-block d-xl-none"
                      @click="showModalLogin">
                <sign-in-icon styled="font-size: 1.8rem; top: .3rem; position: relative;"/>
              </button>
            </template>
          </div>
        </div>
      </div>
      <div :class="{'active': openMenu}" class="nav-burger nav-burger--front d-inline-block d-lg-none mb-2 ml-auto" @click="openMenu = !openMenu"/>
    </div>
    <modal-login />
  </nav>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    'login': () => import('~/components/Auth/login'),
    'vSelect': () => import('vue-select'),
    'Flag': () => import('~/components/Navbar/Flag'),
    'ModalLogin': () => import('~/components/ModalLogin'),
    'SignInIcon': () => import('~/components/Icons/SignInIcon'),
    'FullLogo': () => import('~/components/Navbar/FullLogo')
  },

  data: () => ({
    openMenu: false,
    openCollapse: false,
    appName: process.env.appName
  }),

  watch: {
    openMenu (to) {
      if (to) {
        document.body.classList.add('overflow-hidden')
      } else {
        document.body.classList.remove('overflow-hidden')
      }
    }
  },

  computed: mapGetters({
    user: 'auth/user',
    check: 'auth/check',
    wishCount: 'auth/wishCount',
    cities: 'auth/cities',
    city: 'auth/city'
  }),

  methods: {
    ...mapActions({
      setCity: 'auth/setCity'
    }),
    closeCollapse () {
      this.openCollapse = false
    },
    showModalLogin () {
      this.$modal.push('login')
    },
    async onShowCities () {
      if (!this.cities.length) {
        await this.$store.dispatch('auth/fetchCities')
      }
    },
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
