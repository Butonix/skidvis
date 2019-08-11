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
        </template>
        <div class="btn btn-outline-gray btn-sm btn-block btn-time-picker mb-2">
          <span v-text="timeHuman?'+ изменить время':'+ добавить время'"/>
          <div class="btn-time-picker__picker">
            <flat-pickr
              :value="getDate"
              :config="config"
              @input="onInputDate"
            />
          </div>
        </div>
        <no-ssr>
          <div v-if="form && form.errors" :class="{ 'is-invalid': form.errors.has('start_at') }">
            <has-error :form="form" field="start_at"/>
          </div>
        </no-ssr>
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
        <span class="text-line-through text-muted">{{ getFullPrice }} ₽</span> {{ getPrice }}
      </template>
    </list-item-icon>

    <list-item-icon class-box="mb-4">
      <template slot="icon">
        <relations />
      </template>
      <template slot="text">
        <div v-if="socials.length" class="d-flex flex-wrap justify-content-start align-items-center mb-2">
          <social
            v-for="(social, key) in socials"
            :key="'socials-'+key"
            :type="social.type"
            :link="social.link"
            class="mx-1"
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
import flatPickr from 'vue-flatpickr-component'
import { Russian } from 'flatpickr/dist/l10n/ru'

export default {
  components: {
    flatPickr,
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
    operationModeText: {
      type: String,
      default: ''
    },
    boxMod: {
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
    boxClass: {
      type: String,
      default: ''
    },
    form: {
      type: Object,
      default: () => ({})
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
    },
    date: null,
    config: {
      mode: 'range',
      locale: Russian
    }
  }),
  computed: {
    getPrice () {
      let currencyId = Number(this.currencyId)
      let value = Number(this.value)

      if (currencyId === 1) {
        let price_ = 1000 * value / 100
        let price = 1000 - price_
        return price + ' ₽, экономия ' + price_ + ' ₽'
      } else {
        if (value && !isNaN(value)) {
          return (this.getFullPrice - value) + ' ₽, экономия ' + value + ' ₽'
        } else {
          return '0 ₽, экономия 0 ₽'
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
    },
    onInputDate (value) {
      this.$emit('onInputDate', value)
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
