<template>
	<Swiper
		:slidesPerView="'auto'"
		:spaceBetween="spaceBetween"
		:initialSlide="valueIndex"
		:direction="direction"
		centeredSlides
		slideToClickedSlide
		mousewheel
	>
		<SwiperSlide
			v-for="option of computedOptions"
			:key="option.id"
			:class="['slide', { 'slide-active': option.isActive }]"
			@click="onSlideClick(option)"
		>
			<slot v-bind="{ option }">{{ option.text }}</slot>
		</SwiperSlide>
	</Swiper>
</template>

<script lang="ts">
import { PropType, computed, defineComponent } from 'vue'
import { Swiper, SwiperSlide, SwiperOptions } from '../../services/Swiper'

export interface SlideOptionType {
	id: string
	text: string
}

export default defineComponent({
	components: { Swiper, SwiperSlide },
	props: {
		options: {
			type: Array as PropType<SlideOptionType[]>,
			required: true,
		},
		modelValue: {
			type: String,
		},
		spaceBetween: {
			type: Number,
		},
		direction: {
			type: String as PropType<SwiperOptions['direction']>,
		},
	},
	setup(props, { emit }) {
		const valueIndex = computed(() => {
			const idx = props.options.findIndex((o) => o.id === props.modelValue)
			return idx > -1 ? idx : undefined
		})

		const computedOptions = computed(() => {
			return props.options.map((option, idx) => {
				return {
					...option,
					isActive: idx === valueIndex.value,
				}
			})
		})

		const onSlideClick = (option: SlideOptionType) => {
			emit('update:modelValue', option)
		}

		return { valueIndex, computedOptions, onSlideClick }
	},
})
</script>

<style lang="scss">
.swiper-vertical .swiper-wrapper {
	align-items: center;
}
</style>

<style lang="scss" scoped>
.swiper-vertical {
	height: 100%;
	width: 100%;
}

.swiper-slide {
	display: flex;
	justify-content: center;
	align-items: center;
	user-select: none;
	cursor: pointer;
	text-align: center;
	-webkit-tap-highlight-color: transparent;
}
</style>
