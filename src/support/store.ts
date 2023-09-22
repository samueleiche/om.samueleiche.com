import { reactive, readonly } from 'vue'
import { storage } from './storage'
import { getRandom, isReducedMotionPreferred } from './utils'

const prefersReducedMotion = isReducedMotionPreferred()
const prefersReducedMotionCache = storage.fetch('reducedMotion')
const timerIntervalCache = Number(storage.fetch('timerInterval')) || undefined
const backgroundIdCache = Number(storage.fetch('backgroundId')) || undefined
const startWithSoundCache = storage.fetch('startWithSound')

const state = reactive({
	timerInterval: timerIntervalCache || 60000,
	timerElapsed: 0,
	reducedMotion: prefersReducedMotionCache ? prefersReducedMotionCache === 'true' : prefersReducedMotion,
	startWithSound: startWithSoundCache ? startWithSoundCache === 'true' : true,
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
	toggleStartWithSound() {
		state.startWithSound = !state.startWithSound
		storage.store('startWithSound', String(state.startWithSound))
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
