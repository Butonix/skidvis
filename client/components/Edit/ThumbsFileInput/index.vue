<template>
	<div class="thumbs-file-input">
		<thumb-file-input
			v-for="i in range"
			v-if="i <= images.length"
			:key="i"
			@delete="onDelete(i)"
			@change="onChange($event.image, i)"
			:image="images[i]"
		></thumb-file-input>
	</div>
</template>

<script>
	import {range} from 'lodash'
	import ThumbFileInput from './Thumb'

	export default {
		props: {
			max: {
				type: Number,
				default: 7,
			},
			images: {
				type: Array,
				default: () => []
			}
		},
		components: {
			ThumbFileInput
		},
		computed: {
			range(){
				return range(0, this.max);
			}
		},
		methods: {
			onChange(image, index) {
				this.$emit('change', {
					image,
					index
				});
			},
			onDelete(index) {
				this.$emit('delete', {
					index
				});
			},
		}
	}
</script>

<style>
</style>
