<template>
  <div class="container contacts mt-4 mt-md-5">
    <div class="row">
      <div class="col-12 col-md"/>
      <div class="col-12 col-md-auto mb-4 text-center">
        <a href="tel:89006433002" class="h2 text-dark">
          8 900 643-30-02
        </a>
      </div>
      <div class="col-12 col-md mb-4 d-flex justify-content-center justify-content-md-start">
        <div class="d-flex align-items-center justify-content-start">
          <div class="mr-2">
            <img class="rounded-circle" src="/img/contacts/avatar.jpg" alt="Ответит менеджер, Алиса">
          </div>
          <div class="ml-1">
            Ответит менеджер, Алиса
          </div>
        </div>
      </div>
    </div>
    <div class="text-center mb-5">
      <a href="mailto:info@skidvis.ru" class="h2 text-dark">
        info@skidvis.ru
      </a>
    </div>

    <div class="text-center">
      <div class="pb-2">
        Ответим с 9 до 23 по мск
      </div>
      <div class="mb-3 mb-md-5 pb-5">
        <call-me
          :type-id="1"
          :is-active="true"
        />
      </div>
      <div class="pt-5">
        <img src="/img/contacts/lupe.svg" alt="Вакансия модератора">
      </div>
      <div class="mb-2">
        Вакансия
        <br>
        модератора
      </div>
      <div class="contacts__text mb-4">
        Нужно править текст на сайте,
        <br>
        пополнять арсенал тегов для поиска.
        <br>
        Работа с 10:00 до 18:00. Можно на дому.
        <br>
        Оплата 25 000 ₽ с развитием.
      </div>
      <div class="theme-blog">
        <call-me
          :type-id="2"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { getFavicon } from '~/utils'
import { mapGetters } from 'vuex'
import blog from '~/mixins/blog'

export default {
  components: {
    'MaterialInput': () => import('~/components/Edit/Inputs/MaterialInput'),
    'CallMe': () => import('~/components/Contacts/CallMe')
  },
  mixins: [blog],
  middleware: ['reactData'],
  head () {
    return {
      title: 'Контакты',
      bodyAttrs: {
        class: 'theme-default' + (' ' + this.$store.getters['variables/getBlackClass'])
      },
      ...getFavicon()
    }
  },
  computed: {
    ...mapGetters({
      check: 'auth/check'
    })
  },
  methods: {
    showModalLogin () {
      this.$modal.push('login')
    }
  }
}
</script>

<style>
</style>
