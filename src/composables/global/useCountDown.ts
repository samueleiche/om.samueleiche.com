import { ref, readonly } from 'vue'

const time = ref(-1)
let timerId: number | undefined

function clearTimer() {
	clearInterval(timerId)
	time.value = -1
}

function startTimer(startTime: number, onTimerEnd?: () => void) {
	time.value = startTime

	timerId = window.setInterval(() => {
		time.value -= 1

		if (time.value < 1) {
			onTimerEnd?.()
			clearTimer()
		}
	}, 1000)
}

export function useCountDown() {
	return {
		time: readonly(time),
		startTimer,
		clearTimer,
	}
}
