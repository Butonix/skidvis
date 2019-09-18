<template>
  <div v-click-outside="closeMenu"
       :class="{'show': showMenu}"
       class="dropdown-group">
    <div v-if="value.name"
         :class="{[btnClass]: !!btnClass}"
         class="dropdown-toggle text-nowrap"
         @click="toggleMenu"
    >
      {{ value.name }}
      <chevron class="caret ml-2"/>
    </div>

    <div v-else
         :class="{[btnClass]: !!btnClass}"
         class="dropdown-toggle text-nowrap"
         @click="toggleMenu">
      {{ placeholder }}
      <chevron class="caret ml-2"/>
    </div>

    <ul v-if="showMenu"
        :class="{
          ['dropdown-menu--'+hAlign]:true
        }"
        class="dropdown-menu"
    >
      <li v-for="(option, key) in options"
          :key="key"
          :class="{'active': option.id && value && value.id && value.id === option.id }"
          class="nav-item">
        <a class="nav-link" href="javascript:void(0)" @click="updateOption(option)">
          {{ option.name }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  components: {
    'Chevron': () => import('~/components/Icons/Chevron')
  },
  props: {
    options: {
      type: Array | Object,
      default: () => ([])
    },
    value: {
      type: Object,
      required: true
    },
    btnClass: {
      type: String,
      default: null
    },
    placeholder: {
      type: String,
      default: 'Placeholder'
    },
    hAlign: {
      type: String,
      default: 'left',
      validator: function (value) {
        return ['left', 'right'].indexOf(value) !== -1
      }
    }
  },
  data () {
    return {
      showMenu: false
    }
  },

  methods: {
    updateOption (option) {
      this.showMenu = false
      this.$emit('input', option)
    },

    closeMenu () {
      this.showMenu = false
    },

    toggleMenu () {
      this.showMenu = !this.showMenu
    }
  }
}
</script>

<style>
</style>
