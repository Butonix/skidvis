// state
export const state = () => ({
	itemId: null,
	items: {}
});

// getters
export const getters = {
	item: (state, id) => state.items[1],
	// locale: state => state.locale,
	// locales: state => state.locales
}

// mutations
export const mutations = {
	SET_ITEMS(state, {items}) {
		state.items = {
			1: {
				saving: false,
				prod: {
					name: '',
					logo: {
						link: '',
						src: '',
					},
					shortDescription: '',
					ordering: 1,
					mainImages: {
						1: {
							ordering: 1,
							src: ''
						},
						2: {
							ordering: 2,
							src: ''
						},
						3: {
							ordering: 3,
							src: ''
						},
						4: {
							ordering: 4,
							src: ''
						},
						5: {
							ordering: 5,
							src: ''
						},
						6: {
							ordering: 6,
							src: ''
						},
						7: {
							ordering: 7,
							src: ''
						},
					},
					addresses: [
						{
							text: 'Беговая, Приморский пр-т, 72, этаж 3 (ТРЦ «Питерленд»)',

						},
					]
				},
				temp: {

				}
			}
		};
	},
	SET_ITEM(state, {items}) {

	}
}

// actions
export const actions = {
	setLocale({commit}, {locale}) {

	},
	setItem({commit}, {id}) {

	}
}
