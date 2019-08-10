<template>
  <div class="article-card"
  :class="{['article-card--'+type]: !!type}">
    <div class="article-card__wrapper">
      <div class="article-card__img">
        <div class="article-card__img__content bg-cover bg-danger"/>
      </div>
      <div class="article-card__body">
        <div v-if="type === 'new'" class="article-card__body__name">
          Торт на свадьбу. Главное, чтобы вкусно
        </div>
        <div v-if="type === 'new'" class="article-card__body__small">
          Содержание:
        </div>
        <div class="article-card__body__text">
          Если впервые в Москве, сходите сюда...
          Если впервые в Москве, сходите сюда...
          Если впервые в Москве, сходите сюда...
        </div>
        <div class="article-card__body__data">
          <div>
            <eye/> 46
          </div>
          <div v-if="type === 'new'">
            <eye-clock/> Читать 5 минут
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  components: {
    'Eye': () => import('~/components/Icons/Eye'),
    'EyeClock': () => import('~/components/Icons/EyeClock')
  },
  props: {
    type: {
      type: String,
      validator: function (value) {
        return ['actual', 'new', ''].indexOf(value) !== -1
      },
      default: ''
    },
    // article: {
    //   type: Object,
    //   required: true
    // }
  }
}
</script>

<style>

</style>
