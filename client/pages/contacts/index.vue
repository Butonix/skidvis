<template>
  <div class="container contacts mt-5">
    <div class="row">
      <div class="col"/>
      <div class="col-auto mb-4">
        <a href="tel:89006433002" class="h2 text-dark">
          8 900 643-30-02
        </a>
      </div>
      <div class="col mb-4">
        <div class="d-flex align-items-center justify-content-start">
          <div class="mr-2">
            <img src="/img/contacts/cat.jpg" alt="Ответит менеджер, Кот">
          </div>
          <div class="ml-1">
            Ответит менеджер, Кот
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
      <div class="mb-5 pb-5">
        <call-me
          :type-id="1"
        />
      </div>
      <div class="">
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
import { mapGetters } from 'vuex'

export default {
  components: {
    'MaterialInput': () => import('~/components/Edit/Inputs/MaterialInput'),
    'CallMe': () => import('~/components/Contacts/CallMe')
  },
  head () {
    return {
      title: 'Контакты',
      bodyAttrs: {
        class: 'theme-default'
      }
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
