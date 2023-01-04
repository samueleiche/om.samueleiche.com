<template>
	<AppOverlay @click="onCancel" class="count-down-overlay">
		<div class="count-down-time">
			{{ countDownTime > -1 ? countDownTime : '' }}
		</div>
	</AppOverlay>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useCountDown } from '../../../../composables/global/useCountDown'
import AppOverlay from '../../../app/AppOverlay.vue'
import { useViewController } from '../../../../composables/global/useViewController'

export default defineComponent({
	components: {
		AppOverlay,
	},
	setup() {
		const { time: countDownTime, clearTimer } = useCountDown()
		const { setActiveView, AppView } = useViewController()

		const onCancel = () => {
			// avoid cancelling before animation is finished
			if (countDownTime.value > 2) {
				return
			}
			setActiveView(AppView.MENU)
			clearTimer()
		}
		return {
			countDownTime,
			onCancel,
		}
	},
})
</script>

<style lang="scss" scoped>
.count-down-overlay {
	cursor: pointer;
	-webkit-tap-highlight-color: transparent;
}

.count-down-time {
	font-size: 56px;
	font-weight: 700;
	color: #ffffff;
}
</style>
