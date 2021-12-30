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
import { useViewController } from '../composables/global/useViewController'

import { minsToMs, easeInOutQuint, PI2, PIHalf } from '../utils'
import { store } from '../store'

interface Circle {
	radius: number
	color: string
	width: number
	center: { x: number; y: number }
}

export default defineComponent({
	components: { AppLayout },
	setup() {
		const { width: windowWidth, height: windowHeight } = useWindowSize()
		const { setActiveView, AppView } = useViewController()

		const canvas = ref<HTMLCanvasElement | undefined>()
		const runDuration = computed(() => minsToMs(Number(store.state.interval)))
		const rewindDuration = 2000
		const circle = {
			radius: 100,
			color: '#ffffff',
			width: 5,
			center: { x: windowWidth.value / 2, y: windowHeight.value / 2 },
		}

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

			function draw(circle: Circle, start: number, end: number) {
				ctx.beginPath()
				ctx.arc(circle.center.x, circle.center.y, circle.radius, start, end)
				ctx.lineWidth = circle.width
				ctx.lineCap = 'round'
				ctx.strokeStyle = circle.color
				ctx.stroke()
			}

			const { start, stop } = useRaf((elapsed) => {
				ctx.fillStyle = '#111827'
				ctx.fillRect(0, 0, canvas.value!.width, canvas.value!.height)

				// background circle
				draw({ ...circle, color: '#374151' }, 0, PI2)

				// render progress circle
				if (elapsed < runDuration.value - rewindDuration) {
					const progress = elapsed / (runDuration.value - rewindDuration)

					const start = -PIHalf
					const end = PI2 * progress + start
					draw(circle, start, end)
				} else {
					const elapsedRewind = elapsed - runDuration.value + rewindDuration
					const reverseProgress = 1 - elapsedRewind / rewindDuration

					// render progress rewind
					if (reverseProgress > 0) {
						const reverseProgressEase = easeInOutQuint(reverseProgress)

						const end = -PIHalf
						const start = -PI2 * reverseProgressEase + end
						draw(circle, start, end)
					}
					// restart
					else {
						stop()
						start()
					}
				}
			})

			canvas.value.addEventListener('click', () => {
				stop()
				setActiveView(AppView.MENU)
			})

			start()
		})

		return { canvas, windowWidth, windowHeight }
	},
})
</script>

<style lang="scss" scoped></style>
