<template>
	<AppOverlay @click="onCancel" class="count-down-overlay">
		<div class="count-down-overlay-content">
			<Transition name="count-down">
				<div class="count-down-time" :key="countDownTime">
					{{ countDownTime }}
				</div>
			</Transition>
		</div>
	</AppOverlay>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useCountDown } from '../../../../composables/global/useCountDown'
import AppOverlay from '../../../app/AppOverlay.vue'
import { useViewController } from '../../../../composables/global/useViewController'
import { setCircleStyle } from '../../../../support/transition'

export default defineComponent({
	components: {
		AppOverlay,
	},
	setup() {
		const { time, clearTimer } = useCountDown()
		const { setActiveView, AppView } = useViewController()

		const countDownTime = computed(() => {
			return time.value > -1 ? String(time.value) : ''
		})

		const onCancel = () => {
			if (time.value > 2) {
				return // avoid cancelling before animation is finished
			}

			setCircleStyle({ x: null, y: null, r: null })
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

.count-down-overlay-content {
	display: flex;
	justify-content: center;
	align-items: center;
}

.count-down-time {
	position: absolute;
	font-size: 52px;
	font-weight: 700;
	color: var(--primary-light);
}

.count-down-enter-active,
.count-down-leave-active {
	transition: all 250ms var(--ease-in-out-cubic);
}

.count-down-enter-from {
	transform: translateY(18px);
}

.count-down-leave-to {
	transform: translateY(-18px);
}

.count-down-enter-from,
.count-down-leave-to {
	opacity: 0;
}
</style>
