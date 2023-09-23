<template>
	<TransitionGroup appear tag="div" name="lotus-menu-option-transition" class="lotus-menu">
		<button
			v-for="option of computedOptions"
			:key="`menu-option-${option.id}`"
			:style="option.style"
			:class="['lotus-menu-option', { 'lotus-menu-option-active': modelValue === option.id }]"
			@click="onClick(option, $event)"
		>
			<span>{{ option.text }}</span>
		</button>
	</TransitionGroup>
</template>

<script lang="ts">
import { defineComponent, PropType, StyleValue, computed } from 'vue'
import { toPx, m2PI, mPI2 } from '../../../../support/utils'
import { store } from '../../../../support/store'
import { useWindowSize } from '../../../../composables/useWindowSize'

const MAX_RADIUS = 150
const MIN_RADIUS = 100

const MIN_ELEM_SIZE = 52
const ELEM_SIZE_RATIO = MIN_RADIUS / MIN_ELEM_SIZE

const MIN_FONT_SIZE = 12
const FONT_SIZE_RATIO = MIN_ELEM_SIZE / MIN_FONT_SIZE + 0.2

interface MenuOption {
	id: number
	text: string
	style: StyleValue
}

function getBorderGradient(angle: number) {
	const deg = (angle + 55) * (180 / Math.PI)

	return `linear-gradient(${deg}deg, var(--primary-light), var(--primary-light)) padding-box, linear-gradient(${deg}deg, var(--primary-dark), #997b3e 60%) border-box`
}

export default defineComponent({
	props: {
		modelValue: {
			type: Number,
			required: true,
		},
		options: {
			type: Array as PropType<Omit<MenuOption, 'style'>[]>,
			required: true,
		},
	},
	emits: ['update:modelValue'],
	setup(props, { emit }) {
		const { width: windowWidth, height: windowHeight } = useWindowSize()
		const { round, max, min, cos, sin } = Math

		const isReducedMotionMode = computed(() => store.state.reducedMotion)

		const computedOptions = computed<MenuOption[]>(() => {
			const radius = max(min(windowWidth.value / 3, MAX_RADIUS), MIN_RADIUS)
			const elemSize = radius / ELEM_SIZE_RATIO
			const fontSize = elemSize / FONT_SIZE_RATIO

			const TOP_SPACE_ELEMENT_STEP = 1.75 // 1 unit is one element size
			const angleStep = m2PI / (props.options.length + TOP_SPACE_ELEMENT_STEP)

			let startAngle = -mPI2 // top center
			// align the top spacing to the center of the circle
			startAngle += angleStep * (TOP_SPACE_ELEMENT_STEP / 2)
			startAngle += angleStep / 2

			const result: MenuOption[] = []

			for (const [i, entry] of props.options.entries()) {
				const angle = startAngle + angleStep * i
				const cosθ = cos(angle)
				const sinθ = sin(angle)
				const x = round(windowWidth.value / 2 + radius * cosθ - elemSize / 2)
				const y = round(windowHeight.value / 2 + radius * sinθ - elemSize / 2)
				const background = getBorderGradient(angle)

				const style: StyleValue = {
					'--transition-transform-x': toPx(Math.floor((radius / 10) * -cosθ)),
					'--transition-transform-y': toPx(Math.floor((radius / 10) * -sinθ)),
					'--transition-delay': 200 + i * 90 + 'ms',
					'--transition-property': isReducedMotionMode.value ? 'opacity' : 'opacity, transform',
					position: 'absolute',
					fontSize: toPx(fontSize),
					height: toPx(elemSize),
					width: toPx(elemSize),
					left: toPx(x),
					top: toPx(y),
					background,
				}

				result.push({ ...entry, style })
			}

			return result
		})

		function onClick(option: MenuOption, event: Event) {
			emit('update:modelValue', option.id, event)
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
	transition: opacity 1500ms var(--ease-out-cubic);
}

.lotus-menu-option {
	position: relative;
	display: inline-flex;
	justify-content: center;
	align-items: center;
	text-align: center;
	border-radius: 50%;
	color: var(--primary-dark);
	border: 2px solid transparent;
	font-weight: 700;
	line-height: 1.2;
	cursor: pointer;
	user-select: none;
	-webkit-tap-highlight-color: transparent;

	&::before {
		content: '';
		opacity: 0;
		position: absolute;
		top: -8px;
		right: -8px;
		bottom: -8px;
		left: -8px;
		border: 3px solid var(--secondary-light);
		border-radius: 50%;
		transition: opacity 120ms;
	}

	&:not(.lotus-menu-option-transition-enter-active) {
		&:hover,
		&:focus,
		&:active {
			&::before {
				opacity: 1;
			}
		}
	}
}

.lotus-menu-option-active::before {
	opacity: 1;
}

.lotus-menu-option-transition-enter-active {
	transition-duration: 900ms;
	transition-timing-function: var(--ease-out-quad);
	transition-property: var(--transition-property);
	transition-delay: var(--transition-delay, 0ms);
}
.lotus-menu-option-transition-enter-from {
	opacity: 0;
	transform: translate3d(var(--transition-transform-x, 0), var(--transition-transform-y, 0), 0);
}
</style>
