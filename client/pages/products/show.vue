<template>
  <div class="container">
    <div class="row">
      <div class="product__content">
        <div class="product__slider">
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
          <div class="d-flex pt-2 mt-1 mb-4">
            <div class="product__logo">
              <img src="/placeholders/logo.svg" alt="Акция" title="Акция">
            </div>
            <h1 class="flex-grow-1 product__name ff-montserrat ml-4">
              Хороший кинотеатр, советую. большой экран, погружаешься в атмосферу фильма с головой) советую!)
            </h1>
          </div>
          <div class="">
            Акции по тегам
            <div class="tag mx-1">
              Кинотеатр
            </div>
            <div class="tag mx-1">
              7D
            </div>
            <div class="tag mx-1">
              Билет
            </div>
          </div>
        </div>
      </div>
      <div class="product__sidebar">

        <list-item-icon>
          <template slot="icon">
            <hourglass/>
          </template>
          <template slot="text">
            Акция действует
            <div class="">
              с 28 мая по 28 августа 2019 Пн–пт, 10:00–17:00 Вс, 10:00–12:00 Кроме адресов
            </div>
          </template>
        </list-item-icon>

        <list-item-icon>
          <template slot="icon">
            <clock/>
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
            <percent/>
          </template>
          <template slot="text">
            <span class="text-line-through text-muted">1000 ₽</span> 900 ₽, экономия 100 ₽
          </template>
        </list-item-icon>

        <list-item-icon class-box="mb-4">
          <template slot="icon">
            <relations/>
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
            <flag class-box="ml-1"/>
          </template>
          <template slot="text">
            В закладки
          </template>
        </list-item-icon>

        <categories>
          <category src-active="/placeholders/demo.jpg" src="/people.png"/>
        </categories>

      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import DynamicLabelInput from '~/components/Edit/Inputs/DynamicLabelInput'
import FullSlider from '~/components/FullSlider'
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
    DynamicLabelInput,
    Hourglass,
    Clock,
    Flag,
    Category,
    Categories,
    Relations,
    ListItemIcon,
    Percent,
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

    return {

    }
  },
  data: () => ({
    action: '',
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
    ]
  })
}
</script>

<style>
  .social-icons__shared{
    position: relative;
    top: -4px;
  }
</style>
