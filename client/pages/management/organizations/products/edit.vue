<template>
  <div>
    <breadcrumbs/>
    <div class="container products-edit">
      <div class="row mb-3">
        <div class="col">
          <h5 class="text-primary">
            Панель редактирования
          </h5>
        </div>
        <div class="col-auto">
          <template v-if="productId">
            <div v-if="form.is_published" class="btn btn-outline-danger btn-sm mb-2"
                 @click="onUnpublish"
            >
              Снять с публикации
            </div>
            <div v-else class="btn btn-outline-success btn-sm mb-2"
                 @click="onPublish"
            >
              Опубликовать
            </div>
          </template>
          <div v-if="productId" class="btn btn-success btn-sm mb-2"
               @click="onSave"
          >Сохранить</div>
          <div v-else class="btn btn-success px-5 mb-2"
               @click="onSave"
          >Создать</div>
          <div
            v-if="productId"
            class="btn btn-danger btn-sm mb-2"
            @click="onDelete"
          >
            Удалить
          </div>
        </div>
      </div>
      <div class="row">
        <div class="product__content">

          <div class="order-2 order-lg-1 product__slider mb-3">
            <full-slider
              :is-edit="true"
              :images="images"
            >
              <div class="products-edit__label">
                <dynamic-label-input
                  v-if="form.currency_id !== 3"
                  v-model="form.value"
                  :type="form.currency_id === 1? 'percent' : 'number'"
                  class-input="ff-open-sans"
                />
                <div :class="{'active': form.currency_id === 1}"
                     class="products-edit__currency-svg"
                     @click="form.currency_id = 1">
                  <percent-btn/>
                  <br>
                  Скидка&nbsp;в&nbsp;%
                </div>
                <div :class="{'active': form.currency_id === 2}"
                     class="products-edit__currency-svg"
                     @click="form.currency_id = 2">
                  <rub-btn/>
                  <br>
                  Скидка&nbsp;в&nbsp;₽
                </div>
                <div :class="{'active': form.currency_id === 3}"
                     class="products-edit__currency-svg"
                     @click="form.currency_id = 3">
                  <present-btn/>
                  <br>
                  Подарок
                </div>
                <div :class="{'active': form.currency_id === 4}"
                     class="products-edit__currency-svg"
                     @click="form.currency_id = 4">
                  <bonus-btn/>
                  <br>
                  Бонусы
                </div>
                <div :class="{'active': form.currency_id === 5}"
                     class="products-edit__currency-svg"
                     @click="form.currency_id = 5">
                  <cashback-btn/>
                  <br>
                  Кешбек
                </div>
              </div>
              <div v-if="organization.is_caption" class="products-edit__caption">
                <div class="d-flex small justify-content-between">
                  <div>
                    Подпись к скидке
                  </div>
                  <div>{{ form.caption?form.caption.length:0 }}/30</div>
                </div>
                <div>
                  <input v-model="form.caption" type="text">
                </div>
                <client-only>
                  <div v-if="form && form.errors" :class="{ 'is-invalid': form.errors.has('caption') }">
                    <has-error :form="form" field="caption"/>
                  </div>
                </client-only>
              </div>
            </full-slider>
            <thumbs-file-input
              v-if="images"
              :images="images"
              :images-loading="imagesLoading"
              :width="765"
              :height="313"
              @change="setMainImage"
              @delete="deleteMainImage"
            />
            <client-only>
              <div v-if="form && form.errors" :class="{ 'is-invalid': form.errors.has('images') }">
                <has-error :form="form" field="images"/>
              </div>
            </client-only>
          </div>

          <div class="order-1 order-lg-2 d-xs-flex flex-wrap pt-2 mt-1 mb-2">
            <router-link
              :to="{ name: 'organizations.show', params: { organizationId } }"
              :style="{backgroundColor: (organization.logo.color)?organization.logo.color:'#FFFFFF'}"
              class="product__logo mr-4 mb-3">
              <img
                v-lazy="organization.logo.src || '/placeholders/logo.svg'"
                :alt="organization.name"
                :title="organization.name"
                src="/placeholders/96x35-1920x700.gif"
              >
            </router-link>
            <div class="h1 flex-grow-1 product__name ff-montserrat">
              <material-textarea
                v-model="form.name"
                :form="form"
                field="name"
                placeholder="Название"
                data-align="left"
                form-class="mb-0 mt-xl-0"
                size="sm"
                rows="3"
              />
            </div>
          </div>
          <div class="order-3 order-lg-3 mb-4">
            <material-textarea
              v-model="form.short_description"
              :form="form"
              field="short_description"
              placeholder="Короткое описание"
              data-align="left"
              class="mb-3"
              size="sm"
              rows="3"
            >
              <div class="text-muted small">Используется для продвижения, до 100 символов, остальные символы будут обрезаны</div>
            </material-textarea>
            <div class="mb-3">
              Акции по тегам
              <div
                v-for="(tag, key) in form.tags"
                :key="'tags-'+key"
                class="tag mx-1 mb-2"
                v-text="tag.name"
              />
              <div class="btn btn-outline-gray btn-sm px-4 mx-1"
                   @click="onEditSelect('tags')">
                + добавить тег
              </div>
            </div>

            <div class="mb-3">
              Акции по аудитории
              <div
                v-for="(auditory, key) in form.auditories"
                :key="'auditories-'+key"
                class="tag mx-1 mb-2"
                v-text="auditory.name"
              />
              <div class="btn btn-outline-gray btn-sm px-4 mx-1"
                   @click="onEditSelect('auditories')">
                + добавить аудиторию
              </div>
            </div>

            <div class="mb-3">
              Акции по праздникам
              <div
                v-for="(holiday, key) in form.holidays"
                :key="'holidays-'+key"
                class="tag mx-1 mb-2"
                v-text="holiday.name"
              />
              <div class="btn btn-outline-gray btn-sm px-4 mx-1"
                   @click="onEditSelect('holidays')">
                + добавить праздник
              </div>
            </div>
          </div>

          <sidebar
            :form="form"
            :organization="organization"
            :socials="form.socials"
            :value="form.value"
            :currency-id="form.currency_id"
            :categories="form.categories"
            :start-at="form.start_at"
            :end-at="form.end_at"
            :operation-mode-text="getOperationModeText"
            box-class="order-4 order-lg-4 mb-4 mt-2"
            box-mod="center"
            @onInputOriginPrice="form.origin_price = $event"
            @onInputBirthdayBefore="form.birthday_before = $event"
            @onInputBirthdayAfter="form.birthday_after = $event"
            @onEditSelect="onEditSelect($event)"
            @onEditSocial="onEditSocial"
            @onInputDate="onInputDate"
            @onClickCategory="form.main_category_id = $event"
            @setIsAdvertisement="form.is_advertisement = $event"
            @setIsPerpetual="form.is_perpetual = $event"
            @setIsBirthday="form.is_birthday = $event"
            @setTypeBirthday="form.type_birthday = $event"
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
          </div>

          <div class="order-6 order-lg-6 tab-content mb-5">
            <transition name="fade" mode="out-in">
              <div v-if="tab === 'circs'" :key="'circs'" class="products-edit__editor">
                <client-only>
                  <quill-editor v-model="form.conditions"
                                :options="editorOptionCircs"/>
                </client-only>
              </div>
              <div v-if="tab === 'desc'" :key="'desc'" class="products-edit__editor">
                <client-only>
                  <quill-editor v-model="form.description"
                                :options="editorOptionCircs"/>
                </client-only>
              </div>
            </transition>
          </div>

          <div v-if="addresses.length" class="order-7 order-lg-7">
            <h5>
              Акция по адресам:
            </h5>
            <search-input
              v-model="search"
              type-style="lite"
              placeholder="Найти адрес"
            />
            <client-only>
              <div v-if="form && form.errors" :class="{ 'is-invalid': form.errors.has('points') }">
                <has-error :form="form" field="points"/>
              </div>
            </client-only>
            <div class="py-3">
              <div class="btn btn-gray btn-sm mr-2"
                   @click="selectAllAddresses">
                Выделить все
              </div>
              <div class="btn btn-gray btn-sm"
                   @click="clearAllAddresses">
                Снять все
              </div>
            </div>
            <addresses-frame :marker-id="1" :addresses="getAddresses" :selected-addresses="form.points"
                             @change="changeAddresses"
            />
          </div>

        </div>
        <sidebar
          :form="form"
          :organization="organization"
          :socials="form.socials"
          :value="form.value"
          :currency-id="form.currency_id"
          :categories="form.categories"
          :start-at="form.start_at"
          :end-at="form.end_at"
          :operation-mode-text="getOperationModeText"
          box-mod="right"
          @onInputOriginPrice="form.origin_price = $event"
          @onInputBirthdayBefore="form.birthday_before = $event"
          @onInputBirthdayAfter="form.birthday_after = $event"
          @onEditSelect="onEditSelect($event)"
          @onEditSocial="onEditSocial"
          @onInputDate="onInputDate"
          @onClickCategory="form.main_category_id = $event"
          @setIsAdvertisement="form.is_advertisement = $event"
          @setIsPerpetual="form.is_perpetual = $event"
          @setIsBirthday="form.is_birthday = $event"
          @setTypeBirthday="form.type_birthday = $event"
        />
      </div>

      <div v-if="organizationId" class="container pt-5">
        <div class="d-flex align-items-center justify-content-center h-100">
          <router-link
            :to="{ name: 'management.organizations.edit', params: { organizationId } }"
            class="btn btn-gray btn-sm px-4 mr-2"
            @click.native="$sTB()">
            <span class="px-2">Организация</span>
          </router-link>
          <router-link
            :to="{ name: 'management.organizations.points.index', params: { organizationId } }"
            class="btn btn-gray btn-sm px-4"
            @click.native="$sTB()">
            <span class="px-2">Адреса</span>
          </router-link>
        </div>
        <div v-if="isSuperAdministrator" class="d-flex justify-content-around mt-3">
          <router-link
            :to="{ name: 'management.organizations.services', params: { organizationId } }"
            class="btn btn-gray btn-sm px-4 px-lg-3 px-xl-4"
            @click.native="$sTB()">
            <span class="px-2">Платные сервисы</span>
          </router-link>
        </div>
      </div>

      <modal name="save-tags">
        <div class="basic-modal">
          <div class="position-relative">
            <div :class="{'active': loading}" class="preloader"/>
            <div class="">
              Добавлено {{ tagsSelected.length }} из {{ tagsTotal }}
              <div class="">
                <search-input
                  v-model="selectSearch"
                  form-class="mb-4"
                  autofocus="autofocus"
                />
                <div class="tags__select">
                  <div
                    v-for="(tag, key) in getTagsSelected"
                    :key="'tags-selected-'+key"
                    class="tag tag--edit active mx-1 mb-2"
                    @click="removeFromSelect(tag.id, 'tags')"
                    v-text="tag.name"
                  />
                  <div
                    v-for="(tag, key) in getTags"
                    v-if="!tagsSelectedId[tag.id]"
                    :key="'get-tags-'+key"
                    class="tag tag--edit mx-1 mb-2"
                    @click="addToSelect(tag, 'tags')"
                    v-text="tag.name"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="text-center mt-4 mt-xs-5">
            <button v-if="!loading" class="btn btn-outline-primary mr-sm-2 mb-3 mb-sm-0 btn-sm--sm"
                    @click="saveSelect('tags')"
            >
              Сохранить
            </button>
            <button class="btn btn-outline-danger ml-sm-2 mb-3 mb-sm-0 btn-sm--sm"
                    @click="$modal.pop()"
            >
              Отменить
            </button>
          </div>
        </div>
      </modal>

      <modal name="save-holidays">
        <div class="basic-modal">
          <div class="position-relative">
            <div :class="{'active': loading}" class="preloader"/>
            <div class="">
              Добавлено {{ holidaysSelected.length }} из {{ holidaysTotal }}
              <div class="">
                <search-input
                  v-model="selectSearch"
                  form-class="mb-4"
                  autofocus="autofocus"
                />
                <div class="tags__select">
                  <div
                    v-for="(holiday, key) in getHolidaysSelected"
                    :key="'holiday-selected-'+key"
                    class="tag tag--edit active mx-1 mb-2"
                    @click="removeFromSelect(holiday.id, 'holidays')"
                    v-text="holiday.name"
                  />
                  <div
                    v-for="(holiday, key) in getHolidays"
                    v-if="!holidaysSelectedId[holiday.id]"
                    :key="'get-holidays-'+key"
                    class="tag tag--edit mx-1 mb-2"
                    @click="addToSelect(holiday, 'holidays')"
                    v-text="holiday.name"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="text-center mt-4 mt-xs-5">
            <button v-if="!loading" class="btn btn-outline-primary mr-sm-2 mb-3 mb-sm-0 btn-sm--sm"
                    @click="saveSelect('holidays')"
            >
              Сохранить
            </button>
            <button class="btn btn-outline-danger ml-sm-2 mb-3 mb-sm-0 btn-sm--sm"
                    @click="$modal.pop()"
            >
              Отменить
            </button>
          </div>
        </div>
      </modal>

      <modal name="save-auditories">
        <div class="basic-modal">
          <div class="position-relative">
            <div :class="{'active': loading}" class="preloader"/>
            <div class="">
              Добавлено {{ auditoriesSelected.length }} из {{ auditoriesTotal }}
              <div class="">
                <search-input
                  v-model="selectSearch"
                  form-class="mb-4"
                  autofocus="autofocus"
                />
                <div class="tags__select">
                  <div
                    v-for="(auditory, key) in getAuditoriesSelected"
                    :key="'auditory-selected-'+key"
                    class="tag tag--edit active mx-1 mb-2"
                    @click="removeFromSelect(auditory.id, 'auditories')"
                    v-text="auditory.name"
                  />
                  <div
                    v-for="(auditory, key) in getAuditories"
                    v-if="!auditoriesSelectedId[auditory.id]"
                    :key="'get-auditories-'+key"
                    class="tag tag--edit mx-1 mb-2"
                    @click="addToSelect(auditory, 'auditories')"
                    v-text="auditory.name"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="text-center mt-4 mt-xs-5">
            <button v-if="!loading" class="btn btn-outline-primary mr-sm-2 mb-3 mb-sm-0 btn-sm--sm"
                    @click="saveSelect('auditories')"
            >
              Сохранить
            </button>
            <button class="btn btn-outline-danger ml-sm-2 mb-3 mb-sm-0 btn-sm--sm"
                    @click="$modal.pop()"
            >
              Отменить
            </button>
          </div>
        </div>
      </modal>

      <modal name="save-categories">
        <div class="basic-modal">
          <div class="position-relative">
            <div :class="{'active': loading}" class="preloader"/>
            <div class="">
              Добавлено {{ categoriesSelected.length }} из {{ categoriesTotal }}
              <div class="">
                <search-input
                  v-model="selectSearch"
                  form-class="mb-4"
                  autofocus="autofocus"
                />
                <categories>
                  <category
                    v-for="(category, key) in getCategoriesSelected"
                    :active="true"
                    :key="'categories-selected-'+key"
                    :label="category.name"
                    :src-active="category.images.business.active || '/img/categories/entertainment/entertainment-business-active.svg'"
                    :src="category.images.business.normal || '/img/categories/entertainment/entertainment-business-normal.svg'"
                    @click="removeFromSelect(category.id, 'categories')"
                  />
                  <category
                    v-for="(category, key) in getCategories"
                    v-if="!categoriesSelectedId[category.id]"
                    :key="'categories-'+key"
                    :label="category.name"
                    :src-active="category.images.business.active || '/img/categories/entertainment/entertainment-business-active.svg'"
                    :src="category.images.business.normal || '/img/categories/entertainment/entertainment-business-normal.svg'"
                    @click="addToSelect(category, 'categories')"
                  />
                </categories>
              </div>
            </div>
          </div>
          <div class="text-center mt-4 mt-xs-5">
            <button v-if="!loading" class="btn btn-outline-primary mr-sm-2 mb-3 mb-sm-0 btn-sm--sm"
                    @click="saveSelect('categories')"
            >
              Сохранить
            </button>
            <button class="btn btn-outline-danger ml-sm-2 mb-3 mb-sm-0 btn-sm--sm"
                    @click="$modal.pop()"
            >
              Отменить
            </button>
          </div>
        </div>
      </modal>

      <modal name="save-social">
        <div class="basic-modal">
          <social-links
            :links="socials"
            @change="changeSocialsLink"
            @add="addSocialsLink"
            @delete="deleteSocialsLink"
          />
          <div class="text-center mt-4 mt-xs-5">
            <button class="btn btn-outline-primary mr-sm-2 mb-3 mb-sm-0 btn-sm--sm"
                    @click="saveSocial"
            >
              Сохранить
            </button>
            <button class="btn btn-outline-danger ml-sm-2 mb-3 mb-sm-0 btn-sm--sm"
                    @click="$modal.pop()"
            >
              Отменить
            </button>
          </div>
        </div>
      </modal>

    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getFavicon } from '~/utils'
import { sortBy, remove, cloneDeep } from 'lodash'
import Fuse from 'fuse.js'
import axios from 'axios'
import DynamicLabelInput from '~/components/Edit/Inputs/DynamicLabelInput'
import FullSlider from '~/components/FullSlider'
import AddressesFrame from '~/components/AddressesFrame'
import Sidebar from '~/components/Product/SidebarEdit'
import Form from 'vform'

export default {
  components: {
    'PercentBtn': () => import('~/components/Icons/PercentBtn'),
    'PresentBtn': () => import('~/components/Icons/PresentBtn'),
    'CashbackBtn': () => import('~/components/Icons/CashbackBtn'),
    'BonusBtn': () => import('~/components/Icons/BonusBtn'),
    'RubBtn': () => import('~/components/Icons/RubBtn'),
    'MaterialTextarea': () => import('~/components/Edit/Inputs/MaterialTextarea'),
    'ThumbsFileInput': () => import('~/components/Edit/ThumbsFileInput'),
    'SearchInput': () => import('~/components/SearchInput'),
    'SocialLinks': () => import('~/components/Edit/SocialLinks'),
    DynamicLabelInput,
    AddressesFrame,
    Sidebar,
    'Category': () => import('~/components/Category'),
    'Categories': () => import('~/components/Categories'),
    FullSlider
  },
  head () {
    return {
      title: 'Акция',
      bodyAttrs: {
        class: 'theme-business theme-management'
      },
      ...getFavicon('business')
    }
  },
  asyncData: async ({ params, error, app }) => {
    let images = []
    let productId = params.productId
    let organizationId = params.organizationId
    let organization = {}
    let form = {
      origin_price: 0,
      currency_id: 1,
      is_published: false,
      is_advertisement: false,
      is_perpetual: false,
      is_birthday: false,
      birthday_before: '',
      birthday_after: '',
      tags: [],
      auditories: [],
      holidays: [],
      categories: [],
      name: '',
      caption: '',
      main_category_id: null,
      value: '',
      description: '',
      start_at: '',
      end_at: '',
      operationModeText: '',
      socials: [],
      points: [],
      images: []
    }
    if (organizationId) {
      try {
        let { data } = await axios.get(`management/organizations/${organizationId}/edit`)
        organization = data.organization
      } catch (e) {
        error({ statusCode: e.response.status })
      }
    }
    if (productId) {
      try {
        let { data } = await axios.get(`management/organizations/${organizationId}/products/${productId}/edit`)
        form = { ...form, ...data.product }
        images = cloneDeep(data.product.images)
      } catch (e) {
        error({ statusCode: e.response.status })
      }
    }

    return {
      organization,
      organizationId,
      productId,
      form,
      images
    }
  },
  data: () => ({
    editorOptionCircs: {
      placeholder: 'Рекомендуем писать сжато, до 700 знаков. Так клиент легче соглашается на прочтение, и не откладывает вкладку, чтобы прочитать позже (никогда). \n\r\n\rИспользуйте абзацы, так легче читать.',
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'], // toggled buttons
          [{ 'list': 'bullet' }]
        ]
      }
    },
    tab: 'circs',
    search: '',
    action: '',
    loading: true,
    imagesLoading: {},
    // Select
    selectSearch: '',
    selectName: '',
    // Tags
    tagsMax: 10000,
    tagsTotal: 0,
    tags: {},
    tagsSelected: [],
    tagsSelectedId: {},
    // Auditories
    auditoriesMax: 5,
    auditoriesTotal: 0,
    auditories: {},
    auditoriesSelected: [],
    auditoriesSelectedId: {},
    // Holidays
    holidaysMax: 5,
    holidaysTotal: 0,
    holidays: {},
    holidaysSelected: [],
    holidaysSelectedId: {},
    // Categories
    categories: {},
    categoriesMax: 3,
    categoriesTotal: 0,
    categoriesSelected: [],
    categoriesSelectedId: {},
    // Socials
    socials: [],
    // Addresses
    addresses: [],
    fuseAddresses: null
  }),
  computed: {
    ...mapGetters({
      isSuperAdministrator: 'auth/isSuperAdministrator',
      isAdministrator: 'auth/isAdministrator',
      isManagement: 'auth/isManagement'
    }),
    getOperationModeText () {
      return (this.form.operationModeText) ? this.form.operationModeText.replaceAll('00:00-00:00', 'круглосуточно').replaceAll(', ', ', <br>') : ''
    },
    getTagsSelected () {
      return sortBy(this.tagsSelected, 'name')
    },
    getTags () {
      return (this.tags.data) ? this.tags.data : []
    },
    getHolidaysSelected () {
      return sortBy(this.holidaysSelected, 'name')
    },
    getHolidays () {
      return (this.holidays.data) ? this.holidays.data : []
    },
    getAuditoriesSelected () {
      return sortBy(this.auditoriesSelected, 'name')
    },
    getAuditories () {
      return (this.auditories.data) ? this.auditories.data : []
    },
    getCategoriesSelected () {
      return sortBy(this.categoriesSelected, 'name')
    },
    getCategories () {
      return (this.categories.data) ? this.categories.data : []
    },
    getAddresses () {
      return (this.fuseAddresses && this.search.length > 0) ? this.fuseAddresses.search(this.search) : this.addresses
    }
  },
  watch: {
    'form.currency_id': function (v) {
      if (v === 1 && this.form.value && Number(this.form.value) > 100) {
        this.$set(this.form, 'value', 100)
      }
    },
    'form.categories': function (v) {
      if (!v || (v && v.length === 0)) {
        this.$set(this.form, 'main_category_id', null)
      } else {
        if (this.form.main_category_id) {
          let exist = false
          for (let i in v) {
            let cat = v[i]
            if (cat.id === this.form.main_category_id) {
              exist = true
            }
          }
          if (!exist) {
            if (v[0] && v[0].id) {
              this.$set(this.form, 'main_category_id', v[0].id)
            } else {
              this.$set(this.form, 'main_category_id', null)
            }
          }
        } else {
          if (v[0] && v[0].id) {
            this.$set(this.form, 'main_category_id', v[0].id)
          }
        }
      }
    },
    selectSearch () {
      this[this.selectName + 'Fetch']()
    }
  },
  async beforeMount () {
    if (!(this.form instanceof Form)) {
      this.form = new Form(this.form)
    }
  },
  async mounted () {
    try {
      let { data } = await axios.get(`management/organizations/${this.organizationId}/points`, {
        params: {
          responseTypeId: 2
        }
      })
      if (!data.list) {
        throw new Error()
      }
      this.addresses = cloneDeep(data.list)
      if (!(this.addresses instanceof Fuse)) {
        this.fuseAddresses = new Fuse(this.addresses, {
          shouldSort: true,
          threshold: 0.6,
          location: 0,
          distance: 100,
          maxPatternLength: 32,
          minMatchCharLength: 1,
          keys: [
            'name', 'full_street'
          ]
        })
      }
      if (!this.productId && this.addresses.length) {
        this.addresses.forEach(v => {
          this.form.points.push(v.id)
        })
      }
    } catch (e) {
      await this.$callToast({
        type: 'error',
        text: 'Получить адреса не удалось'
      })
    }
  },
  methods: {
    async onEditSocial () {
      this.socials = cloneDeep(this.form.socials)
      this.$modal.push('save-social')
    },
    saveSocial () {
      this.$set(this.form, 'socials', cloneDeep(this.socials))
      this.$modal.pop()
    },
    deleteSocialsLink (index) {
      this.$delete(this.socials, index)
    },
    changeSocialsLink ({ index, value }) {
      this.$set(this.socials, index, value)
    },
    addSocialsLink (link) {
      this.socials.push(link)
    },
    async onEditSelect (name) {
      this.selectName = name
      this.loading = true
      this.selectSearch = ''
      this.$modal.push('save-' + name)
      await this[name + 'Fetch']()
      this[name + 'Total'] = this[name].total
      let obj = {}
      this[name + 'Selected'] = cloneDeep(this.form[name])
      this[name + 'Selected'].forEach((v) => {
        obj[v.id] = true
      })
      this[name + 'SelectedId'] = obj
      this.loading = false
    },
    saveSelect (name) {
      this.$set(this.form, name, this[name + 'Selected'])
      this.$modal.pop()
    },
    removeFromSelect (id, name) {
      if (this[name + 'SelectedId']) {
        this.$set(this, name + 'Selected', remove(this[name + 'Selected'], (tag) => {
          return tag.id !== id
        }))
        this.$delete(this[name + 'SelectedId'], id)
      }
    },
    async setMainImage ({ image, index }) {
      if (index !== undefined && this.images[index]) {
        this.$set(this.images, index, {
          src: image
        })
      } else {
        this.images.push({
          src: image
        })
      }
      this.$set(this.imagesLoading, index, true)
      try {
        let { data } = await axios.post('management/products/image', {
          image: image
        })
        if (!data.image || !data.image.src || !data.image.id) {
          throw new Error()
        }
        image = data.image

        if (index !== undefined && this.form.images[index]) {
          this.$set(this.form.images, index, image)
        } else {
          this.form.images.push(image)
        }
        this.$set(this.imagesLoading, index, false)
      } catch (e) {
        if (index !== undefined && this.images[index]) {
          this.$delete(this.images, index)
        } else {
          this.$delete(this.images, this.images.length - 1)
        }
        this.$set(this.imagesLoading, index, false)
        await this.$callToast({
          type: 'error',
          text: 'Загрузить изображение не удалось'
        })
      }
    },
    deleteMainImage ({ index }) {
      this.$delete(this.images, index)
      this.$delete(this.form.images, index)
    },
    getWarningMaxSelect (name) {
      let res = ''

      switch (name) {
        case 'tags':
          res = `Ограничение сотавляет ${this[name + 'Max']} тегов`
          break
        case 'holidays':
          res = `Ограничение сотавляет ${this[name + 'Max']} праздников`
          break
        case 'auditories':
          res = `Ограничение сотавляет ${this[name + 'Max']} аудиторий`
          break
        case 'categories':
          res = `Ограничение сотавляет ${this[name + 'Max']} категории`
          break
      }
      return res
    },
    async addToSelect (item, name) {
      if (this[name + 'Selected'].length >= this[name + 'Max']) {
        await this.$callToast({
          type: 'warning',
          text: this.getWarningMaxSelect(name)
        })
      } else if (!this[name + 'SelectedId'][item.id]) {
        this[name + 'Selected'].push(item)
        this.$set(this[name + 'SelectedId'], item.id, true)
      }
    },
    async categoriesFetch () {
      try {
        let { data } = await axios.get(`categories`, {
          params: {
            products: 1,
            perPage: 100000000,
            search: this.selectSearch
          }
        })
        this.categories = data.list
      } catch (e) {
        console.log(e)
      }
    },
    async tagsFetch () {
      try {
        let { data } = await axios.get(`tags`, {
          params: {
            perPage: 100000000,
            search: this.selectSearch
          }
        })
        this.tags = data.list
      } catch (e) {
        console.log(e)
      }
    },
    async holidaysFetch () {
      try {
        let { data } = await axios.get(`holidays`, {
          params: {
            perPage: 100000000,
            search: this.selectSearch
          }
        })
        this.holidays = data.list
      } catch (e) {
        console.log(e)
      }
    },
    async auditoriesFetch () {
      try {
        let { data } = await axios.get(`auditories`, {
          params: {
            perPage: 100000000,
            search: this.selectSearch
          }
        })
        this.auditories = data.list
      } catch (e) {
        console.log(e)
      }
    },
    onInputDate (value) {
      try {
        value = value.trim()
        if (value) {
          let date = value.split(' — ')
          if (date[0]) {
            this.$set(this.form, 'start_at', date[0])
            if (date[1]) {
              this.$set(this.form, 'end_at', date[1])
            } else {
              this.$set(this.form, 'end_at', date[0])
            }
          } else {
            throw new Error()
          }
        } else {
          throw new Error()
        }
      } catch (e) {
        this.$set(this.form, 'start_at', null)
        this.$set(this.form, 'end_at', null)
      }
    },
    changeAddresses ({ id, value }) {
      let index = this.form.points.indexOf(id)
      if (value) {
        if (index === -1) {
          this.form.points.push(id)
        }
      } else {
        if (index !== -1) {
          this.$delete(this.form.points, index)
        }
      }
    },
    selectAllAddresses () {
      let points = []
      this.addresses.forEach(v => {
        points.push(v.id)
      })
      this.$set(this.form, 'points', points)
    },
    clearAllAddresses () {
      this.$set(this.form, 'points', [])
    },
    async onDelete () {
      if (!this.productId) {
        return
      }
      let res = await this.$confirmDelete()
      if (res.value) {
        try {
          await axios.delete(`management/organizations/${this.organizationId}/products/${this.productId}`)
          await this.$callToast({
            type: 'success',
            text: 'Акция успешно удалена'
          })
          this.$router.push({ name: 'management.organizations.products.index',
            params: {
              organizationId: this.organizationId
            }
          })
        } catch (e) {
          await this.$callToast({
            type: 'error',
            text: 'Удалить не удалось'
          })
        }
      }
    },
    async onSave () {
      try {
        if (this.productId) {
          await this.form.patch(`management/organizations/${this.organizationId}/products/${this.productId}`)
        } else {
          const { data } = await this.form.post(`management/organizations/${this.organizationId}/products`)
          this.productId = data.product.id
          this.$router.push({ name: 'management.organizations.products.edit',
            params: {
              organizationId: this.organizationId,
              productId: this.productId
            }
          })
        }
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
    },
    async onUnpublish () {
      try {
        await this.form.patch(`/management/products/${this.productId}/unpublish`)
        this.form.is_published = false
        await this.$callToast({
          type: 'success',
          text: 'Акция успешно снята с публикации.'
        })
      } catch (e) {
      }
    },
    async onPublish () {
      this.form.is_published = true
      try {
        await this.form.patch(`management/organizations/${this.organizationId}/products/${this.productId}`)
        await this.$callToast({
          type: 'success',
          text: 'Акция опубликована'
        })
      } catch (e) {
        this.form.is_published = false
        await this.$callToast({
          type: 'error',
          text: 'Опубликовать акцию не удалось'
        })
      }
    }
  }
}
</script>

<style>
</style>
