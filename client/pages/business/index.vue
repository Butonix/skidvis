<template>
  <div>
    <div class="container">
      <div class="text-center">
        <div class="my-5">
          <h1 class="bg-primary text-white d-inline">
            Праздник — отличный двигатель продаж
          </h1>
        </div>
        <div class="mb-3 br--lg">
          Скидвис предлагает акции на праздичные мероприятия. Здесь люди узнают, где
          <br>
          отпраздновать, получая удовольствие от экономии.
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
          <a href="/" class="link-solid-on-span d-inline-block">
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

        <plus-item v-for="(item, key) in items" :key="key">
          <div class="mb-3">
            <img :src="item.img" :alt="item.text">
          </div>
          <span v-html="(item.html)?item.html:item.text"/>
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
import { getFavicon } from '~/utils'
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
      },
      ...getFavicon('business')
    }
  },
  data: () => ({
    items: [
      {
        img: '/img/business/1.svg',
        text: 'Выслушиваем вашу критику и пожелания. Делаем сервис эффективнее для всех.'
      },
      {
        img: '/img/business/2.svg',
        text: 'Простой интерфейс. Создать одну акцию можно за 5 минут.'
      },
      {
        img: '/img/business/3.svg',
        text: 'Изучаем поведение на сайте и статистику. Так мы делаем сервис удобнее.'
      },
      {
        img: '/img/business/4.svg',
        text: 'Упаковываем акции в приятный дизайн. Сайт отзывчивый.'
      },
      {
        img: '/img/business/5.svg',
        text: 'Два способа купить рекламу на «Скидвисе»: статья в блоге и закрепленная карточка акции.'
      },
      {
        img: '/img/business/6.svg',
        text: 'Всегда на связи',
        html: 'Всегда на связи:<br><a class="link-dashed" href="tel:89006433000">8 900 643-30-00</a><br><a class="link-dashed pt-2 d-inline-block" href="mailto:info@skidvis.ru">info@skidvis.ru</a>'
      }
    ]
  }),
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
