<template>
	<SwiperControl
		class="interval-selection"
		:options="intervalOptions"
		:modelValue="modelValue"
		:spaceBetween="30"
		:direction="'vertical'"
		v-bind="$attrs"
	/>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import SwiperControl from '../app/SwiperControl.vue'
import { intervalOptions } from './options'

export default defineComponent({
	components: { SwiperControl },
	props: {
		modelValue: {
			type: String,
		},
	},
	setup() {
		return { intervalOptions }
	},
})
</script>

<style lang="scss">
$shadow-color: #fd411c;

.interval-selection .slide {
	height: 200px;
	width: 200px;
	font-size: 18px;
	border-radius: 36px;
	background: #fff;
	box-shadow: rgba($shadow-color, 0) 0px 0px 0px 0px, rgba($shadow-color, 0) 0px 0px 0px 0px,
		rgba($shadow-color, 0.1) 0px 20px 25px -5px, rgba($shadow-color, 0.1) 0px 8px 10px -6px;

	&:hover,
	&.slide-active {
		outline: 2px solid lightblue;
	}
}
</style>
