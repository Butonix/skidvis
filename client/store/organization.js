import Vue from 'vue';
import {cloneDeep} from 'lodash'
// state
export const state = () => ({

	saving: false,
	item: null,
});

// getters
export const getters = {
	getItem: (state) => state.item,
	getTempMainImages: (state) => state.item.temp.mainImages,
	getTempLink: (state) => state.item.temp.link,
	getTempDescription: (state) => state.item.temp.description,
	// locale: state => state.locale,
	// locales: state => state.locales
}

// mutations
export const mutations = {
	SET_ITEM(state, {item}) {
		if (!item.temp) {
			item.temp = cloneDeep(item.prod);
		}
		state.item = item;
	},
	SET_TEMP_LINK(state, value) {
		Vue.set(state.item.temp, 'link', value)
	},
	SET_TEMP_DESCRIPTION(state, value) {
		Vue.set(state.item.temp, 'description', value)
	},
	SET_TEMP_MAIN_IMAGE(state, {image, index}) {
		/**
		 * @var Image image
		 */
		Vue.set(state.item.temp.mainImages, index, image)
	},
	ADD_TEMP_MAIN_IMAGE(state, {image}) {
		/**
		 * @var Image image
		 */
		state.item.temp.mainImages.push(image);
	},
	DELETE_TEMP_MAIN_IMAGE(state, index) {
		Vue.delete(state.item.temp.mainImages, index);
	},
}

// actions
export const actions = {
	setItem({commit}, id) {
		commit('SET_ITEM', {
			item: {
				prod: {
					name: '',
					link: '',
					logo: {
						src: '',
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
							src: '/placeholders/1920x700.jpg', //максимальное, в данный момент 1920, иначе оригинальные
							alt: '',
							title: '',
							loading: false
						}
					],
					addresses: [
						{
							text: 'Беговая, Приморский пр-т, 72, этаж 3 (ТРЦ «Питерленд»)',

						},
					]
				},
				temp: null
			}
		})
	},
	setTempMainImage({commit, getters}, {image, index}) {
		if (index !== undefined && getters.getTempMainImages[index]) {
			commit('SET_TEMP_MAIN_IMAGE', {
				image: {
					src:image
				}, index
			})
		} else {
			commit('ADD_TEMP_MAIN_IMAGE', {
				image: {
					src:image
				}
			})
		}
	},
	deleteTempMainImage({commit}, {index}) {
		commit('DELETE_TEMP_MAIN_IMAGE', index)
	},
	setTempLink({commit}, value) {
		commit('SET_TEMP_LINK', value)
	},
	setTempDescription({commit}, value) {
		console.log(value.split(/\r?\n+/));
		commit('SET_TEMP_DESCRIPTION', value)
	},
}
