<template>
  <div class="text-center mb-5">
    <social
      type="vk"
      size="lg"
      class="mx-2"
      @click="login('vkontakte')"
    />
    <social
      type="google"
      size="lg"
      class="mx-2"
      @click="login('google')"
    />
    <social
      type="facebook"
      size="lg"
      class="mx-2"
      @click="login('facebook')"
    />
  </div>
</template>

<script>
import { openWindow } from '~/utils'

export default {

  props: {
    store: {
      type: Object,
      required: true
    },
    router: {
      type: Object,
      required: true
    },
    route: {
      type: Object,
      required: true
    }
  },

  data: () => ({
    type: '',
    vkontakte: {
      width: 800,
      height: 500
    },
    google: {
      width: 600,
      height: 720
    },
    facebook: {
      width: 650,
      height: 605
    }
  }),

  computed: {
    githubAuth: () => process.env.githubAuth,
    url: () => `${process.env.apiUrl}/oauth/github`
  },

  mounted () {
    window.addEventListener('message', this.onMessage, false)
  },

  beforeDestroy () {
    window.removeEventListener('message', this.onMessage)
  },

  methods: {
    async login (type) {
      this.type = type
      try {
        const newWindow = openWindow('', 'Вход', this[type])

        const url = await this.store.dispatch('auth/fetchOauthUrl', {
          provider: type
        })

        newWindow.location.href = url
      } catch (e) {
        console.log(e)
      }
    },

    /**
     * @param {MessageEvent} e
     */
    onMessage (e) {
      if (e.origin !== process.env.apiOrigin) {
        return
      }
      if (this.type !== e.data.type) {
        return
      }
      this.type = ''

      this.store.dispatch('auth/saveToken', {
        token: e.data.token
      }).then(() => {
        this.store.dispatch('auth/fetchUser').then(() => {
          this.$emit('success')
        })
      })

      if (this.route.name === 'login' || this.route.name === 'register' ||
        this.route.name === 'password.request' || this.route.name === 'password.reset') {
        this.router.push({ name: 'welcome' })
      }

      this.$modal.pop()
    }
  }
}

</script>
