<template>
  <nav class="navbar">
    <div class="container">
      <router-link :to="{ name: user ? 'home' : 'welcome' }" class="navbar__brand">
        <full-logo/>
      </router-link>

      <div class="">
        <div class=""/>
        <ul class="navbar__nav list-unstyled">
          <li class="nav-item">
            <router-link :to="{ name: 'management.organizations.index' }" class="nav-link" active-class="active">
              Управление организациями
            </router-link>
          </li>
          <li class="nav-item">
            <router-link :to="{ name: 'products' }" class="nav-link" active-class="active">
              Все акции
            </router-link>
          </li>
          <li class="nav-item">
            <router-link :to="{ name: 'organizations' }" class="nav-link" active-class="active">
              Все компании
            </router-link>
          </li>
          <li class="nav-item">
            <router-link :to="{ name: 'business' }" class="nav-link" active-class="active">
              Бизнесу
            </router-link>
          </li>
          <li class="nav-item">
            <router-link :to="{ name: 'blog' }" class="nav-link" active-class="active">
              Блог
            </router-link>
          </li>
          <li class="nav-item">
            <router-link :to="{ name: 'contacts' }" class="nav-link" active-class="active">
              Контакты
            </router-link>
          </li>

        </ul>
      </div>

      <div id="navbarToggler" class="collapse navbar-collapse">

        <ul class="navbar-nav ml-auto">
          <!-- Authenticated -->
          <template v-if="user">
            <li class="nav-item">
              <router-link :to="{ name: 'settings.profile' }" class="nav-link pl-3">
                <fa icon="cog" fixed-width/>
                {{ $t('settings') }}
              </router-link>
            </li>
            <li class="nav-item">
              <a class="nav-link pl-3" href="#" @click.prevent="logout">
                <fa icon="sign-out-alt" fixed-width/>
                Выход
              </a>
            </li>
          </template>
          <!-- Guest -->
          <template v-else>
            <li class="nav-item">
              <router-link :to="{ name: 'login' }" class="nav-link" active-class="active">
                Вход
              </router-link>
            </li>
            <li class="nav-item">
              <router-link :to="{ name: 'register' }" class="nav-link" active-class="active">
                Регистрация
              </router-link>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapGetters } from 'vuex'
import LocaleDropdown from './LocaleDropdown'
import FullLogo from '~/components/Navbar/FullLogo'

export default {
  components: {
    LocaleDropdown,
    FullLogo
  },

  data: () => ({
    appName: process.env.appName
  }),

  computed: mapGetters({
    user: 'auth/user'
  }),

  methods: {
    async logout () {
      // Log out the user.
      await this.$store.dispatch('auth/logout')

      // Redirect to login.
      this.$router.push({ name: 'login' })
    }
  }
}
</script>

<style scoped>
.profile-photo {
  width: 2rem;
  height: 2rem;
  margin: -.375rem 0;
}
</style>
