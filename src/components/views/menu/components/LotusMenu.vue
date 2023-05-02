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
import { toPx, m2PI } from '../../../../support/utils'
import { store } from '../../../../support/store'
import { useWindowSize } from '../../../../composables/useWindowSize'

const MAX_RADIUS = 150
const MIN_RADIUS = 100

const MIN_ELEM_SIZE = 50
const ELEM_SIZE_RATIO = MIN_RADIUS / MIN_ELEM_SIZE

const MIN_FONT_SIZE = 12
const FONT_SIZE_RATIO = MIN_ELEM_SIZE / MIN_FONT_SIZE

interface MenuOption {
	id: number
	text: string
	style: StyleValue
}

function getBorderGradient(angle: number) {
	const deg = (angle + 55) * (180 / Math.PI)

	return `linear-gradient(${deg}deg, #f5f1ee, #f5f1ee) padding-box, linear-gradient(${deg}deg, #72664d, #997b3e 60%) border-box`
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
		const { round, max, min, cos, sin, PI } = Math

		const isReducedMotionMode = computed(() => store.state.reducedMotion)

		const computedOptions = computed<MenuOption[]>(() => {
			const radius = max(min(windowWidth.value / 3, MAX_RADIUS), MIN_RADIUS)
			const elemSize = radius / ELEM_SIZE_RATIO
			const fontSize = elemSize / FONT_SIZE_RATIO

			const result: MenuOption[] = []
			const step = m2PI / props.options.length
			let angle = PI * 3.5

			for (const [i, entry] of props.options.entries()) {
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

				angle += step

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
	box-shadow: 0 25px 50px -12px rgb(0 0 0 / 25%), 0 8px 10px -6px rgb(0 0 0 / 30%);
	transition: box-shadow 160ms;
	-webkit-tap-highlight-color: transparent;

	&:not(.lotus-menu-option-transition-enter-active) {
		&:hover,
		&:focus,
		&:active {
			transition: transform 100ms;
			transform: scale(0.95, 0.95);
		}
	}
}

.lotus-menu-option-active {
	box-shadow: 0 25px 50px -12px rgb(0 0 0 / 25%), 0 8px 10px -6px rgb(0 0 0 / 30%), 0 0 0 4px var(--primary-light),
		0 0 0 7px #f2b04d;
}

.lotus-menu-option span {
	max-width: 2em;
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
