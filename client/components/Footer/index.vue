<template>
  <footer class="footer">
    <div class="footer__content">
      <div class="footer__content__box">
        <ul class="footer__nav list-unstyled">
          <nav-item :to="{ name: 'products.index' }" class-link="nav-link--default">
            Все акции
          </nav-item>
          <nav-item :to="{ name: 'organizations.index' }" class-link="nav-link--default">
            Все компании
          </nav-item>
          <nav-item :to="{ name: 'business' }" class-link="nav-link--business">
            Бизнесу
          </nav-item>
          <nav-item :to="{ name: 'blog.index' }" class-link="nav-link--blog icon-blog">
            Блог
          </nav-item>
          <nav-item :to="{ name: 'contacts' }" class-link="nav-link--default">
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
        <a href="/" class="nav-link">
          Политика конфиденциальности
        </a>
      </div>
    </div>
    <div class="footer__develop">
      <a href="https://batyukovstudio.com">
        <img draggable="false" class="img-fluid" src="/img/footer/logo.svg" alt="Footer logo">
      </a>
    </div>
  </footer>
</template>

<script>

export default {
  data: () => ({
    border: '',
    fill: '0'
  })
}
</script>

<style>

</style>
