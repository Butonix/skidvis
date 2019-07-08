<template>
	<div class="thumbs-file-input__thumb photo-input">
		<no-ssr>
			<picture-input
				width="1920"
				height="700"
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
				if (image) {
					this.$emit('change', {
						image
					});
				} else {
					console.log('FileReader API not supported: use the , Luke!')
				}
			}
		}
	}
</script>

<style>
</style>
