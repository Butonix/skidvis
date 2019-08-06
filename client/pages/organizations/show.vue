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
      :page-count="pageCountProducts"
      :page="products.current_page"
      @setpage="products.current_page = $event"
    />
    <div class="container mt-5">
      <div class="row">
        <div class="col-lg-10 col-xl-8 mb-4">
          <div class="mb-4 d-flex justify-content-between align-items-start">

            <h5>Отзывы и рейтинг</h5>

            <dropdown :options="reviewsOrderingArray"
                      v-model="reviewsOrdering"
                      btn-class="btn btn-sm btn-gray"
                      h-align="right"
                      placeholder="Сортировка"
            />

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
          <transition
            v-for="(review, index) in reviews.data"
            :key="index"
            name="fade" mode="out-in">
            <review
              :review="review"
            />
          </transition>

          <transition
            v-if="pageCountReviews && pageCountReviews > 1 && pageCountReviews > reviews.current_page"
            name="fade" mode="out-in">
            <div class="text-center">
              <div :class="{'btn-loading':loadingReview}"
                   class="btn btn-outline-primary px-5"
                   @click="loadMoreReviews"
              >
                Еще
              </div>
            </div>
          </transition>

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
    'Dropdown': () => import('~/components/Dropdown'),
    'SocialLinks': () => import('~/components/Edit/SocialLinks')
  },
  head () {
    return {
      title: 'Организация',
      bodyAttrs: {
        class: 'theme-default navbar-fixed'
      }
    }
  },
  asyncData: async ({ params, error, app }) => {
    let organizationId = params.organizationId
    let res = {
      organizationId,
      review: {
        form: {
          text: '',
          rating: 0
        }
      },
      organization: null
    }

    if (organizationId) {
      try {
        let { data } = await axios.get('organizations/' + organizationId)
        res = {
          ...res,
          ...data
        }
      } catch (e) {
        error({ statusCode: 404, message: 'Organization not found' })
      }
    }
    if (res.organization.rating_user) {
      res.review.form.rating = res.organization.rating_user
    }
    return res
  },
  data: () => ({
    reviewsOrderingArray: [
      {
        id: 1,
        ordering: 'created_at',
        orderingDir: 'desc',
        name: 'Новые'
      },
      {
        id: 2,
        ordering: 'created_at',
        orderingDir: 'asc',
        name: 'Старые'
      }
    ],
    reviewsOrdering: {
      id: 1,
      ordering: 'created_at',
      orderingDir: 'desc',
      name: 'Новые'
    },
    loadingReview: false
  }),
  computed: {
    ...mapGetters({
      user: 'auth/user',
      check: 'auth/check'
    }),
    pageCountProducts () {
      return (this.products && this.products.total) ? Math.ceil(this.products.total / this.products.per_page) : 0
    },
    pageCountReviews () {
      return (this.reviews && this.reviews.total) ? Math.ceil(this.reviews.total / this.reviews.per_page) : 0
    }
  },
  watch: {
    'products.current_page': async function (v) {
      await this.fetchProducts({ page: v })
    },
    'reviewsOrdering': async function (v) {
      await this.fetchReviews({})
    }
  },
  beforeMount () {
    if (!(this.review.form instanceof Form)) {
      this.review.form = new Form(this.review.form)
    }
  },
  methods: {
    setDefaultReviewForm () {
      this.review.form = new Form({
        text: '',
        rating: this.review.form.rating
      })
    },
    async loadMoreReviews () {
      this.loadingReview = true
      try {
        let { data } = await axios.get(`organizations/${this.organizationId}/reviews`, {
          params: {
            page: this.reviews.current_page + 1,
            perPage: this.reviews.per_page,
            ordering: this.reviewsOrdering.ordering,
            orderingDir: this.reviewsOrdering.orderingDir
          }
        })

        if (data.list.data.length) {
          for (let i in data.list.data) {
            this.reviews.data.push(data.list.data[i])
          }
        }
        this.reviews.current_page++
      } catch (e) {
        await this.$callToast({
          type: 'error',
          text: 'Получить отзывы не удалось'
        })
        console.log(e)
      }
      this.loadingReview = false
    },
    async fetchProducts ({ page = 1, perPage = this.products.per_page }) {
      try {
        let { data } = await axios.get(`organizations/${this.organizationId}/products`, {
          params: {
            page,
            perPage
          }
        })
        if (data.list) {
          this.$set(this, 'products', data.list)
        }
      } catch (e) {
        await this.$callToast({
          type: 'error',
          text: 'Обновить акции не удалось'
        })
        console.log(e)
      }
    },
    async fetchReviews ({
      page = 1,
      perPage = this.reviews.per_page,
      ordering = this.reviewsOrdering.ordering,
      orderingDir = this.reviewsOrdering.orderingDir
    }) {
      this.loadingReview = true
      try {
        let { data } = await axios.get(`organizations/${this.organizationId}/reviews`, {
          params: {
            page,
            perPage,
            ordering,
            orderingDir
          }
        })

        if (data.list) {
          this.$set(this, 'reviews', data.list)
        }
      } catch (e) {
        await this.$callToast({
          type: 'error',
          text: 'Обновить отзывы не удалось'
        })
        console.log(e)
      }
      this.loadingReview = false
    },
    async sendReview () {
      try {
        await this.review.form.post(`organizations/${this.organizationId}/reviews`)

        this.setDefaultReviewForm()

        await this.$callToast({
          type: 'success',
          text: 'Отзыв успешно сохранен'
        })

        await this.fetchReviews({})
      } catch (e) {
        await this.$callToast({
          type: 'error',
          text: 'Отправить отзыв не удалось'
        })
        console.log(e)
      }
      try {
        let { data } = await axios.get('organizations/' + this.organizationId)
        this.organization = data.organization
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style>
</style>
