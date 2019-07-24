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
          с 28 мая по 28 августа 2019
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

    <list-item-icon v-if="!!value">
      <template slot="icon">
        <percent />
      </template>
      <template slot="text">
        <span class="text-line-through text-muted">{{ getFullPrice }}</span> {{ getPrice }}
      </template>
    </list-item-icon>

    <list-item-icon class-box="mb-4">
      <template slot="icon">
        <relations />
      </template>
      <template slot="text">
        <div v-if="socials.length" class="social-icons__shared d-flex flex-wrap justify-content-start align-items-center mb-2">
          <social
            v-for="(social, key) in socials"
            :key="'socials-'+key"
            class-box="mx-1"
            :type="social.type"
            :link="social.link"
          />
        </div>
        <div class="btn btn-outline-gray btn-sm btn-block mb-2"
             @click="$emit('onEditSocial')" v-text="(socials.length)?'+ изменить соц. сети':'+ указать соц. сети'"/>
      </template>
    </list-item-icon>

    <categories v-if="categories.length">
      <category
        v-for="(category, key) in categories"
        :key="'categories-selected-'+key"
        :label="category.name"
        :src-active="category.images.business.active || '/img/categories/entertainment/entertainment-default-active.svg'"
        :src="category.images.business.normal || '/img/categories/entertainment/entertainment-default-normal.svg'"
      />
    </categories>

    <div class="text-center">
      <div class="btn btn-outline-primary btn-sm px-4"
           @click="$emit('onEditSelect', 'categories')" v-text="(categories.length)?'Изменить категории':'Выбрать категории'"/>
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
    value: {
      type: String | Number,
      default: ''
    },
    currencyId: {
      type: String | Number,
      default: 1
    },
    boxMod: {
      type: String,
      default: ''
    },
    categories: {
      type: Array,
      default: () => ([])
    },
    socials: {
      type: Array,
      default: () => ([])
    },
    boxClass: {
      type: String,
      default: ''
    }
  },
  computed: {
    getPrice () {
      let currencyId = Number(this.currencyId)
      let value = Number(this.value)

      if (currencyId === 1) {
        let price_ = 1000 * value / 100
        let price = 1000 - price_
        return price + ' ₽, экономия ' + price_ + ' ₽'
      } else {
        return '900 ₽, экономия 100 ₽'
      }
    },
    getFullPrice () {
      let currencyId = Number(this.currencyId)

      if (currencyId === 1) {
        return `1000 ₽`
      } else {
        return `1000 ₽`
      }
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
