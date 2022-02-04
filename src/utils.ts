import { getCurrentScope, onScopeDispose } from 'vue'

export const m2PI = Math.PI * 2
export const mPI2 = Math.PI / 2

export const easeInOutQuint = (t: number) => (t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t)

export const toPx = (value: string | number) => value + 'px'
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

export const storage = {
	store(key: string, value: string) {
		if (!window.localStorage) {
			return false
		}

		try {
			window.localStorage.setItem(key, value)

			return true
		} catch (error) {
			console.error('storage.store(): storing to localStorage failed', error)
			return false
		}
	},

	fetch(key: string) {
		if (!window.localStorage) {
			return undefined
		}

		try {
			const value = window.localStorage.getItem(key)

			if (value === null) {
				return undefined
			}

			return value
		} catch (error) {
			console.error('storage.store(): fetching from localStorage failed', error)
			return undefined
		}
	},
}
