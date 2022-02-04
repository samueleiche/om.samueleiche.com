<template>
	<AppLayout>
		<LotusMenu
			:options="timerOptions"
			:modelValue="timerInterval"
			:class="{ 'fade-out': countDownTime > -1 }"
			@update:modelValue="onChange"
		/>

		<AppOverlayTransition>
			<CountDownOverlay v-if="isOverlayActive(OverlayName.CountDown)" />
		</AppOverlayTransition>
	</AppLayout>
</template>

<script lang="ts">
import { computed, watch, defineComponent } from 'vue'

import { store } from '../../../store'
import { useCountDown } from '../../../composables/global/useCountDown'
import { useViewController } from '../../../composables/global/useViewController'
import { useOverlay, OverlayName } from '../../../composables/global/useOverlay'

import LotusMenu, { MenuOption } from './components/LotusMenu.vue'
import AppLayout from '../../app/AppLayout.vue'
import AppOverlayTransition from '../../app/AppOverlayTransition.vue'
import CountDownOverlay from './components/CountDownOverlay.vue'

export const timerOptions: MenuOption[] = [
	{ id: 60000, text: '1 min' },
	{ id: 120000, text: '2 min' },
	{ id: 180000, text: '3 min' },
	{ id: 240000, text: '4 min' },
	{ id: 300000, text: '5 min' },
	{ id: 600000, text: '10 min' },
	{ id: 1200000, text: '20 min' },
	{ id: 1800000, text: '30 min' },
	{ id: 3600000, text: '60 min' },
]

export default defineComponent({
	components: {
		AppLayout,
		AppOverlayTransition,
		LotusMenu,
		CountDownOverlay,
	},
	setup() {
		const { addOverlay, removeOverlay, isOverlayActive } = useOverlay()
		const { time: countDownTime, startTimer } = useCountDown()
		const { activeView, setActiveView, AppView } = useViewController()

		const timerInterval = computed(() => store.state.timerInterval)

		function onChange(id: number) {
			store.actions.setTimerInterval(id)

			startTimer(3, () => {
				setActiveView(AppView.TIMER)
			})
		}

		watch(
			() => countDownTime.value,
			() => {
				if (countDownTime.value > -1 && !isOverlayActive(OverlayName.CountDown)) {
					addOverlay(OverlayName.CountDown)
				}

				if (countDownTime.value < 0) {
					removeOverlay(OverlayName.CountDown)
				}
			},
		)

		return {
			timerInterval,
			timerOptions,
			onChange,
			OverlayName,
			AppView,
			activeView,
			isOverlayActive,
			countDownTime,
		}
	},
})
</script>

<style lang="scss" scoped>
.app-layout {
	background-color: #ffffff;
}

.fade-out {
	animation: fade-out 8000ms ease-out; // view in transiton + countDown time
}

@keyframes fade-out {
	0% {
		opacity: 1;
	}

	70%,
	100% {
		opacity: 0;
	}
}
</style>
