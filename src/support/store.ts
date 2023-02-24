import { reactive, readonly } from 'vue'
import { storage } from './storage'

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

const state = reactive({
	timerInterval: Number(storage.fetch('timerInterval')) || 60000,
	timerElapsed: 0,

	reducedMotion: storage.fetch('reducedMotion') ? storage.fetch('reducedMotion') === 'true' : prefersReducedMotion,
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
}

export const store = {
	state: readonly(state),
	actions,
}
