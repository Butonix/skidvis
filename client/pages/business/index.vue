<template>
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
    <div class="d-flex justify-content-center">
      <div>
        <div class="business__kommersant p-4">
          Больше половины россиян покупают товары только по акции
        </div>
        <a href="/" class="link-solid-on-span">
          <span>
            Коммерсантъ
          </span>
          <br>
          13 июня 2019
        </a>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  head () {
    return {
      title: 'Праздник — отличный двигатель продаж',
      bodyAttrs: {
        class: 'theme-business'
      }
    }
  }
}
</script>

<style lang="scss">
  .business{
    &__kommersant{
      background: url("/img/business/kommersant.svg") center no-repeat;
      -webkit-background-size: contain;
      background-size: contain;
      width: 340px;
      height: 127px;
      font-weight: 700;
    }
  }
</style>
