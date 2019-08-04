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
    <div v-if="review.pros" class="review-body" >
      <div class="row no-gutters mb-3 mt-4">
        <div class="col-auto d-flex align-items-center px-2 pb-2">
          <plus-bold class="mx-1" style="color: #049F5C"/>
        </div>
        <div class="col" v-text="review.pros"/>
      </div>
    </div>
    <div v-if="review.cons" class="review-body" >
      <div class="row no-gutters mb-3 mt-4">
        <div class="col-auto d-flex align-items-center px-2 pb-2">
          <minus-bold class="mx-1" style="color: #FF2E2E"/>
        </div>
        <div class="col" v-text="review.cons"/>
      </div>
    </div>
    <div class="review-body" v-text="review.text"/>
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
