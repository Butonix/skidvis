<template>
  <div>
    <div v-if="filter.favorites.length">
      <div class="d-flex justify-content-between">
        <div class="text-muted small mb-2" v-html="title"/>
        <div class=" mb-2">
          <a v-if="urlQuery[name] && urlQuery[name].length" href="javascript:void(0)" class="mr-2 text-muted small cursor-pointer"
             @click="$emit('clearfilter')">
            Сбросить
          </a>
          <a href="javascript:void(0)" class="text-muted small cursor-pointer"
             @click="$emit('handleall')">
            Все <chevron style="transform-origin: center; transform: rotate(-90deg)"/>
          </a>
        </div>
      </div>
      <categories-scroll
        :categories="filter.favorites"
        :categories-active-ids="urlQuery[name]"
        :type="btnType"
        @clickitem="$emit('filter', $event)"
      />
    </div>
    <modal :name="'modal-filter-' + name">
      <div class="basic-modal categories-modal">
        <div class="position-relative">
          <div :class="{'active': filter.loading}" class="preloader"/>
          <div class="">
            Выбрано {{ urlQuery[name]?urlQuery[name].length:0 }} из {{ filter.collection.length }}
            <div class="">
              <div class="d-flex">
                <search-input
                  v-model="filter.search"
                  form-class="mb-4 flex-grow-1"
                  autofocus="autofocus"
                />
                <div v-if="urlQuery[name] && urlQuery[name].length" class="pl-3">
                  <div class="btn btn-primary btn-sm"
                       @click="$emit('clearfilter')">
                    Сбросить
                  </div>
                </div>
              </div>
              <categories v-if="btnType === '' || btnType === 'categories'">
                <category
                  v-for="(category, key) in filter.selected"
                  :active="true"
                  :key="'categories-selected-'+key"
                  :label="category.name"
                  :src-active="category.images.default.active || '/img/categories/entertainment/entertainment-default-active.svg'"
                  :src="category.images.default.normal || '/img/categories/entertainment/entertainment-default-normal.svg'"
                  @click="$emit('filter', category)"
                />
                <category
                  v-for="(category, key) in fuse"
                  v-if="!filter.selected[category.id]"
                  :key="'categories-'+key"
                  :label="category.name"
                  :src-active="category.images.default.active || '/img/categories/entertainment/entertainment-default-active.svg'"
                  :src="category.images.default.normal || '/img/categories/entertainment/entertainment-default-normal.svg'"
                  @click="$emit('filter', category)"
                />
              </categories>
              <div v-else class="d-flex justify-content-start align-items-start flex-wrap">
                <div
                  v-for="(category, key) in filter.selected"
                  :key="'categories-selected-'+key"
                  :class="{['btn-'+btnType]:true}"
                  class="btn active mx-1 mb-2 text-nowrap"
                  @click="$emit('filter', category)"
                  v-text="category.name"
                />
                <div
                  v-for="(category, key) in fuse"
                  v-if="!filter.selected[category.id]"
                  :key="'categories-'+key"
                  :class="{['btn-'+btnType]:true}"
                  class="btn mx-1 mb-2 text-nowrap"
                  @click="$emit('filter', category)"
                  v-text="category.name"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="text-center mt-4 mt-xs-5">
          <button class="btn btn-outline-primary ml-sm-2 mb-3 mb-sm-0 btn-sm--sm"
                  @click="$modal.pop()"
          >
            Готово
          </button>
        </div>
      </div>
    </modal>
  </div>
</template>

<script>
export default {
  components: {
    'SearchInput': () => import('~/components/SearchInput'),
    'Chevron': () => import('~/components/Icons/Chevron'),
    'CategoriesScroll': () => import('~/components/CategoriesScroll'),
    'Categories': () => import('~/components/Categories'),
    'Category': () => import('~/components/Category')
  },
  props: {
    btnType: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: 'Категории'
    },
    name: {
      type: String,
      required: true
    },
    fuse: {
      type: Array,
      required: true
    },
    urlQuery: {
      type: Object,
      required: true
    },
    filter: {
      type: Object,
      required: true
    }
  }
}
</script>

<style>
</style>
