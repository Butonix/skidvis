<template>
  <div class="review review--edit">
    <div class="review-header">
      <avatar-with-name
        :user="user"
      />

      <div class="d-flex align-items-center justify-content-start justify-content-md-end pt-3 pt-xs-0">
        <div class="h6 text-muted pr-2 mr-1 d-none d-md-block" v-text="form[fieldRating]?'Ваша оценка':'Поставить оценку'"/>

        <star-rating
          :edit="true"
          :rating="form[fieldRating]"
          @click="$emit('setrating', $event)"
        />
      </div>

    </div>
    <div class="review-body">
      <div class="review-body__field">
        <material-textarea
          :value="form[fieldContent]"
          :form="form"
          :rows="1"
          type-input="review"
          field="fieldContent"
          placeholder="Написать отзыв..."
          form-class=""
          @input="$emit('inputcomment', $event)"
        />
      </div>
      <div class="review-body__btn">
        <div class="btn btn-outline-primary"
             @click="$emit('send', $event)"
        >
          Отправить
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  components: {
    'StarRating': () => import('~/components/StarRating'),
    'AvatarWithName': () => import('~/components/AvatarWithName'),
    'MaterialTextarea': () => import('~/components/Edit/Inputs/MaterialTextarea')
  },
  props: {
    fieldRating: {
      type: String,
      required: true
    },
    fieldContent: {
      type: String,
      required: true
    },
    form: {
      type: Object,
      required: true
    },
    user: {
      type: Object,
      required: true
    }
  }
}
</script>

<style>

</style>
