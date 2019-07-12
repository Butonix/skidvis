import Vue from 'vue'
// state
export const state = () => ({

  saving: false,
  item: {
    name: '',
    link: '',
    inn: '',
    logo: {
      color: '#FFFFFF',
      src: ''
    },
    description: '',
    ordering: 1,
    mainImages: [
      // {
      //   480: '/placeholders/1920x700.jpg',
      //   640: '/placeholders/1920x700.jpg',
      //   800: '/placeholders/1920x700.jpg',
      //   1024: '/placeholders/1920x700.jpg',
      //   1440: '/placeholders/1920x700.jpg',
      //   1920: '/placeholders/1920x700.jpg',
      //   src: '/placeholders/1920x700.jpg', // максимальное, в данный момент 1920
      // }
    ],
    socials: []

  }
})

// getters
export const getters = {
  getItem: (state) => (state.item) ? state.item : undefined,
  getItemMainImages: (state) => (state.item) ? state.item.mainImages : undefined,
  getItemLogoColor: (state) => (state.item && state.item.logo && state.item.logo.color) ? state.item.logo.color : '#FFFFFF',
  getItemLogoSrc: (state) => (state.item && state.item.logo && state.item.logo.src) ? state.item.logo.src : '',
  getItemLink: (state) => (state.item) ? state.item.link : undefined,
  getItemName: (state) => (state.item) ? state.item.name : undefined,
  getItemInn: (state) => (state.item) ? state.item.inn : undefined,
  getItemDescription: (state) => (state.item) ? state.item.description : undefined,
  getItemAddresses: (state) => (state.item) ? state.item.addresses : undefined,
  getItemSocials: (state) => (state.item) ? state.item.socials : undefined
}

// mutations
export const mutations = {
  SET_ITEM (state, { item }) {
    state.item = item
  },
  SET_ITEM_LINK (state, value) {
    Vue.set(state.item, 'link', value)
  },
  SET_ITEM_NAME (state, value) {
    Vue.set(state.item, 'name', value)
  },
  SET_ITEM_INN (state, value) {
    Vue.set(state.item, 'inn', value)
  },
  SET_ITEM_DESCRIPTION (state, value) {
    Vue.set(state.item, 'description', value)
  },
  SET_ITEM_LOGO_SRC (state, src) {
    Vue.set(state.item.logo, 'src', src)
  },
  SET_ITEM_LOGO_COLOR (state, color) {
    Vue.set(state.item.logo, 'color', color)
  },
  SET_ITEM_MAIN_IMAGE (state, { image, index }) {
    /**
		 * @var Image image
		 */
    Vue.set(state.item.mainImages, index, image)
  },
  ADD_ITEM_MAIN_IMAGE (state, { image }) {
    /**
		 * @var Image image
		 */
    state.item.mainImages.push(image)
  },
  ADD_ITEM_SOCIALS_LINK (state, link) {
    state.item.socials.push(link)
  },
  DELETE_ITEM_MAIN_IMAGE (state, index) {
    Vue.delete(state.item.mainImages, index)
  },
  DELETE_ITEM_LOGO (state) {
    Vue.set(state.item.logo, 'src', '')
  }
}

// actions
export const actions = {
  setItem ({ commit }, id) {
    if (id) {
      commit('SET_ITEM', {
        item: {
          name: '',
          link: '',
          inn: '',
          orgnip: '',
          okved: '',
          address: '',
          latitude: '',
          longitude: '',
          logo: {
            src: '/placeholders/1920x700.jpg'
          },
          description: '',
          ordering: 1,
          mainImages: [
            {
              480: '/placeholders/1920x700.jpg',
              640: '/placeholders/1920x700.jpg',
              800: '/placeholders/1920x700.jpg',
              1024: '/placeholders/1920x700.jpg',
              1440: '/placeholders/1920x700.jpg',
              1920: '/placeholders/1920x700.jpg',
              src: '/placeholders/1920x700.jpg', // максимальное, в данный момент 1920, иначе оригинальные
              alt: '',
              title: '',
              loading: false
            }
          ],
          addresses: [
            {
              address: 'Беговая, Приморский пр-т, 72, этаж 3 (ТРЦ «Питерленд»)',
              latitude: 123213,
              longitude: 123123123
            }
          ],
          socials: [
            {
              type: 'vk',
              link: 'https://vk.com/skidvis'
            }
          ]

        }
      })
    }
  },
  setItemMainImage ({ commit, getters }, { image, index }) {
    if (index !== undefined && getters.getItemMainImages[index]) {
      commit('SET_ITEM_MAIN_IMAGE', {
        image: {
          src: image
        },
        index
      })
    } else {
      commit('ADD_ITEM_MAIN_IMAGE', {
        image: {
          src: image
        }
      })
    }
  },
  addItemSocialsLink ({ commit }, link) {
    commit('ADD_ITEM_SOCIALS_LINK', link)
  },
  setItemLogoSrc ({ commit }, src) {
    commit('SET_ITEM_LOGO_SRC', src)
  },
  deleteItemMainImage ({ commit }, { index }) {
    commit('DELETE_ITEM_MAIN_IMAGE', index)
  },
  deleteItemLogo ({ commit }) {
    commit('DELETE_ITEM_LOGO')
  },
  setItemLink ({ commit }, value) {
    commit('SET_ITEM_LINK', value)
  },
  setItemName ({ commit }, value) {
    commit('SET_ITEM_NAME', value)
  },
  setItemInn ({ commit }, value) {
    commit('SET_ITEM_INN', value)
  },
  setItemDescription ({ commit }, value) {
    console.log(value.split(/\r?\n+/))
    commit('SET_ITEM_DESCRIPTION', value)
  },
  setItemLogoColor ({ commit }, value) {
    commit('SET_ITEM_LOGO_COLOR', `rgba(${value.rgba.r}, ${value.rgba.g}, ${value.rgba.b}, ${value.rgba.a})`)
  }
}
