import { reactive, readonly } from 'vue'

const state = reactive({
	interval: '20',
})

const actions = {
	setInterval(value: string) {
		state.interval = value
	},
}

export const store = {
	state: readonly(state),
	actions,
}
