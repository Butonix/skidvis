<template>
  <div class="orgs-show" v-if="organization">
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
      <div class="">
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
      <div class="font-weight-bolder">
        Из {{ organization.points_count }} точек в {{ organization.points_with_products_count }} действуют акции
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  components: {
    'StarRating': () => import('~/components/StarRating'),
    'FullSlider': () => import('~/components/FullSlider'),
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
}
</script>

<style>
</style>
