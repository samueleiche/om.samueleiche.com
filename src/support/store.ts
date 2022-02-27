import { reactive, readonly } from 'vue'
import { storage } from './storage'

const state = reactive({
	timerInterval: Number(storage.fetch('timerInterval')) || 60000,
	timerStart: 0,
})

const actions = {
	setTimerInterval(value: number) {
		state.timerInterval = value
		storage.store('timerInterval', String(value))
	},
	setTimerStart(value: number) {
		state.timerStart = value
	},
}

export const store = {
	state: readonly(state),
	actions,
}
