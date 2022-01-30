<template>
	<AppLayout>
		<div v-for="option of intervalOptions" :key="option.id" @click="onClick(option)">
			{{ option.value }}
		</div>

		<Teleport to="#app-overlays">
			<CountDownOverlay v-if="isOverlayActive(OverlayName.CountDown)" />
		</Teleport>
	</AppLayout>
</template>

<script lang="ts">
import { computed, watch, defineComponent } from 'vue'

import { store } from '../../../store'
import { useCountDown } from '../../../composables/global/useCountDown'
import { useViewController } from '../../../composables/global/useViewController'
import { useOverlay, OverlayName } from '../../../composables/global/useOverlay'
import { intervalOptions, IntervalOption } from './intervalOptions'

import AppLayout from '../../app/AppLayout.vue'
import CountDownOverlay from './components/CountDownOverlay.vue'

export default defineComponent({
	components: {
		AppLayout,
		CountDownOverlay,
	},
	setup() {
		const { time: countDownTime, startTimer } = useCountDown()
		const { setActiveView, AppView } = useViewController()
		const { addOverlay, removeOverlay, isOverlayActive } = useOverlay()

		const activeIntervalId = computed(() => store.state.activeIntervalId)

		function onClick(option: IntervalOption) {
			store.actions.setActiveIntervalId(option.id)

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
			onClick,
			OverlayName,
			isOverlayActive,
		}
	},
})
</script>

<style lang="scss" scoped></style>
