<template>
  <div class="review">
    <div class="review-header">
      <avatar-with-name
        :user="review.user"
      />

      <div class="d-flex align-items-center justify-content-start justify-content-md-end pt-3 pt-xs-0">
        <star-rating
          :rating="review.rating"
        />
      </div>
    </div>
    <div class="review-body" v-html="review.text"/>
  </div>
</template>

<script>
export default {
  components: {
    'StarRating': () => import('~/components/StarRating'),
    'AvatarWithName': () => import('~/components/AvatarWithName'),
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
