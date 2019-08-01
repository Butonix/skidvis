<template>
  <div class="orgs-show" v-if="organization">
    <full-slider
      v-if="organization.images"
      :images="organization.images"
    />
    <div class="container mt-4">
      <div class="row justify-content-center">
        <div class="col-lg-6 offset-lg-3">
          <div class="orgs-show__logo">
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
                  src=" /placeholders/96x35-1920x700.gif"
                >
              </div>
              <div v-else class="bg-cover w-100 h-100" style="background-image: url('/placeholders/logo.svg');" />
            </router-link>
          </div>
        </div>
        <div class="col-lg-3 text-right">
          <p>Формула кино в соц сетях</p>
          <div class="">
            <social
              v-for="(link, index) in organization.socials"
              :key="index"
              :link="link.link"
              :type="link.type"
              class-box="ml-2"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  components: {
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
      organizationId
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
