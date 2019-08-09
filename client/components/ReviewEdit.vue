<template>
  <div class="review review--edit">
    <div v-if="check" class="review-header">
      <avatar-with-name
        :user="user"
      />

      <div v-if="fieldRating" class="d-flex align-items-center justify-content-start justify-content-md-end pt-3 pt-xs-0">
        <div class="h6 text-muted pr-2 mr-1 d-none d-md-block" v-text="form[fieldRating]?'Ваша оценка':'Поставить оценку'"/>

        <star-rating
          :edit="true"
          :rating="form[fieldRating]"
          @click="$emit('setrating', $event)"
        />
      </div>

    </div>
    <div v-if="check" class="review-body">
      <div class="review-body__desc">
        <material-textarea
          :value="form[fieldContent]"
          :form="form"
          :rows="1"
          :field="fieldContent"
          type-input="review"
          placeholder="Написать отзыв..."
          form-class=""
          @input="$emit('inputcomment', $event)"
        />
        <div v-if="fieldPros" class="row no-gutters mb-3 mt-4">
          <div class="col-auto d-flex align-items-center px-2 pb-2">
            <plus-bold class="mx-1" style="color: #049F5C"/>
          </div>
          <div class="col">
            <material-textarea
              :value="form[fieldPros]"
              :form="form"
              :rows="1"
              :field="fieldPros"
              type-input="review"
              placeholder="Плюсы..."
              form-class=""
              @input="$emit('inputpros', $event)"
            />
          </div>
        </div>
        <div v-if="fieldCons" class="row no-gutters">
          <div class="col-auto d-flex align-items-center px-2 pb-2">
            <minus-bold class="mx-1" style="color: #FF2E2E"/>
          </div>
          <div class="col">
            <material-textarea
              :value="form[fieldCons]"
              :form="form"
              :rows="1"
              :field="fieldCons"
              type-input="review"
              placeholder="Минусы..."
              form-class=""
              @input="$emit('inputcons', $event)"
            />
          </div>
        </div>
      </div>
      <div class="review-body__btn">
        <div class="btn btn-outline-primary"
             @click="$emit('send', $event)"
        >
          Отправить
        </div>
      </div>
    </div>
    <div v-else class="review-login text-center">
      <div class="btn btn-outline-primary mb-3" @click="$modal.push('login')">
        Войти
      </div>
      <div class="h6">
        После входа можно оставить отзыв
      </div>
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
    'MaterialTextarea': () => import('~/components/Edit/Inputs/MaterialTextarea')
  },
  props: {
    check: {
      type: Boolean,
      required: true
    },
    fieldRating: {
      type: String,
      default: null
    },
    fieldPros: {
      type: String,
      default: null
    },
    fieldCons: {
      type: String,
      default: null
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
