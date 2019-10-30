<template>
  <div>
    <breadcrumbs/>
    <form v-if="form && organizationId" class="orgs-edit"
          @submit.prevent @keydown="form.onKeydown($event)">
      <div class="container mt-4 pt-2">
        <div class="mb-5">
          <h5 class="text-black text-center mb-5" v-text="organization.name"/>
        </div>
      </div>
      <div class="container">
        <h1 class="text-center mb-4">
          Платные услуги
        </h1>
        <div class="row">
          <div class="col-12">
            <v-checkbox :value="(form.type_map_point === 2)" @input="form.type_map_point = ($event)?2:1">
              Разрешить использование собственного логотипа на карте
            </v-checkbox>
            <v-checkbox v-model="form.is_caption">
              Разрешить делать подпись к скидке (Ограничение в 30 символов)
            </v-checkbox>
            <v-checkbox v-model="form.is_all_similar_disabled">
              Отключение блока «Все похожие» на странцах акций организации
            </v-checkbox>
            <v-checkbox v-model="form.is_advertisement">
              Разрешить выводить акции в блок «Реклама»
            </v-checkbox>
          </div>
        </div>
        <div class="text-center mt-5">
          <div
            class="btn btn-outline-primary mx-1 mb-2"
            @click="onSave"
          >
            Сохранить
          </div>
        </div>
      </div>
    </form>

    <div class="container pt-5">
      <div class="d-flex flex-wrap align-items-center justify-content-center h-100">
        <router-link
          :to="{ name: 'management.organizations.show', params: { organizationId } }"
          class="btn btn-gray btn-sm px-4 mr-2 mb-3">
          <span class="px-2">Редактирование организации</span>
        </router-link>
        <router-link
          :to="{ name: 'management.organizations.points.index', params: { organizationId } }"
          class="btn btn-gray btn-sm px-4 mr-2 mb-3">
          <span class="px-2">Адреса</span>
        </router-link>
        <router-link
          :to="{ name: 'management.organizations.products.index', params: { organizationId } }"
          class="btn btn-gray btn-sm px-4 mb-3">
          <span class="px-2">Акции</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { getFavicon } from '~/utils'
import { mapGetters } from 'vuex'
import Form from 'vform'
import axios from 'axios'

export default {
  components: {
    'OrgDemoMapPoint': () => import('~/components/Icons/OrgDemoMapPoint'),
    'FullSlider': () => import('~/components/FullSlider'),
    'VCheckbox': () => import('~/components/Edit/Checkboxes/v-checkbox')
  },
  head () {
    return {
      title: 'Платные услуги организации',
      bodyAttrs: {
        class: 'theme-business theme-management'
      },
      ...getFavicon('business')
    }
  },
  middleware: ['auth'],
  asyncData: async ({ params, error, app }) => {
    let form = {}
    let organization = {}
    let organizationId = params.organizationId

    if (organizationId) {
      try {
        let { data } = await axios.get('management/organizations/' + organizationId + '/edit')
        organization = data.organization
        form.type_map_point = data.organization.type_map_point
        form.is_caption = data.organization.is_caption || false
        form.is_all_similar_disabled = data.organization.is_all_similar_disabled || false
        form.is_advertisement = data.organization.is_advertisement || false
      } catch (e) {
        error({ statusCode: e.response.status || 500 })
      }
    }

    return {
      organization,
      organizationId,
      form
    }
  },
  data: () => ({
    caption: true
  }),
  computed: {
    ...mapGetters({
      isSuperAdministrator: 'auth/isSuperAdministrator'
    })
  },
  async beforeMount () {
    if (!(this.form instanceof Form)) {
      this.form = new Form(this.form)
    }
  },
  methods: {
    async onSave () {
      try {
        await this.form.patch('management/organizations/' + this.organizationId + '/services')
        await this.$callToast({
          type: 'success',
          text: 'Данные успешно сохранены'
        })
      } catch (e) {
        await this.$callToast({
          type: 'error',
          text: 'Сохранить не удалось'
        })
      }
    }
  }
}
</script>
