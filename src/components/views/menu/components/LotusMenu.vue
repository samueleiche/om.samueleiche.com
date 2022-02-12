<template>
	<div class="lotus-menu">
		<div
			v-for="option of computedOptions"
			:key="option.id"
			:style="option.style"
			:class="['lotus-menu-option', { 'lotus-menu-option-active': modelValue === option.id }]"
			@click="onClick(option)"
		>
			<span>{{ option.text }}</span>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from 'vue'
import { toPx, m2PI } from '../../../../support/utils'
import { useWindowSize } from '../../../../composables/useWindowSize'

const MAX_RADIUS = 150
const MIN_RADIUS = 100

const MIN_ELEM_SIZE = 50
const ELEM_SIZE_RATIO = MIN_RADIUS / MIN_ELEM_SIZE

const MIN_FONT_SIZE = 12
const FONT_SIZE_RATIO = MIN_ELEM_SIZE / MIN_FONT_SIZE

export interface MenuOption {
	id: number
	text: string
	style?: {
		position: string
		height: string
		width: string
		left: string
		top: string
	}
}

export default defineComponent({
	emits: ['update:modelValue'],
	props: {
		modelValue: Number,
		options: {
			type: Array as PropType<MenuOption[]>,
			required: true,
		},
	},
	setup(props, { emit }) {
		const { width: windowWidth, height: windowHeight } = useWindowSize()
		const { round, max, min, cos, sin, PI } = Math

		const computedOptions = computed(() => {
			const radius = max(min(windowWidth.value / 3, MAX_RADIUS), MIN_RADIUS)
			const elemSize = radius / ELEM_SIZE_RATIO
			const fontSize = elemSize / FONT_SIZE_RATIO

			const result = []
			const step = m2PI / props.options.length
			let angle = PI * 3.5

			for (const entry of props.options) {
				const x = round(windowWidth.value / 2 + radius * cos(angle) - elemSize / 2)
				const y = round(windowHeight.value / 2 + radius * sin(angle) - elemSize / 2)

				const style = {
					position: 'absolute',
					fontSize: toPx(fontSize),
					height: toPx(elemSize),
					width: toPx(elemSize),
					left: toPx(x),
					top: toPx(y),
				}

				angle += step

				result.push({ ...entry, style })
			}

			return result
		})

		function onClick(option: MenuOption) {
			emit('update:modelValue', option.id)
		}

		return {
			onClick,
			computedOptions,
		}
	},
})
</script>

<style lang="scss" scoped>
.lotus-menu {
	position: relative;
	height: 100%;
	width: 100%;
}

.lotus-menu-option {
	display: inline-flex;
	justify-content: center;
	align-items: center;
	text-align: center;
	border-radius: 50%;
	border: 2px solid #000;
	font-weight: 700;
	line-height: 1.2;
	cursor: pointer;
	user-select: none;
	-webkit-tap-highlight-color: transparent;
}

.lotus-menu-option-active {
	background-color: #d1d5db;
}

.lotus-menu-option span {
	max-width: 2em;
}
</style>
