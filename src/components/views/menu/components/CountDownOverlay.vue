<template>
	<AppOverlay @click="clearTimer">
		<div class="count-down-time">{{ countDownTime }}</div>
	</AppOverlay>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useCountDown } from '../../../../composables/global/useCountDown'
import AppOverlay from '../../../app/AppOverlay.vue'

export default defineComponent({
	components: {
		AppOverlay,
	},
	setup() {
		const { time: countDownTime, clearTimer } = useCountDown()

		return {
			countDownTime,
			clearTimer,
		}
	},
})
</script>

<style lang="scss" scoped>
.count-down-time {
	font-size: 52px;
	font-weight: 700;
}
</style>
