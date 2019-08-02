<template>
  <div class="review">
    <div class="review-header">
      <avatar
        :user="review.user"
      />
    </div>
    <div class="review-body"/>
  </div>
</template>

<script>
export default {
  components: {
    'Avatar': () => import('~/components/Avatar')
  },
  props: {
    review: {
      type: Object,
      required: true
    }
  }
}
</script>

<style>

</style>
