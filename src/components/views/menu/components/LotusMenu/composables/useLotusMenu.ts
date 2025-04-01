import { ref } from 'vue'

const isLoaded = ref(false)

export function useLotusMenu() {
	const MAX_RADIUS = 150
	const MIN_RADIUS = 100

	const MIN_ELEM_SIZE = 52
	const ELEM_SIZE_RATIO = MIN_RADIUS / MIN_ELEM_SIZE

	const MIN_FONT_SIZE = 11.5
	const FONT_SIZE_RATIO = MIN_ELEM_SIZE / MIN_FONT_SIZE

	function getBorderGradient(angle: number) {
		const deg = (angle + 55) * (180 / Math.PI)

		return `linear-gradient(${deg}deg, var(--primary-light), var(--primary-light)) padding-box, linear-gradient(${deg}deg, var(--primary-dark), #997b3e 60%) border-box`
	}

	return {
		isLoaded,
		getBorderGradient,
		MAX_RADIUS,
		MIN_RADIUS,
		ELEM_SIZE_RATIO,
		FONT_SIZE_RATIO,
	}
}
