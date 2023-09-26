import { getCurrentScope, onScopeDispose } from 'vue'

// https://v3.vuejs.org/api/effect-scope.html
export function tryOnScopeDispose(fn: () => void) {
	if (getCurrentScope()) {
		onScopeDispose(fn)
		return true
	}
	return false
}
