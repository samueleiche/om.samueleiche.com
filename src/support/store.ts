import { reactive, readonly } from 'vue'
import { storage } from './storage'
import { getRandom } from './utils'

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
const prefersReducedMotionCache = storage.fetch('reducedMotion')
const timerIntervalCache = Number(storage.fetch('timerInterval')) || undefined
const backgroundIdCache = Number(storage.fetch('backgroundId')) || undefined

const state = reactive({
	timerInterval: timerIntervalCache || 60000,
	timerElapsed: 0,
	reducedMotion: prefersReducedMotionCache ? prefersReducedMotionCache === 'true' : prefersReducedMotion,
	backgroundId: backgroundIdCache || 1,
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
		if (backgroundIdCache) {
			let id: number

			do {
				id = getRandom(1, 4)
			} while (id === state.backgroundId)

			state.backgroundId = id
		}

		storage.store('backgroundId', String(state.backgroundId))
	},
}

export const store = {
	state: readonly(state),
	actions,
}
