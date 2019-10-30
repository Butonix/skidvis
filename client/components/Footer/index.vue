<template>
  <footer class="footer">
    <div class="d-flex justify-content-center">
      <div :class="{'active': black}" class="footer__toggle" @click="setBlack(black?0:1)">
        <div class="footer__toggle__label" v-html="black?'Ночная тема':'Дневная тема'">
          Ночная тема
        </div>
      </div>
    </div>
    <div class="footer__content">
      <div class="footer__content__box">
        <ul class="footer__nav list-unstyled">
          <nav-item :to="{ name: 'products.index' }" class-link="nav-link--default"
                    @click.native="$sTB()">
            Все акции
          </nav-item>
          <nav-item :to="{ name: 'organizations.index' }" class-link="nav-link--default"
                    @click.native="$sTB()">
            Все компании
          </nav-item>
          <nav-item :to="{ name: 'business' }" class-link="nav-link--business"
                    @click.native="$sTB()">
            Бизнесу
          </nav-item>
          <nav-item :to="{ name: 'blog.index' }" :class-link="'nav-link--blog' + ((blog.status)?' icon-blog':'')"
                    @click.native="$sTB()">
            Блог
          </nav-item>
          <nav-item :to="{ name: 'contacts' }" class-link="nav-link--default"
                    @click.native="$sTB()">
            Контакты
          </nav-item>
        </ul>
        <div :data-border="border" :data-fill="fill" class="footer__social">
          <div class="mb-3">
            Свежие акции, статьи и новости:
          </div>
          <div class="mb-3 d-flex flex-wrap justify-content-center">
            <social
              type="vk"
              size="lg"
              class="m-1 cursor-pointer"
              @mouseenter="border = 'vk'"
              @mouseleave="border = ''"
              @mousedown="fill = '1'"
              @mouseup="fill = '0'"
            />
            <social
              type="odnoklassniki"
              size="lg"
              class="m-1 cursor-pointer"
              @mouseenter="border = 'ok'"
              @mouseleave="border = ''"
              @mousedown="fill = '1'"
              @mouseup="fill = '0'"
            />
            <social
              type="google"
              size="lg"
              class="m-1 cursor-pointer"
              @mouseenter="border = 'google'"
              @mouseleave="border = ''"
              @mousedown="fill = '1'"
              @mouseup="fill = '0'"
            />
            <social
              type="facebook"
              size="lg"
              class="m-1 cursor-pointer"
              @mouseenter="border = 'facebook'"
              @mouseleave="border = ''"
              @mousedown="fill = '1'"
              @mouseup="fill = '0'"
            />
            <social
              type="instagram"
              size="lg"
              class="m-1 cursor-pointer"
              @mouseenter="border = 'instagram'"
              @mouseleave="border = ''"
              @mousedown="fill = '1'"
              @mouseup="fill = '0'"
            />
          </div>
        </div>
      </div>
      <div class="container">
        <p v-if="$route.name === 'welcome' || $route.name === 'products.index'" class="footer__desc">
          Скидвис предлагает акции на праздичные мероприятия. Здесь люди узнают, где отпраздновать, получая удовольствие от экономии.
        </p>
      </div>
      <div class="text-center">
        <router-link :to="{ name: 'policy' }" class="nav-link"
                     @click.native="$sTB()">
          Политика конфиденциальности
        </router-link>
      </div>
    </div>
    <div class="footer__develop">
      <a href="https://batyukovstudio.com" target="_blank">
        <div class="footer__develop__img"/>
      </a>
    </div>
  </footer>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data: () => ({
    border: '',
    fill: '0'
  }),
  computed: mapGetters({
    blog: 'auth/blog',
    black: 'variables/black'
  }),
  methods: mapActions({
    setBlack: 'variables/setBlack'
  })
}
</script>

<style>

</style>
