import {cloneDeep} from 'lodash'
import Image from "~/classes/Image";
// state
export const state = () => ({
	saving: false,
	item: null,
});

// getters
export const getters = {
	getItem: (state) => state.item,
	getTempMainImages: (state) => state.item.temp.mainImages,
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
	SET_TEMP_MAIN_IMAGE(state, {image, index}) {
		/**
		 * @var Image image
		 */
		state.item.temp.mainImages[index] = image
	},
	ADD_TEMP_MAIN_IMAGE(state, {image}) {
		/**
		 * @var Image image
		 */
		state.item.temp.mainImages.push(image);
	},
	DELETE_TEMP_MAIN_IMAGE(state, index) {
		this.delete(state.item.temp.mainImages, index);
	},
}

// actions
export const actions = {
	setItem({commit}, id) {
		commit('SET_ITEM', {
			item: {
				prod: {
					name: '',
					logo: {
						link: '',
						src: '',
					},
					shortDescription: '',
					ordering: 1,
					mainImages: [
						{
							src: '/demo/1920x600.jpg'
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
	setTempMainImage({commit}, {image, index}) {
		if (index) {
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
	deleteTempMainImage({commit}, index) {
		commit('DELETE_TEMP_MAIN_IMAGE', index)
	}
}
