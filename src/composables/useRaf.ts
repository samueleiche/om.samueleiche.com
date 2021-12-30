import { ref, readonly } from 'vue'

export function useRaf(callback: (elapsed: number) => void) {
	const isRunning = ref(false)
	let startTime = null as number | null

	function frame(timestamp: number) {
		if (!isRunning.value) {
			return
		}

		if (!startTime) {
			startTime = timestamp
		}

		const elapsed = timestamp - startTime

		callback(elapsed)
		window.requestAnimationFrame(frame)
	}

	function start() {
		if (isRunning.value) {
			return
		}

		isRunning.value = true
		window.requestAnimationFrame(frame)
	}

	function stop() {
		startTime = null
		isRunning.value = false
	}

	return {
		isRunning: readonly(isRunning),
		start,
		stop,
	}
}
