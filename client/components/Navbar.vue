<template>
  <nav class="navbar">
    <div class="container">
      <router-link :to="{ name: user ? 'home' : 'welcome' }" class="navbar__brand">
        <full-logo/>
      </router-link>

      <div class="">
        <div class="">

        </div>
        <div>
          <ul class="navbar__nav list-unstyled">
            <nav-item :to="{ name: 'products' }">
              Все акции
            </nav-item>
            <nav-item :to="{ name: 'organizations' }">
              Все компании
            </nav-item>
            <nav-item :to="{ name: 'business' }">
              Бизнесу
            </nav-item>
            <nav-item :to="{ name: 'blog' }">
              Блог
            </nav-item>
            <nav-item :to="{ name: 'contacts' }">
              Контакты
            </nav-item>

          </ul>
        </div>
      </div>
    </div>


    <!--<div id="navbarToggler" class="collapse navbar-collapse">-->

    <!--  <ul class="navbar-nav ml-auto">-->
    <!--    &lt;!&ndash; Authenticated &ndash;&gt;-->
    <!--    <template v-if="user">-->
    <!--      <li class="nav-item">-->
    <!--        <router-link :to="{ name: 'settings.profile' }" class="nav-link pl-3">-->
    <!--          <fa icon="cog" fixed-width/>-->
    <!--          {{ $t('settings') }}-->
    <!--        </router-link>-->
    <!--      </li>-->
    <!--      <li class="nav-item">-->
    <!--        <a class="nav-link pl-3" href="#" @click.prevent="logout">-->
    <!--          <fa icon="sign-out-alt" fixed-width/>-->
    <!--          Выход-->
    <!--        </a>-->
    <!--      </li>-->
    <!--    </template>-->
    <!--    &lt;!&ndash; Guest &ndash;&gt;-->
    <!--    <template v-else>-->
    <!--      <li class="nav-item">-->
    <!--        <router-link :to="{ name: 'login' }" class="nav-link" active-class="active">-->
    <!--          Вход-->
    <!--        </router-link>-->
    <!--      </li>-->
    <!--      <li class="nav-item">-->
    <!--        <router-link :to="{ name: 'register' }" class="nav-link" active-class="active">-->
    <!--          Регистрация-->
    <!--        </router-link>-->
    <!--      </li>-->
    <!--    </template>-->
    <!--  </ul>-->
    <!--</div>-->
  </nav>
</template>

<script>
import { mapGetters } from 'vuex'
// import NavItem from '~/components/Navbar/NavItem'

export default {
  components: {
    // 'PictureInput': () => import('~/components/PictureInput').then(m => m.default || m)
    'NavItem': () => import('~/components/Navbar/NavItem'),
    'FullLogo': () => import('~/components/Navbar/FullLogo')
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
