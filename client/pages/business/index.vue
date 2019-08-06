<template>
  <div>
    <div class="container">
      <div class="text-center">
        <h1 class="bg-primary text-white d-inline mb-5">
          Праздник — отличный двигатель продаж
        </h1>
        <div class="mb-3">
          Скидвис предлагает акции на праздичные мероприятия. Здесь люди узнают, где отпраздновать, получая удовольствие от
          экономии.
        </div>
        <div class="text-primary mb-5">
          Предлагаем стать нашим партнером. На открытии сервиса это бесплатно!
        </div>
      </div>
      <div class="d-flex justify-content-center mb-4">
        <div>
          <div class="business__kommersant p-4">
            Больше половины россиян покупают товары только по акции
          </div>
          <a href="/" class="link-solid-on-span">
            <span>
              Коммерсантъ
            </span>
            <br>
            <small>
              13 июня 2019
            </small>
          </a>
        </div>
      </div>
    </div>
    <div class="business__container--long-offset container mb-5">
      <div class="row justify-content-center">

        <div class="col-12">
          <h5 class="text-center mb-3">
            Наши плюсы
          </h5>
          <p class="text-center mb-5">
            Работаем над вашим продвижением совместно
          </p>
        </div>

        <plus-item>
          Выслушиваем вашу критику и пожелания. Делаем сервис эффективнее для всех.
        </plus-item>

        <plus-item>
          Выслушиваем вашу критику и пожелания. Делаем сервис эффективнее для всех.
        </plus-item>

        <plus-item>
          Выслушиваем вашу критику и пожелания. Делаем сервис эффективнее для всех.
        </plus-item>

        <plus-item>
          Выслушиваем вашу критику и пожелания. Делаем сервис эффективнее для всех.
        </plus-item>

        <plus-item>
          Выслушиваем вашу критику и пожелания. Делаем сервис эффективнее для всех.
        </plus-item>

        <plus-item>
          Выслушиваем вашу критику и пожелания. Делаем сервис эффективнее для всех.
        </plus-item>

        <plus-item>
          Выслушиваем вашу критику и пожелания. Делаем сервис эффективнее для всех.
        </plus-item>

      </div>

    </div>
    <div class="container">
      <h5 class="mt-5 mb-5 text-center">
        Просто...
      </h5>
      <div class="d-flex flex-column align-items-center">
        <card-step>
          <template slot="number">1</template>
          <h5 class="mb-3">
            Зарегистрируйтесь у нас
          </h5>
          Мы попросим прислать два документа, подтверждающие вас, как владельца бизнеса: ИНН и паспорт.
          <div v-if="!check" class="business__btn-bottom text-center">
            <div class="btn btn-outline-primary px-5"
                 @click="showModalLogin">
              <span class="px-4">Войти</span>
            </div>
          </div>
        </card-step>
        <card-step>
          <template slot="number">2</template>
          <h5 class="mb-3">
            Создайте страницу организации
          </h5>
          Загрузите логотип, обратитесь к клиенту с тремя воодушевляющими строками о своей компании, покажите притягательные фотографии того, что ждет клиента.
        </card-step>
        <card-step>
          <template slot="number">3</template>
          <h5 class="mb-3">
            Создайте страницы акций
          </h5>
          Загрузите фото, связанные с акционным предложением. Напишите условия и дайте адреса организаций.
        </card-step>
        <div class="mb-5 pb-3 card-step__number text-primary text-center w-100">
          4 Зарабатывайте клиентов
        </div>
        <div class="w-100 text-center">
          <img class="img-fluid" src="/img/business/client.svg" alt="Зарабатывайте клиентов">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  components: {
    'CardStep': () => import('~/components/CardStep'),
    'PlusItem': () => import('~/components/PlusItem')
  },
  head () {
    return {
      title: 'Праздник — отличный двигатель продаж',
      bodyAttrs: {
        class: 'theme-business'
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
