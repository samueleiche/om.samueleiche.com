export function useRaf(callback: (elapsed: number) => void) {
	let isRunning = false
	let startTime = null as number | null

	function frame(timestamp: number) {
		if (!isRunning) {
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
		if (isRunning) {
			return
		}

		isRunning = true
		window.requestAnimationFrame(frame)
	}

	function stop() {
		startTime = null
		isRunning = false
	}

	function pause() {
		isRunning = false
	}

	return {
		isRunning,
		start,
		stop,
		pause,
	}
}
