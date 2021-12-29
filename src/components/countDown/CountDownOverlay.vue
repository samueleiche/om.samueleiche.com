<template>
	<AppOverlay @click="clearTimer">{{ countDownTime }}</AppOverlay>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import AppOverlay from '../../components/app/AppOverlay.vue'
import { useCountDown } from '../../composables/global/useCountDown'

export default defineComponent({
	components: { AppOverlay },
	setup() {
		const { time: countDownTime, clearTimer } = useCountDown()

		return { countDownTime, clearTimer }
	},
})
</script>

<style lang="scss" scoped></style>
