import { ref, readonly, onMounted } from 'vue'
import { useEventListener } from './useEventListener'

export function useLayoutSize() {
	const width = ref(window.innerWidth)
	const height = ref(window.innerHeight)

	function updateSize() {
		const layout = document.querySelector('.app-layout')

		if (layout) {
			width.value = layout.clientWidth
			height.value = layout.clientHeight
		}
	}

	onMounted(() => {
		updateSize()
	})

	useEventListener(window, 'resize', updateSize, { passive: true })

	return {
		layoutWidth: readonly(width),
		layoutHeight: readonly(height),
	}
}
