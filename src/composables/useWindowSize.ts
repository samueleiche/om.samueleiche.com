import { ref, readonly } from 'vue'

const listenerOptions: AddEventListenerOptions & EventListenerOptions = { passive: true }

export function useWindowSize() {
	const width = ref(window.innerWidth)
	const height = ref(window.innerHeight)

	function update() {
		width.value = window.innerWidth
		height.value = window.innerHeight
	}

	function unbind() {
		window.removeEventListener('resize', update, listenerOptions)
	}

	window.addEventListener('resize', update, listenerOptions)

	return {
		width: readonly(width),
		height: readonly(height),
		unbind,
	}
}
