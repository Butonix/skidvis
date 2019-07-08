<template>
	<div :class="'material-input '+inputClass"
		 :data-align="dataAlign">
		<textarea
			required
			:id="id"
			:type="type"
			:class="inputClass"
			v-html="value"
			:name="name"
			:rows="rows"
			:cols="cols"
			@input="$emit('input', $event)"
		></textarea>
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
			dataAlign: {
				type: String,
				default: 'left'
			},
			cols: {
				type: String,
				default: '50'
			},
			rows: {
				type: String,
				default: '4'
			},
		},
		computed: {
			id() {
				return ((this.name)?this.name + '-':'') + Math.ceil(Math.random() * 100000000);
			}
		},
		methods: {
		}
	}
</script>

<style>
</style>
