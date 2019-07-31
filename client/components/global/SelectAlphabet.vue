<template>
  <div v-click-outside="closeCollapse"
       :class="{'show':show}"
       class="select-ab">
    <div :class="{'active':show}"
         class="nav-link cursor-pointer"
         @click="clickShow"
    >
      <span class="pr-1">{{ selected.name }}</span>
      <span class="select-ab__chevron">
        <chevron/>
      </span>
    </div>
    <div :style="{
           maxHeight: getMaxHeight + 'px'
         }"
         class="select-ab__collapse"
    >
      <div class="select-ab__collapse__wrapper">
        <div :class="{'active': !list.length}" class="preloader"/>
        <div class="select-ab__search">
          <search-input
            v-model="search"
            form-class=""
          />
        </div>
        <ul class="select-ab__list list-unstyled">
          <li v-for="item in getList"
              :key="item.id"
              :class="{ 'active': selected.id === item.id }"
              class="select-ab__item"
              @click="onSelect(item)"
              v-html="item.name"
          />
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { getWindowParams } from '~/utils'
import Fuse from 'fuse.js'

export default {
  name: 'SelectAlphabet',

  components: {
    'Chevron': () => import('~/components/Icons/Chevron'),
    'SearchInput': () => import('~/components/SearchInput')
  },

  props: {
    selected: {
      type: Object,
      default: () => ({
        id: 0,
        name: 'Город не выбран'
      })
    },
    list: {
      type: Array,
      default: () => ([])
    }
  },
  data: () => ({
    search: '',
    maxHeight: 591,
    fuseList: [],
    show: false
  }),
  computed: {
    getMaxHeight () {
      return (!this.list.length) ? 100 : this.maxHeight
    },
    getList () {
      if (this.list.length === 0) {
        return this.list
      }
      this.makeFuse()

      return (this.search) ? this.fuseList.search(this.search) : this.list
    }
  },
  methods: {
    makeFuse () {
      if (process.client && !(this.fuseList instanceof Fuse)) {
        this.fuseList = new Fuse(this.list, {
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
    },
    clickShow () {
      let { y } = getWindowParams()
      if (y > 700) {
        y = 591
      } else {
        y = y - 100
        if (y < 300) {
          y = 300
        }
      }
      this.maxHeight = y

      this.show = !this.show
      this.$emit('click')
    },
    closeCollapse () {
      this.show = false
    },
    onSelect (item) {
      this.$emit('select', item)
      this.show = false
    }
  }
}
</script>
