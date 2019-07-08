<template>
	<div class="photo-input mb-5">
		<no-ssr>
			<picture-input
				width="306"
				height="117"
				:crop="false"
				buttonClass="d-none"
				:prefill="src"
				:custom-strings="{
        upload: '',
        drag: ''
      }"
				@change="onChange">
			</picture-input>
		</no-ssr>
	</div>
</template>

<script>

	export default {
		props: {
			image: {
				type: Object,
				default: () => ({})
			}
		},
		computed:{
			src()
			{
				return (this.image.src)?this.image.src:'';
			}
		},
		methods: {
			onChange(image) {
				console.log('New picture selected!')
				if (image) {
					console.log(image)
				} else {
					console.log('FileReader API not supported: use the , Luke!')
				}
			}
		}
	}
</script>

<style>
</style>
