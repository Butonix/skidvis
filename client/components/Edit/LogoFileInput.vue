<template>
	<div class="photo-input">
		<no-ssr>
			<div v-if="src" class="photo-input__remove"
				 @click="$emit('delete', $event)"
			></div>
			<picture-input
				width="306"
				height="117"
				:crop="false"
				buttonClass="d-none"
				:prefill="src"
				:custom-strings="{
  upload: '',
  drag: '',
  tap: '',
  change: '',
  remove: '',
  select: '',
  selected: '',
  fileSize: '',
  fileType: '',
  aspect: '',
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
					this.$emit('change', image)
				} else {
					console.log('FileReader API not supported: use the , Luke!')
				}
			}
		}
	}
</script>

<style>
</style>
