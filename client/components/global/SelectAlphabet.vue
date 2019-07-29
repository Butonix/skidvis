<template>
  <div v-click-outside="closeCollapse"
       :class="{'show':show}"
       class="select-ab">
    <div :class="{'active':show}"
         class="nav-link cursor-pointer"
         @click="show = !show"
    >
      <span class="pr-1">{{ selected.name }}</span>
      <span class="select-ab__chevron">
        <chevron/>
      </span>
    </div>
    <div class="select-ab__collapse">
      <div :class="{'active': !!list.length}" class="preloader"/>
      <div class="select-ab__search">
        <search-input
          v-model="search"
          form-class=""
        />
      </div>
      <ul class="select-ab__list list-unstyled">
        <li v-for="(item, key) in list"
            :key="key"
            class="select-ab__item"
            v-html="item.name"
        />
      </ul>
    </div>
  </div>
</template>

<script>
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
    show: false
  }),
  methods: {
    closeCollapse () {
      this.show = false
    }
  }
}
</script>
