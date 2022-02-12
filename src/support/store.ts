import { reactive, readonly } from 'vue'
import { storage } from './storage'

const state = reactive({
	timerInterval: Number(storage.fetch('timerInterval')) || 1200000,
})

const actions = {
	setTimerInterval(value: number) {
		state.timerInterval = value
		storage.store('timerInterval', String(value))
	},
}

export const store = {
	state: readonly(state),
	actions,
}
