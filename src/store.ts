import { reactive, readonly } from 'vue'

const state = reactive({
	activeIntervalId: '20',
})

const actions = {
	setActiveIntervalId(value: string) {
		state.activeIntervalId = value
	},
}

export const store = {
	state: readonly(state),
	actions,
}
