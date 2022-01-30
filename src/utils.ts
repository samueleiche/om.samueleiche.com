import { getCurrentScope, onScopeDispose } from 'vue'

export const m2PI = Math.PI * 2
export const mPI2 = Math.PI / 2

export const easeInOutQuint = (t: number) => (t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t)

export const toPx = (value: string | number) => value + 'px'
export const minsToMs = (minutes: number) => minutes * 60 * 1000
export const isDocumentVisible = () => document.visibilityState === 'visible'

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
