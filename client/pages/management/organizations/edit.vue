<template>
	<div class="organizations-edit">
		<full-slider
			:images="mainImages"
		></full-slider>
		<div class="container">
			<thumbs-file-input
			:images="mainImages"
			@change="setMainImage"></thumbs-file-input>
			<textarea name="na" id="" cols="30" rows="10" oninput="console.log(this.value.split(/\r?\n+/))"></textarea>
			<div class="row">
				<div class="col mb-5 d-flex flex-column justify-content-center">
					<material-input
						name="name"
						placeholder="Название организации"
					></material-input>
				</div>
				<div class="organizations-edit__logo custom-col mb-5">
					<logo-file-input></logo-file-input>
				</div>
				<div class="col mb-5 d-flex flex-column justify-content-center">
					<material-input
						name="link"
						placeholder="Ссылка на ваш сайт"
						:value="link"
						@input="setTempLink($event.target.value)"
					></material-input>
				</div>
			</div>
			<div class="row justify-content-center">
				<div class="col-lg-8 organizations-edit__editor">
					<material-textarea
						name="link"
						placeholder="Почему к вам стоит прийти?"
						dataAlign="center"
						:value="description"
						@input="setTempDescription($event.target.value)"
					></material-textarea>
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
	import MaterialInput from '~/components/Edit/Inputs/MaterialInput'
	import MaterialTextarea from '~/components/Edit/Inputs/MaterialTextarea'
	import LogoFileInput from '~/components/Edit/LogoFileInput'

	export default {
		middleware: 'auth',
		components: {
			MaterialTextarea,
			FullSlider,
			ThumbsFileInput,
			LogoFileInput,
			MaterialInput,
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
				link: 'organization/getTempLink',
				description: 'organization/getTempDescription',
			})
		},
		methods: {
			...mapActions({
				setMainImage:'organization/setTempMainImage',
				setTempLink:'organization/setTempLink',
				setTempDescription:'organization/setTempDescription',
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
