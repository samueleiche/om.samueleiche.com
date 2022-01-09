<template>
	<AppLayout>
		<canvas ref="canvas" class="canvas" />
		<audio ref="audio" preload="auto">
			<source src="https://assets.samueleiche.com/media/bowls/large-bowl-1.mp3" type="audio/mp3" />
		</audio>
	</AppLayout>
</template>

<script lang="ts">
import { onMounted, watchEffect, ref, computed, defineComponent } from 'vue'

import AppLayout from '../../app/AppLayout.vue'

import { useWindowSize } from '../../../composables/useWindowSize'
import { useRaf } from '../../../composables/useRaf'
import { useViewController } from '../../../composables/global/useViewController'
import { useEventListener } from '../../../composables/useEventListener'

import { minsToMs, easeInOutQuint, m2PI, mPI2 } from '../../../utils'
import { store } from '../../../store'

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
		const audio = ref<HTMLAudioElement | undefined>()

		const runDuration = computed(() => minsToMs(Number(store.state.interval)))
		const rewindDuration = 2000
		const circle = {
			baseRadius: 100,
			radius: 0,
			baseWidth: 5,
			width: 0,
			color: '#ffffff',
			center: { x: 0, y: 0 },
		}

		watchEffect(() => {
			setupCanvas()
		})

		function setupCanvas(ctx?: CanvasRenderingContext2D) {
			if (!canvas.value) {
				return
			}

			const { devicePixelRatio: dpr } = window

			circle.center.x = (windowWidth.value * dpr) / 2
			circle.center.y = (windowHeight.value * dpr) / 2
			circle.radius = circle.baseRadius * dpr
			circle.width = circle.baseWidth * dpr

			canvas.value.width = windowWidth.value * dpr
			canvas.value.height = windowHeight.value * dpr
			canvas.value.style.width = windowWidth.value + 'px'
			canvas.value.style.height = windowHeight.value + 'px'

			if (ctx) {
				ctx.scale(dpr, dpr)
			}
		}

		onMounted(() => {
			if (!canvas.value) {
				return
			}

			const ctx = canvas.value.getContext('2d')!
			let isRewinding = false

			setupCanvas(ctx)

			function draw(circle: Circle, start: number, end: number) {
				ctx.beginPath()
				ctx.arc(circle.center.x, circle.center.y, circle.radius, start, end)
				ctx.lineWidth = circle.width
				ctx.lineCap = 'round'
				ctx.strokeStyle = circle.color
				ctx.stroke()
			}

			function playSound() {
				audio.value?.play()
			}

			const { start, stop } = useRaf((elapsed) => {
				ctx.fillStyle = '#000000'
				ctx.fillRect(0, 0, canvas.value!.width, canvas.value!.height)

				// background circle
				draw({ ...circle, color: '#374151' }, 0, m2PI)

				// render progress circle
				if (elapsed < runDuration.value - rewindDuration) {
					const progress = elapsed / (runDuration.value - rewindDuration)

					const start = -mPI2
					const end = m2PI * progress + start
					draw(circle, start, end)
				} else {
					if (!isRewinding) {
						playSound()
						isRewinding = true
					}

					const elapsedRewind = elapsed - runDuration.value + rewindDuration
					const reverseProgress = 1 - elapsedRewind / rewindDuration

					// render progress rewind
					if (reverseProgress > 0) {
						const reverseProgressEase = easeInOutQuint(reverseProgress)

						const end = -mPI2
						const start = -m2PI * reverseProgressEase + end
						draw(circle, start, end)
					}
					// restart
					else {
						isRewinding = false
						stop()
						start()
					}
				}
			})

			useEventListener(canvas.value, 'click', () => {
				stop()
				setActiveView(AppView.MENU)
			})

			useEventListener(audio.value, 'canplay', () => {
				start()
			})

			playSound()
		})

		return { canvas, audio, windowWidth, windowHeight }
	},
})
</script>

<style lang="scss" scoped>
.canvas {
	background-color: #000000;
}
</style>
