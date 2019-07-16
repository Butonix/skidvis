<template>
  <div class="text-center mb-5">
    <social
      type="vk"
      class-box="social-icon-lg mx-2 cursor-pointer"
      @click="login('vkontakte')"
    />
    <social
      type="google"
      class-box="social-icon-lg mx-2 cursor-pointer"
      @click="login('google')"
    />
    <social
      type="facebook"
      class-box="social-icon-lg mx-2 cursor-pointer"
      @click="login('facebook')"
    />
  </div>
</template>

<script>
import Social from '~/components/Icons/Social'

export default {

  components: {
    Social
  },

  data: () => ({
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
      try {
        const newWindow = openWindow('', this.$t('login'), this[type])

        const url = await this.$store.dispatch('auth/fetchOauthUrl', {
          provider: type
        })

        newWindow.location.href = url
      } catch (e) {

      }
    },

    /**
     * @param {MessageEvent} e
     */
    onMessage (e) {
      if (e.origin !== process.env.apiOrigin) {
        return
      }

      this.$store.dispatch('auth/saveToken', {
        token: e.data.token
      })

      this.$router.push({ name: 'home' })
    }
  }
}

/**
 * @param  {Object} options
 * @return {Window}
 */
function openWindow (url, title, options = {}) {
  if (typeof url === 'object') {
    options = url
    url = ''
  }

  options = { url, title, width: 600, height: 720, ...options }

  const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screen.left
  const dualScreenTop = window.screenTop !== undefined ? window.screenTop : window.screen.top
  const width = window.innerWidth || document.documentElement.clientWidth || window.screen.width
  const height = window.innerHeight || document.documentElement.clientHeight || window.screen.height

  options.left = ((width / 2) - (options.width / 2)) + dualScreenLeft
  options.top = ((height / 2) - (options.height / 2)) + dualScreenTop

  const optionsStr = Object.keys(options).reduce((acc, key) => {
    acc.push(`${key}=${options[key]}`)
    return acc
  }, []).join(',')

  const newWindow = window.open(url, title, optionsStr)

  if (window.focus) {
    newWindow.focus()
  }

  return newWindow
}
</script>
