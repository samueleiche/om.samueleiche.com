<template>
	<AppOverlay class="timer-overlay">
		<div class="timer-overlay-content" @click="close">
			<div class="active-interval-label">
				{{ activeIntervalLabel }}
			</div>
			<div class="total-elapsed-time">
				{{ totalElapsedTime }}
			</div>

			<div class="timer-stop-button-wrapper">
				<button class="timer-stop-button" type="button" @click.stop="stop">Back</button>
			</div>
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
		const { transitionToView, AppView } = useViewController()
		const { removeOverlay } = useOverlay()

		const activeIntervalLabel = computed(() => {
			const timerInterval = store.state.timerInterval
			return timerOptions.find((o) => o.id === timerInterval)?.text || ''
		})

		const totalElapsedTime = computed(() => {
			const elapsedTime = store.state.timerElapsed
			return new Date(elapsedTime).toISOString().substring(11, 19)
		})

		function stop(event: MouseEvent) {
			const button = event.target as HTMLElement

			trackEvent('click', { category: 'Timer', label: 'Navigate Back' })

			transitionToView(AppView.MENU, button)
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
	font-size: 16px;
	transform: translate(0, -144px);
}

.timer-stop-button-wrapper {
	transform: translate3d(0, 174px, 0);
	display: flex;
	justify-content: center;
	align-items: center;
	position: absolute;
	width: 83px;
	height: 83px;
	overflow: hidden;
	border-radius: 50%;
}

.timer-stop-button {
	position: absolute;
	width: 70px;
	height: 70px;
	border: 2px solid var(--primary-light);
	border-radius: 50%;
	font-weight: 700;
	font-size: 16px;
	color: var(--black);
	background-color: var(--primary-light);
	-webkit-tap-highlight-color: transparent;

	&::before {
		content: '';
		position: absolute;
		top: -8px;
		right: -8px;
		bottom: -8px;
		left: -8px;
		border: 3px solid var(--primary-light);
		border-radius: 50%;
	}

	&::after {
		content: '';
		position: absolute;
		top: 0px;
		right: 0px;
		bottom: 0px;
		left: 0px;
		border: 8px solid var(--primary-light);
		border-radius: 50%;
		z-index: -1;
	}

	&:hover,
	&:focus,
	&:active {
		&::after {
			animation: button 0.5s var(--ease-out-quad);
		}
	}
}

@keyframes button {
	0% {
		transform: scale(1);
		opacity: 1;
	}
	70% {
		opacity: 1;
	}
	100% {
		transform: scale(1.55);
		opacity: 0;
	}
}
</style>
