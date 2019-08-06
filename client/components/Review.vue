<template>
  <div class="review">
    <div class="review-header">
      <avatar-with-name
        :user="review.user"
      />

      <div v-if="review.rating" class="d-flex align-items-center justify-content-start justify-content-md-end pt-3 pt-xs-0">
        <star-rating
          :rating="review.rating"
        />
      </div>
    </div>
    <div class="review-body">

      <div v-if="review.pros" class="row no-gutters mb-3">
        <div class="col-auto d-flex align-items-center px-2">
          <plus-bold class="mx-1" style="color: #049F5C"/>
        </div>
        <div class="col" v-text="review.pros"/>
      </div>

      <div v-if="review.cons" class="row no-gutters mb-4">
        <div class="col-auto d-flex align-items-center px-2">
          <minus-bold class="mx-1" style="color: #FF2E2E"/>
        </div>
        <div class="col" v-text="review.cons"/>
      </div>

      <div v-text="review.text"/>
    </div>
  </div>
</template>

<script>
export default {
  components: {
    'PlusBold': () => import('~/components/Icons/PlusBold'),
    'MinusBold': () => import('~/components/Icons/MinusBold'),
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
