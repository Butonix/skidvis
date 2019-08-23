export default {
  mounted () {
    this.$store.dispatch('auth/fetchBlog')
  }
}
