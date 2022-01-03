import { ref, readonly } from 'vue'
import { useEventListener } from './useEventListener'

export function useWindowSize() {
	const width = ref(window.innerWidth)
	const height = ref(window.innerHeight)

	function update() {
		width.value = window.innerWidth
		height.value = window.innerHeight
	}

	useEventListener(window, 'resize', update, { passive: true })

	return {
		width: readonly(width),
		height: readonly(height),
	}
}
