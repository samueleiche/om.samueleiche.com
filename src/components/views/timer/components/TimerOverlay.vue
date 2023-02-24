<template>
	<AppOverlay class="timer-overlay">
		<div class="timer-overlay-content" @click="close">
			<div class="active-interval-label">
				{{ activeIntervalLabel }}
			</div>
			<div class="total-elapsed-time">
				{{ totalElapsedTime }}
			</div>

			<button class="timer-stop-button" type="button" @click.stop="stop">Back</button>
		</div>
	</AppOverlay>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'

import { store } from '../../../../support/store'
import { trackEvent } from '../../../../support/analytics'
import { timerOptions } from '../../../../support/settings'

import { useOverlay, OverlayName } from '../../../../composables/global/useOverlay'
import { useViewController } from '../../../../composables/global/useViewController'

import AppOverlay from '../../../app/AppOverlay.vue'

export default defineComponent({
	components: {
		AppOverlay,
	},
	setup() {
		const { setActiveView, AppView } = useViewController()
		const { removeOverlay } = useOverlay()

		const activeIntervalLabel = computed(() => {
			const timerInterval = store.state.timerInterval
			return timerOptions.find((o) => o.id === timerInterval)?.text || ''
		})

		const totalElapsedTime = computed(() => {
			const elapsedTime = store.state.timerElapsed
			return new Date(elapsedTime).toISOString().substring(11, 19)
		})

		function stop() {
			trackEvent('click', { category: 'Timer', label: 'Leave Timer' })
			setActiveView(AppView.MENU)
			close()
		}

		function close() {
			removeOverlay(OverlayName.Timer)
		}

		return {
			stop,
			close,
			activeIntervalLabel,
			totalElapsedTime,
		}
	},
})
</script>

<style lang="scss" scoped>
.timer-overlay {
	cursor: pointer;
	-webkit-tap-highlight-color: transparent;
	user-select: none;
}

.timer-overlay-content {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	width: 100vw;
	height: 100vh;
	color: var(--primary-light);
}

.total-elapsed-time {
	position: absolute;
	font-size: 30px;
	font-weight: 700;
}

.active-interval-label {
	position: absolute;
	font-weight: 700;
	font-size: 18px;
	transform: translate(0, -144px);
}

.timer-stop-button {
	position: absolute;
	width: 70px;
	height: 70px;
	border: 2px solid var(--primary-light);
	border-radius: 50%;
	font-weight: 700;
	font-size: 16px;
	color: #000;
	background-color: var(--primary-light);
	-webkit-tap-highlight-color: transparent;
	box-shadow: 0 0 0 4px #000, 0 0 0 7px var(--primary-light);
	transform: translate(0, 174px);
}
</style>
