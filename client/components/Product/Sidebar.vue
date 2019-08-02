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
        <template v-if="timeHuman">
          Акция действует
          <div v-html="timeHuman"/>
          <div class="mb-2">
            <span class="text-primary link-dashed">
              Кроме адресов
            </span>
          </div>
        </template>
      </template>
    </list-item-icon>

    <list-item-icon v-if="operationModeText">
      <template slot="icon">
        <clock />
      </template>
      <template slot="text">
        Режим работы
        <div v-html="operationModeText"/>
      </template>
    </list-item-icon>

    <list-item-icon v-if="!!value && Number(currencyId) === 1">
      <template slot="icon">
        <percent />
      </template>
      <template slot="text">
        <span class="text-line-through text-muted">{{ getFullPrice }}&nbsp;₽</span> <span v-html="getPrice"/>
      </template>
    </list-item-icon>

    <list-item-icon v-if="socials.length" class-box="mb-4">
      <template slot="icon">
        <relations />
      </template>
      <template slot="text">
        <div class="social-icons__shared d-flex flex-wrap justify-content-start align-items-center mb-2">
          <social
            v-for="(social, key) in socials"
            :key="'socials-'+key"
            :type="social.type"
            :link="social.link"
            class-box="mx-1"
          />
        </div>
      </template>
    </list-item-icon>

    <list-item-icon class-box="mb-4">
      <template slot="icon">
        <flag :active="wishlistActive" class-box="ml-1" @click="$emit('wishlistchange')" />
      </template>
      <template slot="text">
        <span class="cursor-pointer no-select" @click="$emit('wishlistchange')" v-text="(wishlistActive)?'В закладках':'В закладки'"/>
      </template>
    </list-item-icon>

    <categories v-if="categories.length">
      <category
        v-for="(category, key) in categories"
        :key="'categories-selected-'+key"
        :label="category.name"
        :src-active="category.images.default.active || '/img/categories/entertainment/entertainment-default-active.svg'"
        :src="category.images.default.normal || '/img/categories/entertainment/entertainment-default-normal.svg'"
      />
    </categories>

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
    wishlistActive: {
      type: Boolean,
      default: false
    },
    value: {
      type: String | Number,
      default: ''
    },
    currencyId: {
      type: String | Number,
      default: 1
    },
    operationModeText: {
      type: String,
      default: ''
    },
    startAt: {
      type: String,
      default: ''
    },
    endAt: {
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
    boxMod: {
      type: String,
      default: ''
    },
    boxClass: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    monthRussian: {
      '01': 'января',
      '02': 'февраля',
      '03': 'марта',
      '04': 'апреля',
      '05': 'мая',
      '06': 'июня',
      '07': 'июля',
      '08': 'августа',
      '09': 'сентября',
      '10': 'октября',
      '11': 'ноября',
      '12': 'декабря'
    }
  }),
  computed: {
    getPrice () {
      let currencyId = Number(this.currencyId)
      let value = Number(this.value)

      if (currencyId === 1) {
        let price_ = 1000 * value / 100
        let price = 1000 - price_
        return price + '&nbsp;₽, экономия&nbsp;' + price_ + '&nbsp;₽'
      } else {
        if (value && !isNaN(value)) {
          return (this.getFullPrice - value) + '&nbsp;₽, экономия&nbsp;' + value + '&nbsp;₽'
        } else {
          return '0&nbsp;₽, экономия&nbsp;0&nbsp;₽'
        }
      }
    },
    getFullPrice () {
      let currencyId = Number(this.currencyId)
      let value = Number(this.value)

      if (currencyId === 1) {
        return 1000
      } else {
        if (value && !isNaN(value)) {
          return Math.ceil(value / 1000) * 1000
        } else {
          return 1000
        }
      }
    },
    timeHuman () {
      return this.getTimeHuman(this.startAt, this.endAt, this.monthRussian)
    },
    getDate () {
      let res = (this.startAt) ? this.startAt : ''

      if (res && this.endAt && this.startAt !== this.endAt) {
        res += ' — ' + this.endAt
      }

      return res
    }
  },
  methods: {
    getTimeHuman (startAt, endAt, monthRussian) {
      if (!startAt) {
        return ''
      }
      let mR = monthRussian
      if (startAt === endAt || !endAt) {
        let arr = startAt.split('-')
        return `только ${arr[2]} ${mR[arr[1]]} ${arr[0]}`
      } else {
        let sArr = startAt.split('-')
        let eArr = endAt.split('-')
        let start = `с ${sArr[2]} `
        if (sArr[1] !== eArr[1]) {
          start += `${mR[sArr[1]]} `
        }
        if (sArr[0] !== eArr[0]) {
          start += sArr[0] + '<br>'
        }
        let end = `по ${eArr[2]} ${mR[eArr[1]]} ${eArr[0]}`
        return start + end
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
