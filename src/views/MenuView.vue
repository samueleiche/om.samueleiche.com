<template>
	<AppLayout>
		<IntervalSlider :modelValue="selectedIntervalOption" @update:modelValue="onSlideClick" />
	</AppLayout>
</template>

<script lang="ts">
import { ref, watch, defineComponent } from 'vue'

import AppLayout from '../components/app/AppLayout.vue'
import IntervalSlider from '../components/interval/IntervalSlider.vue'
import type { SlideOptionType } from '../components/app/SwiperControl.vue'

import { useCountDown } from '../composables/global/useCountDown'
import { useViewController } from '../composables/global/useViewController'
import { useModalController, ModalName } from '@/composables/global/useModalController'

export default defineComponent({
	components: { AppLayout, IntervalSlider },
	setup() {
		const { time: countDownTime, startTimer } = useCountDown()
		const { setActiveView, AppView } = useViewController()
		const { openModal, closeModal } = useModalController()
		const selectedIntervalOption = ref('20')

		function onSlideClick(option: SlideOptionType) {
			selectedIntervalOption.value = option.id

			startTimer(5, () => {
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

		return { selectedIntervalOption, onSlideClick }
	},
})
</script>

<style lang="scss" scoped></style>
