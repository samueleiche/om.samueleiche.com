<template>
	<AppLayout>
		<canvas ref="canvas" :width="windowWidth" :height="windowHeight" />
	</AppLayout>
</template>

<script lang="ts">
import { onMounted, watchEffect, ref, computed, defineComponent } from 'vue'

import AppLayout from '../components/app/AppLayout.vue'
import { useWindowSize } from '../composables/useWindowSize'
import { useRaf } from '../composables/useRaf'

import { minsToMs, easeInOutQuint, PI2, PIHalf } from '../utils'
import { store } from '../store'

interface Circle {
	radius: number
	center: { x: number; y: number }
}

export default defineComponent({
	components: { AppLayout },
	setup() {
		const { width: windowWidth, height: windowHeight } = useWindowSize()
		const canvas = ref<HTMLCanvasElement | undefined>()
		const circle = {
			radius: 100,
			center: { x: windowWidth.value / 2, y: windowHeight.value / 2 },
		}
		const runtime = computed(() => minsToMs(Number(store.state.interval)))

		watchEffect(() => {
			if (!canvas.value) {
				return
			}

			circle.center.x = windowWidth.value / 2
			circle.center.y = windowHeight.value / 2
		})

		onMounted(() => {
			if (!canvas.value) {
				return
			}

			const ctx = canvas.value.getContext('2d')!
			let progress = 0

			function draw(circle: Circle, start: number, end: number) {
				ctx.beginPath()
				ctx.arc(circle.center.x, circle.center.y, circle.radius, start, end)
				ctx.lineWidth = 5
				ctx.lineCap = 'round'
				ctx.strokeStyle = '#ffffff'
				ctx.stroke()
			}

			const { start, stop } = useRaf((elapsed) => {
				progress = elapsed / runtime.value

				ctx.fillStyle = '#000000'
				ctx.fillRect(0, 0, canvas.value!.width, canvas.value!.height)

				// render progress
				if (elapsed < runtime.value) {
					const start = -PIHalf
					const end = PI2 * progress + start
					draw(circle, start, end)
				}
				// rewind progress
				else if (progress > 0 && progress < 2) {
					const reverseProgress = 2 - progress
					progress = easeInOutQuint(reverseProgress)

					const end = -PIHalf
					const start = -PI2 * progress + end
					draw(circle, start, end)
				}
				// begin again
				else {
					stop()
					start()
				}
			})

			start()
		})

		return { canvas, windowWidth, windowHeight }
	},
})
</script>

<style lang="scss" scoped></style>
