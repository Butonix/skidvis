<template>
	<div :class="'material-input '+inputClass">
		<input
			required
			:id="id"
			:type="type"
			:class="inputClass"
			:value="value"
			:name="name"
		>
		<label :for="id" v-html="placeholder"></label>
	</div>
</template>

<script>

	export default {
		props: {
			formClass: {
				type: String,
				default: ''
			},
			inputClass: {
				type: String,
				default: ''
			},
			type: {
				type: String,
				default: 'text'
			},
			name: {
				type: String,
				default: ''
			},
			value: {
				type: String | Number,
				default: ''
			},
			placeholder: {
				type: String,
				default: ''
			},
		},
		computed: {
			id() {
				return ((this.name)?this.name + '-':'') + Math.ceil(Math.random() * 100000000);
			}
		},
		methods: {}
	}
</script>

<style>
</style>
