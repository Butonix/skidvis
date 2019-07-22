<template>
  <div class="container">
    <div class="row">
      <div class="product__content">

        <div class="order-2 order-lg-1 product__slider mb-3">
          <full-slider
            :images="images"
          >
            <dynamic-label-input
              v-model="action"
              class-wrapper="product__slider__label"
              class-box="product__slider__label__input"
              class-input="ff-mplus-1p"
            />
          </full-slider>
        </div>

        <div class="order-1 order-lg-2 d-xs-flex pt-2 mt-1 mb-4">
          <div class="product__logo mr-4 mb-3">
            <img src="/placeholders/logo.svg" alt="Акция" title="Акция">
          </div>
          <h1 class="flex-grow-1 product__name ff-montserrat">
            Хороший кинотеатр, советую. большой экран, погружаешься в атмосферу фильма с головой) советую!)
          </h1>
        </div>

        <div class="order-3 order-lg-3 mb-4">
          Акции по тегам
          <div class="tag mx-1 mb-2">
            Кинотеатр
          </div>
          <div class="tag mx-1 mb-2">
            7D
          </div>
          <div class="tag mx-1 mb-2">
            Билет
          </div>
        </div>

        <sidebar
          box-class="order-4 order-lg-4 mb-4 mt-2"
          box-mod="center"
        />

        <div class="order-5 order-lg-5 tab-panel mt-3">
          <div
            :class="{'active':(tab === 'circs')}"
            class="tab"
            @click="tab ='circs'">
            Условия
          </div>
          <div
            :class="{'active':(tab === 'desc')}"
            class="tab"
            @click="tab ='desc'">
            Описание
          </div>
          <div class="tab">
            Адрес
          </div>
          <div class="tab d-none d-sm-block">
            Отзывы
          </div>
        </div>

        <div class="order-6 order-lg-6 tab-content mb-5">
          <transition name="fade" mode="out-in">
            <div v-if="tab === 'circs'" :key="'circs'">
              Скачайте приложение Biglion для iOs или Android и предъявите купон с экрана телефона. Вы также можете
              предъявить купон в электронном или распечатанном виде. Один человек может купить неограниченное количество
              купонов для себя или в подарок. Купон действует на следующие виды услуг: 1 сеанс кино: Скидка 50% на любой
              сеанс кино на цилиндрическом широкоформатном экране для одного (150 руб. вместо 300 руб.) Скидка 51% на
              любой сеанс кино на цилиндрическом широкоформатном экране для двоих
            </div>
            <div v-if="tab === 'desc'" :key="'desc'">
              Скачайте приложение Biglion для iOs или Android и предъявите купон с экрана телефона. Вы также можете
              предъявить купон в электронном или распечатанном виде. Один человек может купить неограниченное количество
              купонов для себя или в подарок. Купон действует на следующие виды услуг: 1 сеанс кино: Скидка 50% на любой
              сеанс кино на цилиндрическом широкоформатном экране для одного (150 руб. вместо 300 руб.) Скидка 51% на
              любой сеанс кино на цилиндрическом широкоформатном экране для двоих
            </div>
          </transition>
        </div>

        <div class="order-7 order-lg-7" v-if="addresses">
          <h5>
            Акция по адресам:
          </h5>
          <search-input
            v-model="search"
            type-style="lite"
            placeholder="Введите адрес или метро"
          />
          <addresses-frame :marker-id="1" :addresses="getAddresses"/>
        </div>

      </div>
      <sidebar
        box-mod="right"
      />
    </div>

  </div>
</template>

<script>
// import { sortBy } from 'lodash'
import Fuse from 'fuse.js'
import axios from 'axios'
import DynamicLabelInput from '~/components/Edit/Inputs/DynamicLabelInput'
import FullSlider from '~/components/FullSlider'
import AddressesFrame from '~/components/AddressesFrame'
import Sidebar from '~/components/Product/Sidebar'
import { loremIpsum } from 'lorem-ipsum'

export default {
  components: {
    'SearchInput': () => import('~/components/SearchInput'),
    DynamicLabelInput,
    AddressesFrame,
    Sidebar,
    FullSlider
  },
  head () {
    return {
      title: 'Акция',
      bodyAttrs: {
        class: 'theme-default'
      }
    }
  },
  asyncData: async ({ params, error, app }) => {
    let productId = params.productId

    if (productId) {
      try {
        // let { data } = await axios.get(`management/organizations/172/products/206`)

        // console.log(data)
      } catch (e) {
        console.log(e)
      }
    } else {
      console.log('error 404')
    }
    let addresses = []
    for (let i = 0; i < 20; i++) {
      addresses.push({
        text: loremIpsum()
      })
    }

    return {
      addresses
    }
  },
  data: () => ({
    tab: 'circs',
    search: '',
    action: '',
    categories: [
      {
        id: 123,
        name: '',
        images: {
          default: {
            normal: 'http://lorempixel.com/1920/700',
            active: 'http://lorempixel.com/1920/700'
          },
          business: {
            normal: 'http://lorempixel.com/1920/700',
            active: 'http://lorempixel.com/1920/700'
          }
        }
      },
      {
        id: 321,
        name: '',
        images: {
          default: {
            normal: 'http://lorempixel.com/1920/700',
            active: 'http://lorempixel.com/1920/700'
          },
          business: {
            normal: 'http://lorempixel.com/1920/700',
            active: 'http://lorempixel.com/1920/700'
          }
        }
      }
    ],
    images: [
      {
        src: 'http://lorempixel.com/1920/700'
      },
      {
        src: 'http://lorempixel.com/1920/700'
      },
      {
        src: 'http://lorempixel.com/1920/700'
      },
      {
        src: 'http://lorempixel.com/1920/700'
      },
      {
        src: 'http://lorempixel.com/1920/700'
      },
      {
        src: 'http://lorempixel.com/1920/700'
      },
      {
        src: 'http://lorempixel.com/1920/700'
      }
    ],
    fuseAddresses: null
  }),
  computed: {
    getAddresses () {
      return (this.fuseAddresses && this.search.length > 0) ? this.fuseAddresses.search(this.search) : this.addresses
    }
  },

  async beforeMount () {
    if (!(this.addresses instanceof Fuse)) {
      this.fuseAddresses = new Fuse(this.addresses, {
        shouldSort: true,
        threshold: 0.6,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: [
          'text'
        ]
      })
    }
  }
}
</script>

<style>
</style>
