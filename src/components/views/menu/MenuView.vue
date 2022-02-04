<template>
	<AppLayout>
		<LotusMenu :options="timerOptions" :modelValue="activeIntervalId" @update:modelValue="onChange" />

		<Teleport to="#app-overlays">
			<AppOverlayTransition>
				<CountDownOverlay v-if="isOverlayActive(OverlayName.CountDown)" />
			</AppOverlayTransition>
		</Teleport>
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
		const { time: countDownTime, startTimer } = useCountDown()
		const { setActiveView, AppView } = useViewController()
		const { addOverlay, removeOverlay, isOverlayActive } = useOverlay()

		const activeIntervalId = computed(() => store.state.timerInterval)

		function onChange(id: number) {
			store.actions.setTimerInterval(id)

			startTimer(3, () => {
				setActiveView(AppView.TIMER)
			})
		}

		watch(
			() => countDownTime.value,
			() => {
				if (countDownTime.value > -1) {
					addOverlay(OverlayName.CountDown)
				} else {
					removeOverlay(OverlayName.CountDown)
				}
			},
		)

		return {
			activeIntervalId,
			timerOptions,
			onChange,
			OverlayName,
			isOverlayActive,
		}
	},
})
</script>

<style lang="scss" scoped></style>
