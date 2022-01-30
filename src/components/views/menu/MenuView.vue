<template>
	<AppLayout>
		<LotusMenu :options="intervalOptions" :modelValue="activeIntervalId" @update:modelValue="onChange" />

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

export const intervalOptions: MenuOption[] = [
	{ id: '1', text: '1 min' },
	{ id: '2', text: '2 min' },
	{ id: '3', text: '3 min' },
	{ id: '4', text: '4 min' },
	{ id: '5', text: '5 min' },
	{ id: '10', text: '10 min' },
	{ id: '20', text: '20 min' },
	{ id: '30', text: '30 min' },
	{ id: '60', text: '60 min' },
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

		const activeIntervalId = computed(() => store.state.activeIntervalId)

		function onChange(intervalId: string) {
			store.actions.setActiveIntervalId(intervalId)

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
			intervalOptions,
			onChange,
			OverlayName,
			isOverlayActive,
		}
	},
})
</script>

<style lang="scss" scoped></style>
