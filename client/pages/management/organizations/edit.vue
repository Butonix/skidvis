<template>
	<div class="organizations-edit">
		<full-slider></full-slider>
		<div class="container">
			<thumbs-file-input
			:images="mainImages"
			@change="setMainImage"></thumbs-file-input>


			<div class="row justify-content-center">
				<div class="col-lg-8 organizations-edit__editor">
					<no-ssr>
						<quill-editor
							v-model='editorContent'
							ref='textEditor'
							:options='editorOption'
						></quill-editor>
					</no-ssr>
				</div>
			</div>

		</div>
	</div>
</template>

<script>
	import {mapActions, mapGetters} from 'vuex';
	import FullSlider from '~/components/FullSlider'
	import ThumbsFileInput from '~/components/Edit/ThumbsFileInput'

	export default {
		middleware: 'auth',
		components: {
			FullSlider,
			ThumbsFileInput,
		},
		data: () => ({
			editor: null,
			editorContent: '',
			editorOption: {
				modules: {
					toolbar: false
				},
				placeholder: 'Почему к вам стоит прийти?',
				theme: 'snow',
			}
		}),
		computed: {
			...mapGetters({
				mainImages: 'organization/getTempMainImages',
				item: 'organization/getItem',
			})
		},
		methods: {
			...mapActions({
				setMainImage:'organization/setTempMainImage'
			}),
			onChange(image) {
				console.log('New picture selected!')
				if (image) {
					console.log('Picture loaded.')
					this.image = image
				} else {
					console.log('FileReader API not supported: use the form, Luke!')
				}
			}
		},
		created() {
			this.$store.dispatch('organization/setItem', this.$route.params.id);
		}
	}
</script>

<style>
</style>
