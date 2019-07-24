<template>
  <div class="container">
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
            @change="setMainImage"
            @delete="deleteMainImage"
          />
        </div>

        <div class="order-1 order-lg-2 d-xs-flex pt-2 mt-1 mb-4">
          <div class="product__logo mr-4 mb-3">
            <img src="/placeholders/logo.svg" alt="Акция" title="Акция">
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
          :value="form.value"
          :currency-id="form.currency_id"
          :categories="form.categories"
          box-class="order-4 order-lg-4 mb-4 mt-2"
          box-mod="center"
          @onEditSelect="onEditSelect($event)"
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
          <div class="tab">
            Адрес
          </div>
          <div class="tab d-none d-sm-block">
            Отзывы
          </div>
        </div>

        <div class="order-6 order-lg-6 tab-content mb-5">
          <transition name="fade" mode="out-in">
            <div v-if="tab === 'circs'" :key="'circs'">
              Скачайте приложение Biglion для iOs или Android и предъявите купон с экрана телефона. Вы также можете
              предъявить купон в электронном или распечатанном виде. Один человек может купить неограниченное количество
              купонов для себя или в подарок. Купон действует на следующие виды услуг: 1 сеанс кино: Скидка 50% на любой
              сеанс кино на цилиндрическом широкоформатном экране для одного (150 руб. вместо 300 руб.) Скидка 51% на
              любой сеанс кино на цилиндрическом широкоформатном экране для двоих
            </div>
            <div v-if="tab === 'desc'" :key="'desc'">
              Скачайте приложение Biglion для iOs или Android и предъявите купон с экрана телефона. Вы также можете
              предъявить купон в электронном или распечатанном виде. Один человек может купить неограниченное количество
              купонов для себя или в подарок. Купон действует на следующие виды услуг: 1 сеанс кино: Скидка 50% на любой
              сеанс кино на цилиндрическом широкоформатном экране для одного (150 руб. вместо 300 руб.) Скидка 51% на
              любой сеанс кино на цилиндрическом широкоформатном экране для двоих
            </div>
          </transition>
        </div>

        <div v-if="addresses" class="order-7 order-lg-7">
          <h5>
            Акция по адресам:
          </h5>
          <search-input
            v-model="search"
            type-style="lite"
            placeholder="Введите адрес или метро"
          />
          <addresses-frame :marker-id="1" :addresses="getAddresses"/>
        </div>

      </div>
      <sidebar
        :value="form.value"
        :currency-id="form.currency_id"
        :categories="form.categories"
        box-mod="right"
        @onEditSelect="onEditSelect($event)"
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
                v-model="search"
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
                v-model="search"
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
    let form = {
      currency_id: 1,
      tags: [],
      categories: [],
      name: '',
      value: '',
      short_description: '',
      description: '',
      images: []
    }
    let productId = params.productId
    productId = 1
    if (productId) {
      try {
        let { data } = await axios.get(`management/organizations/172/products/206/edit`)
        form = data.product
        console.log(data.product)
      } catch (e) {
        console.log(e)
      }
    } else {
      console.log('create')
    }
    let addresses = []
    for (let i = 0; i < 20; i++) {
      addresses.push({
        text: loremIpsum()
      })
    }

    return {
      form,
      addresses
    }
  },
  data: () => ({
    tab: 'circs',
    search: '',
    action: '',
    loading: true,
    imagesLoading: {},
    // Select
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
    images: [],
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
    'form.currency_id': function(v) {
      if(v === 1 && this.form.value && Number(this.form.value) > 100){
        this.$set(this.form, 'value', 100)
      }
    },
    search () {
      this[this.selectName + 'Fetch']()
    }
  },
  async beforeMount () {
    if (!(this.form instanceof Form)) {
      this.form = new Form(this.form)
    }

    if (!(this.addresses instanceof Fuse)) {
      this.fuseAddresses = new Fuse(this.addresses, {
        shouldSort: true,
        threshold: 0.6,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: [
          'text'
        ]
      })
    }
  },
  methods: {
    async onEditSelect (name) {
      this.selectName = name
      this.loading = true
      this.search = ''
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
      this.imagesLoading[index] = true
      try {
        let { data } = await axios.post('management/organizations/image', {
          cover: image
        })

        if (!data.mainImages || !data.mainImages.src || !data.mainImages.id) {
          throw new Error()
        }

        image = data.mainImages

        if (index !== undefined && this.form.images[index]) {
          this.$set(this.form.images, index, image)
        } else {
          this.form.images.push(image)
        }
        this.imagesLoading[index] = false
      } catch (e) {
        if (index !== undefined && this.images[index]) {
          this.$delete(this.images, index)
        } else {
          this.$delete(this.images, this.images.length - 1)
        }
        this.imagesLoading[index] = false
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
      console.log(item)
      if (this[name + 'Selected'].length >= this[name + 'Max']) {
        await this.$callToast({
          type: 'warning',
          text: this.getWarningMaxSelect(name)
        })
      } else if (!this[name + 'SelectedId'][item.id]) {
        console.log(item)
        this[name + 'Selected'].push(item)
        this.$set(this[name + 'SelectedId'], item.id, true)
      }
    },
    async categoriesFetch () {
      try {
        let { data } = await axios.get(`management/categories`, {
          params: {
            search: this.search
          }
        })
        this.categories = data
        console.log(data)
      } catch (e) {
        console.log(e)
      }
    },
    async tagsFetch () {
      try {
        let { data } = await axios.get(`management/tags`, {
          params: {
            search: this.search
          }
        })
        this.tags = data
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style>
</style>
