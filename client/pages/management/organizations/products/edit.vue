<template>
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
            :images="images"
          >
            <div class="product__slider__label">
              <dynamic-label-input
                v-model="form.value"
                :type="form.currency_id === 1? 'percent' : 'number'"
                class-input="ff-open-sans"
              />
              <div :class="{'active': form.currency_id === 1}"
                   class="product__currency"
                   @click="form.currency_id = 1"
                   v-text="'%'"
              />
              <div :class="{'active': form.currency_id === 2}"
                   class="product__currency"
                   @click="form.currency_id = 2"
                   v-text="'₽'"
              />
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
          <no-ssr>
            <div v-if="form && form.errors" :class="{ 'is-invalid': form.errors.has('images') }">
              <has-error :form="form" field="images"/>
            </div>
          </no-ssr>
        </div>

        <div class="order-1 order-lg-2 d-xs-flex pt-2 mt-1 mb-4">
          <div class="product__logo mr-4 mb-3">
            <img
              v-lazy="form.organization_logo || '/placeholders/logo.svg'"
              :alt="form.name"
              :title="form.name"
              src="/placeholders/loading_spinner.gif"
            >
          </div>
          <div class="h1 flex-grow-1 product__name ff-montserrat">
            <material-textarea
              v-model="form.name"
              :form="form"
              field="name"
              placeholder="Название"
              data-align="left"
              form-class="mb-0 mt-xs-0"
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
            placeholder="Сокращенное описание для карточки"
            data-align="left"
            form-class="mb-4 mt-0"
            size="sm"
            rows="1"
          />

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

        <sidebar
          :form="form"
          :socials="form.socials"
          :value="form.value"
          :currency-id="form.currency_id"
          :categories="form.categories"
          :start-at="form.start_at"
          :end-at="form.end_at"
          :operation-mode-text="getOperationModeText"
          box-class="order-4 order-lg-4 mb-4 mt-2"
          box-mod="center"
          @onEditSelect="onEditSelect($event)"
          @onEditSocial="onEditSocial"
          @onInputDate="onInputDate"
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
              <no-ssr>
                <quill-editor v-model="form.conditions"
                              :options="editorOptionCircs"/>
              </no-ssr>
            </div>
            <div v-if="tab === 'desc'" :key="'desc'" class="products-edit__editor">
              <no-ssr>
                <quill-editor v-model="form.description"
                              :options="editorOptionCircs"/>
              </no-ssr>
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
          <no-ssr>
            <div v-if="form && form.errors" :class="{ 'is-invalid': form.errors.has('points') }">
              <has-error :form="form" field="points"/>
            </div>
          </no-ssr>
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
        :socials="form.socials"
        :value="form.value"
        :currency-id="form.currency_id"
        :categories="form.categories"
        :start-at="form.start_at"
        :end-at="form.end_at"
        :operation-mode-text="getOperationModeText"
        box-mod="right"
        @onEditSelect="onEditSelect($event)"
        @onEditSocial="onEditSocial"
        @onInputDate="onInputDate"
      />
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
        <div class="text-center mt-5">
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
                  :src-active="category.images.business.active || '/img/categories/entertainment/entertainment-default-active.svg'"
                  :src="category.images.business.normal || '/img/categories/entertainment/entertainment-default-normal.svg'"
                  @click="removeFromSelect(category.id, 'categories')"
                />
                <category
                  v-for="(category, key) in getCategories"
                  v-if="!categoriesSelectedId[category.id]"
                  :key="'categories-'+key"
                  :label="category.name"
                  :src-active="category.images.business.active || '/img/categories/entertainment/entertainment-default-active.svg'"
                  :src="category.images.business.normal || '/img/categories/entertainment/entertainment-default-normal.svg'"
                  @click="addToSelect(category, 'categories')"
                />
              </categories>
            </div>
          </div>
        </div>
        <div class="text-center mt-5">
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
        <div class="text-center mt-5">
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
</template>

<script>
import { sortBy, remove, cloneDeep } from 'lodash'
import Fuse from 'fuse.js'
import axios from 'axios'
import DynamicLabelInput from '~/components/Edit/Inputs/DynamicLabelInput'
import FullSlider from '~/components/FullSlider'
import AddressesFrame from '~/components/AddressesFrame'
import Sidebar from '~/components/Product/SidebarEdit'
import Category from '~/components/Category'
import Categories from '~/components/Categories'
import Form from 'vform'

export default {
  components: {
    'MaterialTextarea': () => import('~/components/Edit/Inputs/MaterialTextarea'),
    'ThumbsFileInput': () => import('~/components/Edit/ThumbsFileInput'),
    'SearchInput': () => import('~/components/SearchInput'),
    'SocialLinks': () => import('~/components/Edit/SocialLinks'),
    DynamicLabelInput,
    AddressesFrame,
    Sidebar,
    Category,
    Categories,
    FullSlider
  },
  head () {
    return {
      title: 'Акция',
      bodyAttrs: {
        class: 'theme-business'
      }
    }
  },
  asyncData: async ({ params, error, app }) => {
    let images = []
    let productId = params.productId
    let organizationId = params.organizationId
    let form = {
      currency_id: 1,
      is_published: false,
      tags: [],
      categories: [],
      name: '',
      value: '',
      short_description: '',
      description: '',
      start_at: '',
      end_at: '',
      operationModeText: '',
      socials: [],
      points: [],
      images: []
    }
    if (productId) {
      try {
        let { data } = await axios.get(`management/organizations/${organizationId}/products/${productId}/edit`)
        form = { ...form, ...data.product }
        images = cloneDeep(data.product.images)
      } catch (e) {
        error({ statusCode: 404, message: 'Product not found' })
      }
    }

    return {
      organizationId,
      productId,
      form,
      images
    }
  },
  data: () => ({
    editorOptionCircs: {
      placeholder: 'Рекомендуем писать сжато, до 700 знаков. Так клиент легче соглашается на прочтение, и не откладывает вкладку, прочитать позже (никогда). \n\r\n\rИспользуйте абзацы, так легче читать.',
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
    tagsMax: 10,
    tagsTotal: 0,
    tags: {},
    tagsSelected: [],
    tagsSelectedId: {},
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
    // {
    //   id: 123,
    //   name: '',
    //   images: {
    //     default: {
    //       normal: 'http://lorempixel.com/1920/700',
    //       active: 'http://lorempixel.com/1920/700'
    //     },
    //     business: {
    //       normal: 'http://lorempixel.com/1920/700',
    //       active: 'http://lorempixel.com/1920/700'
    //     }
    //   }
    // },
    // {
    //   id: 321,
    //   name: '',
    //   images: {
    //     default: {
    //       normal: 'http://lorempixel.com/1920/700',
    //       active: 'http://lorempixel.com/1920/700'
    //     },
    //     business: {
    //       normal: 'http://lorempixel.com/1920/700',
    //       active: 'http://lorempixel.com/1920/700'
    //     }
    //   }
    // }
    fuseAddresses: null
  }),
  computed: {
    getOperationModeText () {
      return (this.form.operationModeText) ? this.form.operationModeText.replace(', ', ', <br>') : ''
    },
    getTagsSelected () {
      return sortBy(this.tagsSelected, 'name')
    },
    getTags () {
      return (this.tags.data) ? this.tags.data : []
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
      let { data } = await axios.get(`management/organizations/172/points`, {
        params: {
          responseTypeId: 2
        }
      })
      if (!data) {
        throw new Error()
      }
      this.addresses = cloneDeep(data)
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
        let { data } = await axios.get(`management/categories`, {
          params: {
            search: this.selectSearch
          }
        })
        this.categories = data
      } catch (e) {
        console.log(e)
      }
    },
    async tagsFetch () {
      try {
        let { data } = await axios.get(`management/tags`, {
          params: {
            search: this.selectSearch
          }
        })
        this.tags = data
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
      this.$set(this.form, 'is_published', false)
      // try {
      //   await this.form.patch(`management/organizations/${this.organizationId}/products/${this.productId}`)
      //   await this.$callToast({
      //     type: 'success',
      //     text: 'Данные успешно сохранены'
      //   })
      // } catch (e) {
      //   await this.$callToast({
      //     type: 'error',
      //     text: 'Сохранить не удалось'
      //   })
      // }
    },
    async onPublish () {
      this.$set(this.form, 'is_published', true)
      // try {
      //   await this.form.patch(`management/organizations/${this.organizationId}/products/${this.productId}`)
      //   await this.$callToast({
      //     type: 'success',
      //     text: 'Данные успешно сохранены'
      //   })
      // } catch (e) {
      //   this.$set(this.form, 'is_published', false)
      //   await this.$callToast({
      //     type: 'error',
      //     text: 'Сохранить не удалось'
      //   })
      // }
    }
  }
}
</script>

<style>
</style>
