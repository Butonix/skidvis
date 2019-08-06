<template>
  <div class="btn-group">
    <div v-if="selectedOption.name !== undefined"
         :class="{[btnClass]: !!btnClass}"
         class="dropdown-toggle"
         @click="toggleMenu()">
      {{ selectedOption.name }}
      <span class="caret"/>
    </div>

    <div v-if="selectedOption.name === undefined"
         :class="{[btnClass]: !!btnClass}"
         class="dropdown-toggle"
         @click="toggleMenu()">
      {{ placeholderText }}
      <span class="caret"/>
    </div>

    <ul v-if="showMenu" class="dropdown-menu">
      <li v-for="(option, key) in options" :key="key">
        <a href="javascript:void(0)" @click="updateOption(option)">
          {{ option.name }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Array | Object,
      default: () => ([])
    },
    selected: {
      type: Object,
      default: () => ({})
    },
    btnClass: {
      type: String,
      default: null
    },
    placeholder: {
      type: String,
      default: 'Placeholder'
    }
  },
  data () {
    return {
      selectedOption: {
        name: ''
      },
      showMenu: false,
      placeholderText: 'Please select an item'
    }
  },

  mounted () {
    this.selectedOption = this.selected
    if (this.placeholder) {
      this.placeholderText = this.placeholder
    }
  },

  methods: {
    updateOption (option) {
      this.selectedOption = option
      this.showMenu = false
      this.$emit('updateOption', this.selectedOption)
    },

    toggleMenu () {
      this.showMenu = !this.showMenu
    }
  }
}
</script>

<style>

  .dropdown-toggle {
    position: relative;
  }

  .dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 1000;
    float: left;
    min-width: 160px;
    padding: 5px 0;
    margin: 2px 0 0;
    list-style: none;
    font-size: 14px;
    text-align: left;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
    background-clip: padding-box;
  }

  .dropdown-menu > li > a {
    padding: 10px 30px;
    display: block;
    clear: both;
    font-weight: normal;
    line-height: 1.6;
    color: #333333;
    white-space: nowrap;
    text-decoration: none;
  }
  .dropdown-menu > li > a:hover {
    background: #efefef;
    color: #409FCB;
  }

  .dropdown-menu > li {
    overflow: hidden;
    width: 100%;
    position: relative;
    margin: 0;
  }

  .caret {
    display: relative;
    width: 0;
    position: relative;
    top: 10px;
    height: 0;
    margin-left: 2px;
    vertical-align: middle;
    border-top: 4px dashed;
    border-top: 4px solid \9;
    border-right: 4px solid transparent;
    border-left: 4px solid transparent;
    float: right;
  }

  li {
    list-style: none;
  }
</style>
