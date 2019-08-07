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
        <div class="contacts__form">
          <div class="btn btn-outline-primary mb-2">
            Перезвоните мне
          </div>
          <div class="contacts__form__wrapper">
            <div class="contacts__form__box text-left">
              <material-input
                v-model="formDefault.name"
                :form="formDefault"
                field="name"
                type-input="inline"
                placeholder="Имя"
                form-class="mb-4"
              />
              <material-input
                v-model="formDefault.phone"
                :form="formDefault"
                field="phone"
                type-input="inline"
                placeholder="Телефон"
                form-class="mb-0"
              />
            </div>
          </div>
        </div>
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
        <div class="contacts__form">
          <div class="btn btn-outline-primary">
            Перезвоните мне
          </div>
          <div class="contacts__form__wrapper">
            <div class="contacts__form__box text-left">
              <material-input
                v-model="formDefault.name"
                :form="formDefault"
                field="name"
                type-input="inline"
                placeholder="Имя"
                form-class="mb-4"
              />
              <material-input
                v-model="formDefault.phone"
                :form="formDefault"
                field="phone"
                type-input="inline"
                placeholder="Телефон"
                form-class="mb-0"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Form from 'vform'

export default {
  components: {
    'MaterialInput': () => import('~/components/Edit/Inputs/MaterialInput')
  },
  head () {
    return {
      title: 'Праздник — отличный двигатель продаж',
      bodyAttrs: {
        class: 'theme-default'
      }
    }
  },
  data: () => ({
    formDefault: {
      name: '',
      phone: ''
    }
  }),
  computed: {
    ...mapGetters({
      check: 'auth/check'
    })
  },
  beforeMount () {
    if (!(this.formDefault instanceof Form)) {
      this.formDefault = new Form(this.formDefault)
    }
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
