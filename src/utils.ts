import { getCurrentScope, onScopeDispose } from 'vue'

export const m2PI = Math.PI * 2
export const mPI2 = Math.PI / 2

export function minsToMs(minutes: number) {
	return minutes * 60 * 1000
}

export function easeInOutQuint(t: number) {
	const t2 = t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t
	return Math.max(t2, 0.0000001)
}

export function isDocumentVisible() {
	return document.visibilityState === 'visible'
}

export function noop() {
	// do nothing
}

// https://v3.vuejs.org/api/effect-scope.html
export function tryOnScopeDispose(fn: () => void) {
	if (getCurrentScope()) {
		onScopeDispose(fn)
		return true
	}
	return false
}
