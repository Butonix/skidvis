<template>
  <div v-if="organization" class="orgs-show">
    <full-slider
      v-if="organization.images"
      :images="organization.images"
    />
    <div class="container mt-4 pt-2">
      <div class="row justify-content-center">
        <div class="col-12 col-md"/>
        <div class="orgs-show__logo mb-4 pb-2">
          <router-link
            :to="{ name: 'organizations.show', params: { organizationId: organization.id } }"
            :style="{backgroundColor: (organization.logo && organization.logo.color)?organization.logo.color:'#FFFFFF'}"
            class="orgs-show__logo__box">
            <div v-if="(organization.logo && organization.logo.src)?organization.logo.src:null"
                 class="orgs-show__logo__box__wrapper">
              <img
                v-lazy="(organization.logo && organization.logo.src)?organization.logo.src:''"
                :alt="organization.name"
                :title="organization.name"
                :data-id="organization.id"
                data-type="logo"
                src="/placeholders/96x35-1920x700.gif"
              >
            </div>
            <div v-else class="bg-cover w-100 h-100" style="background-image: url('/placeholders/logo.svg');" />
          </router-link>
        </div>
        <div class="col-12 col-md mb-4">
          <div class="orgs-show__social">
            <p>Компания в соц сетях</p>
            <social
              v-for="(link, index) in organization.socials"
              :key="index"
              :link="link.link"
              :type="link.type"
              class-box="ml-2 mb-2"
            />
          </div>
        </div>
      </div>
      <div class="mb-5">
        <h5 class="text-black text-center mb-5" v-text="organization.name"/>
        <div class="d-flex justify-content-center align-items-center mb-4 pb-2">
          <star-rating
            :rating="organization.rating"
            :edit="false"
          />
          <div class="pl-2" title="Количество отзывов">
            {{ organization.reviews_count }}
          </div>
        </div>
        <div class="text-center br--sm mx-auto" style="max-width: 750px" v-html="(organization.description)?organization.description.replaceAll('\n', '<br>'):''"/>

      </div>
      <div
        v-if="products.data.length"
        class="my-5">
        <div class="font-weight-bolder text-center">
          Из {{ organization.points_count }} точек в {{ organization.points_with_products_count }} действуют акции
        </div>
      </div>
    </div>
    <products
      v-if="products.data.length"
      :items="products.data"
      :page-count="pageProductsCount"
      :page="products.current_page"
      @setpage="products.current_page = $event"
    />
    <div class="container">
      <div class="row">
        <div class="col-lg-10 col-xl-8 mb-4">
          <div class="mb-4">
            <h5>Отзывы и рейтинг</h5>
          </div>
          <review-edit
            v-if="check"
            :form="review.form"
            :user="user"
            field-rating="rating"
            field-content="text"
            @setrating="review.form.rating = $event"
            @inputcomment="review.form.text = $event"
            @send="sendReview"
          />
          <review
            v-for="(review, index) in reviews.data"
            :key="index"
            :review="review"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Form from 'vform'
import axios from 'axios'

export default {
  components: {
    'Products': () => import('~/components/Products'),
    'StarRating': () => import('~/components/StarRating'),
    'FullSlider': () => import('~/components/FullSlider'),
    'Review': () => import('~/components/Review'),
    'ReviewEdit': () => import('~/components/ReviewEdit'),
    'SocialLinks': () => import('~/components/Edit/SocialLinks')
  },
  head () {
    return {
      title: 'Организация',
      bodyAttrs: {
        class: 'theme-default'
      }
    }
  },
  asyncData: async ({ params, error, app }) => {
    let organizationId = params.organizationId
    let res = {
      organizationId,
      organization: null
    }

    if (organizationId) {
      try {
        let { data } = await axios.get('organizations/' + organizationId)
        console.log(data)
        res = {
          ...res,
          ...data
        }
      } catch (e) {
        error({ statusCode: 404, message: 'Organization not found' })
      }
    }

    return res
  },
  data: () => ({
    review: {
      form: new Form({
        text: '',
        rating: 0
      })
    }
  }),
  computed: {
    ...mapGetters({
      user: 'auth/user',
      check: 'auth/check'
    }),
    pageProductsCount () {
      return (this.products && this.products.total) ? Math.ceil(this.products.total / this.products.per_page) : 0
    }
  },
  methods: {
    async sendReview () {
      try {
        const { data } = await this.review.form.post(`organizations/${this.organizationId}/reviews`)
        console.log(data)
        this.review.form.reset()

        await this.$callToast({
          type: 'success',
          text: 'Отзыв успешно сохранен'
        })
      } catch (e) {
        await this.$callToast({
          type: 'error',
          text: 'Отправить отзыв не удалось'
        })
      }
    }
  }
}
</script>

<style>
</style>
