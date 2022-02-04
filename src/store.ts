import { reactive, readonly } from 'vue'

const state = reactive({
	timerInterval: 1200000, // TODO: or get from localStorage
})

const actions = {
	setTimerInterval(value: number) {
		state.timerInterval = value
	},
}

export const store = {
	state: readonly(state),
	actions,
}
