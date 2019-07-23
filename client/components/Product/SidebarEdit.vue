<template>
  <div :class="{
    'product__sidebar': true,
    [boxClass]: !!boxClass,
    ['product__sidebar--'+boxMod]: !!boxMod,
  }">

    <list-item-icon>
      <template slot="icon">
        <hourglass />
      </template>
      <template slot="text">
        Акция действует
        <div>
          с 28 мая по 28 августа 2019 <br>
          Пн–пт, 10:00–17:00  <br>
          Вс, 10:00–12:00
        </div>
        <div class="mb-2">
          <span class="text-primary link-dashed">
          Кроме адресов
          </span>
        </div>
        <div class="btn btn-outline-gray btn-sm btn-block mb-2">
          + добавить время
        </div>
        <div class="btn btn-outline-gray btn-sm btn-block mb-2">
          + адреса без акции
        </div>
      </template>
    </list-item-icon>

    <list-item-icon>
      <template slot="icon">
        <clock />
      </template>
      <template slot="text">
        Режим работы
        <div class="">
          10:00-22:00
        </div>
      </template>
    </list-item-icon>

    <list-item-icon>
      <template slot="icon">
        <percent />
      </template>
      <template slot="text">
        <span class="text-line-through text-muted">1000 ₽</span> 900 ₽, экономия 100 ₽
      </template>
    </list-item-icon>

    <list-item-icon class-box="mb-4">
      <template slot="icon">
        <relations />
      </template>
      <template slot="text">
        <div class="social-icons__shared d-flex flex-wrap justify-content-start align-items-center">
          <social
            class-box="mx-1"
            type="vk" />
          <social
            class-box="mx-1"
            type="ok" />
          <social
            class-box="mx-1"
            type="facebook" />
        </div>
      </template>
    </list-item-icon>

    <list-item-icon class-box="mb-4">
      <template slot="icon">
        <flag class-box="ml-1" />
      </template>
      <template slot="text">
        В закладки
      </template>
    </list-item-icon>

    <categories>
      <category src-active="/img/categories/entertainment/entertainment-default-active.svg"
                src="/img/categories/entertainment/entertainment-default-normal.svg" label="Красота" />
    </categories>

    <div class="text-center">
      <div class="btn btn-outline-primary btn-sm px-4"
           @click="$emit('onEditSelect', 'categories')">
        Выбрать категорию
      </div>
    </div>

  </div>
</template>

<script>
import ListItemIcon from '~/components/ListItemIcon'
import Hourglass from '~/components/Icons/Hourglass'
import Percent from '~/components/Icons/Percent'
import Clock from '~/components/Icons/Clock'
import Relations from '~/components/Icons/Relations'
import Flag from '~/components/Flag'
import Category from '~/components/Category'
import Categories from '~/components/Categories'

export default {
  components: {
    Hourglass,
    Clock,
    Flag,
    Category,
    Categories,
    Relations,
    ListItemIcon,
    Percent
  },
  props: {
    boxMod: {
      type: String,
      default: ''
    },
    boxClass: {
      type: String,
      default: ''
    }
  }
}
</script>

<style>
  .social-icons__shared {
    position: relative;
    top: -4px;
  }
</style>
