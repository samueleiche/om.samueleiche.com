import { ref, readonly } from 'vue'
import { isDocumentVisible, tryOnScopeDispose } from '../utils'
import { useEventListener } from './useEventListener'

type TickerFn = (fn: any) => number

const timeoutFn = (callback: () => void) => setTimeout(callback, 16)

function getTickerFn() {
	return isDocumentVisible() ? requestAnimationFrame : timeoutFn
}

export function useRaf(callback: (elapsed: number) => void) {
	const isRunning = ref(false)
	let startTime = null as number | null
	let ticker: TickerFn = getTickerFn()

	// Inactive browser tabs pause rAF. to get around this, we dynamically switch
	// rAF to setTimeout (which the browser *doesn't* pause) when the tab loses focus.
	useEventListener(document, 'visibilitychange', () => {
		ticker = getTickerFn()

		// The rAF loop has been paused by the browser, so we manually restart the ticker
		if (!isDocumentVisible()) {
			frame()
		}
	})

	function frame() {
		if (!isRunning.value) {
			return
		}

		if (!startTime) {
			startTime = Date.now()
		}

		const elapsed = Date.now() - startTime

		callback(elapsed)
		ticker(frame)
	}

	function start() {
		if (isRunning.value) {
			return
		}

		isRunning.value = true
		ticker(frame)
	}

	function stop() {
		startTime = null
		isRunning.value = false
	}

	tryOnScopeDispose(stop)

	return {
		isRunning: readonly(isRunning),
		start,
		stop,
	}
}
