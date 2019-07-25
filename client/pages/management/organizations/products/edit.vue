<template>
  <div class="container products-edit">
    <div class="row mb-4">
      <div class="col">
        <h5 class="text-primary">
          Панель редактирования
        </h5>
      </div>
      <div class="col-auto">
        <div class="btn btn-outline-danger btn-sm">
          Снять с публикации
        </div>
        <div class="btn btn-success btn-sm">
          Сохранить
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
          :socials="form.socials"
          :value="form.value"
          :currency-id="form.currency_id"
          :categories="form.categories"
          :start-at="form.start_at"
          :end-at="form.end_at"
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
          <addresses-frame :marker-id="1" :addresses="getAddresses" :selected-addresses="form.points"
                           @change="changeAddresses"
          />
        </div>

      </div>
      <sidebar
        :socials="form.socials"
        :value="form.value"
        :currency-id="form.currency_id"
        :categories="form.categories"
        :start-at="form.start_at"
        :end-at="form.end_at"
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
          <button v-if="!loading" class="btn btn-outline-primary mr-2"
                  @click="saveSelect('tags')"
          >
            Сохранить
          </button>
          <button class="btn btn-outline-danger ml-2"
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
          <button v-if="!loading" class="btn btn-outline-primary mr-2"
                  @click="saveSelect('categories')"
          >
            Сохранить
          </button>
          <button class="btn btn-outline-danger ml-2"
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
          <button class="btn btn-outline-primary mr-2"
                  @click="saveSocial"
          >
            Сохранить
          </button>
          <button class="btn btn-outline-danger ml-2"
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
import { loremIpsum } from 'lorem-ipsum'
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
    let form = {
      currency_id: 1,
      tags: [],
      categories: [],
      name: '',
      value: '',
      short_description: '',
      description: '',
      start_at: '',
      end_at: '',
      socials: [],
      points: [],
      images: []
    }
    let productId = params.productId
    productId = 1
    if (productId) {
      try {
        let { data } = await axios.get(`management/organizations/172/products/206/edit`)
        form = { ...form, ...data.product }
        images = cloneDeep(data.product.images)
        console.log(data.product)
      } catch (e) {
        console.log(e)
      }
    } else {
      console.log('create')
    }
    // let addresses = []
    // for (let i = 0; i < 20; i++) {
    //   addresses.push({
    //     text: loremIpsum()
    //   })
    // }

    return {
      form,
      // addresses,
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
      this.addresses = data
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
    }
  }
}
</script>

<style>
</style>
