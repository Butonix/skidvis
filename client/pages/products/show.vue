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
      <div class="product__sidebar"/>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import DynamicLabelInput from '~/components/Edit/Inputs/DynamicLabelInput'
import FullSlider from '~/components/FullSlider'

export default {
  components: {
    DynamicLabelInput,
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
      },
    ]
  }),
}
</script>

<style>
</style>
