import { reactive, readonly } from 'vue'
import { storage } from './storage'
import { getRandom } from './utils'

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const prefersReducedMotionCache = storage.fetch('reducedMotion')

const state = reactive({
	timerInterval: Number(storage.fetch('timerInterval')) || 60000,
	timerElapsed: 0,
	reducedMotion: prefersReducedMotionCache ? prefersReducedMotionCache === 'true' : prefersReducedMotion,
	backgroundId: 1,
})

const actions = {
	setTimerInterval(value: number) {
		state.timerInterval = value
		storage.store('timerInterval', String(value))
	},
	setTimerElapsed(value: number) {
		state.timerElapsed = value
	},
	toggleReducedMotion() {
		state.reducedMotion = !state.reducedMotion
		storage.store('reducedMotion', String(state.reducedMotion))
	},
	shuffleBackground() {
		state.backgroundId = getRandom(1, 4)
	},
}

export const store = {
	state: readonly(state),
	actions,
}
