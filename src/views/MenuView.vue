<template>
	<AppLayout>
		<IntervalSlider :modelValue="selectedIntervalId" @update:modelValue="onSlideClick" />
	</AppLayout>
</template>

<script lang="ts">
import { computed, watch, defineComponent } from 'vue'

import AppLayout from '../components/app/AppLayout.vue'
import IntervalSlider from '../components/interval/IntervalSlider.vue'
import type { SlideOptionType } from '../components/app/SwiperControl.vue'

import { useCountDown } from '../composables/global/useCountDown'
import { useViewController } from '../composables/global/useViewController'
import { useModalController, ModalName } from '../composables/global/useModalController'

import { store } from '../store'

export default defineComponent({
	components: { AppLayout, IntervalSlider },
	setup() {
		const { time: countDownTime, startTimer } = useCountDown()
		const { setActiveView, AppView } = useViewController()
		const { openModal, closeModal } = useModalController()

		const selectedIntervalId = computed(() => store.state.interval)

		function onSlideClick(option: SlideOptionType) {
			store.actions.setInterval(option.id)

			startTimer(3, () => {
				setActiveView(AppView.TIMER)
			})
		}

		watch(
			() => countDownTime.value,
			() => {
				if (countDownTime.value > -1) {
					openModal(ModalName.CountDown)
				} else {
					closeModal(ModalName.CountDown)
				}
			},
		)

		return { selectedIntervalId, onSlideClick }
	},
})
</script>

<style lang="scss" scoped></style>
