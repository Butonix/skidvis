<template>
  <footer class="footer">
    <div class="footer__content">
      <div class="footer__content__box">
        <ul class="footer__nav list-unstyled">
          <nav-item :to="{ name: 'products.index' }" class-link="nav-link--default"
                    @click.native="onClickLink">
            Все акции
          </nav-item>
          <nav-item :to="{ name: 'organizations.index' }" class-link="nav-link--default"
                    @click.native="onClickLink">
            Все компании
          </nav-item>
          <nav-item :to="{ name: 'business' }" class-link="nav-link--business"
                    @click.native="onClickLink">
            Бизнесу
          </nav-item>
          <nav-item :to="{ name: 'blog.index' }" :class-link="'nav-link--blog' + ((blog.status)?' icon-blog':'')"
                    @click.native="onClickLink">
            Блог
          </nav-item>
          <nav-item :to="{ name: 'contacts' }" class-link="nav-link--default"
                    @click.native="onClickLink">
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
      <div class="text-center">
        <router-link :to="{ name: 'policy' }" class="nav-link"
        @click.native="onClickLink">
          Политика конфиденциальности
        </router-link>
      </div>
    </div>
    <div class="footer__develop">
      <a href="https://batyukovstudio.com" target="_blank">
        <img draggable="false" class="img-fluid" src="/img/footer/logo.svg" alt="Footer logo">
      </a>
    </div>
  </footer>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  data: () => ({
    border: '',
    fill: '0'
  }),
  computed: mapGetters({
    blog: 'auth/blog'
  }),
  methods: {
    onClickLink () {
      this.$scrollTo(document.documentElement.getElementsByTagName('body')[0])
    }
  }
}
</script>

<style>

</style>
