import Vue from 'vue'
import { cloneDeep } from 'lodash'
// state
export const state = () => ({

  saving: false,
  item: null
})

// getters
export const getters = {
  getItem: (state) => state.item,
  getTempMainImages: (state) => state.item.temp.mainImages,
  getTempLogo: (state) => state.item.temp.logo,
  getTempLink: (state) => state.item.temp.link,
  getTempName: (state) => state.item.temp.name,
  getTempDescription: (state) => state.item.temp.description,
  getTempAddresses: (state) => state.item.temp.addresses,
  getTempSocials: (state) => state.item.temp.socials
  // locale: state => state.locale,
  // locales: state => state.locales
}

// mutations
export const mutations = {
  SET_ITEM (state, { item }) {
    if (!item.temp) {
      item.temp = cloneDeep(item.prod)
    }
    state.item = item
  },
  SET_TEMP_LINK (state, value) {
    Vue.set(state.item.temp, 'link', value)
  },
  SET_TEMP_NAME (state, value) {
    Vue.set(state.item.temp, 'name', value)
  },
  SET_TEMP_DESCRIPTION (state, value) {
    Vue.set(state.item.temp, 'description', value)
  },
  SET_TEMP_LOGO (state, logo) {
    Vue.set(state.item.temp, 'logo', logo)
  },
  SET_TEMP_MAIN_IMAGE (state, { image, index }) {
    /**
		 * @var Image image
		 */
    Vue.set(state.item.temp.mainImages, index, image)
  },
  ADD_TEMP_MAIN_IMAGE (state, { image }) {
    /**
		 * @var Image image
		 */
    state.item.temp.mainImages.push(image)
  },
  DELETE_TEMP_MAIN_IMAGE (state, index) {
    Vue.delete(state.item.temp.mainImages, index)
  },
  DELETE_TEMP_LOGO (state) {
    Vue.set(state.item.temp, 'logo', { src: '' })
  }
}

// actions
export const actions = {
  setItem ({ commit }, id) {
    commit('SET_ITEM', {
      item: {
        prod: {
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
            },
            {
              type: 'odnoklassniki',
              link: 'https://vk.com/skidvis'
            },
            {
              type: 'facebook',
              link: 'https://vk.com/skidvis'
            },
            {
              type: 'instagram',
              link: 'https://vk.com/skidvis'
            }
          ]
        },
        temp: null
      }
    })
  },
  setTempMainImage ({ commit, getters }, { image, index }) {
    if (index !== undefined && getters.getTempMainImages[index]) {
      commit('SET_TEMP_MAIN_IMAGE', {
        image: {
          src: image
        },
        index
      })
    } else {
      commit('ADD_TEMP_MAIN_IMAGE', {
        image: {
          src: image
        }
      })
    }
  },
  setTempLogo ({ commit }, logo) {
    commit('SET_TEMP_LOGO', {
      src: logo
    })
  },
  deleteTempMainImage ({ commit }, { index }) {
    commit('DELETE_TEMP_MAIN_IMAGE', index)
  },
  deleteTempLogo ({ commit }) {
    commit('DELETE_TEMP_LOGO')
  },
  setTempLink ({ commit }, value) {
    commit('SET_TEMP_LINK', value)
  },
  setTempName ({ commit }, value) {
    commit('SET_TEMP_NAME', value)
  },
  setTempDescription ({ commit }, value) {
    console.log(value.split(/\r?\n+/))
    commit('SET_TEMP_DESCRIPTION', value)
  }
}
