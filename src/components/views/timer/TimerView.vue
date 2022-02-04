<template>
	<AppLayout>
		<canvas ref="canvasRef" class="canvas" />
		<audio ref="audioRef" preload="auto">
			<source src="https://assets.samueleiche.com/media/bowls/large-bowl-1.mp3" type="audio/mp3" />
		</audio>
	</AppLayout>
</template>

<script lang="ts">
import { onMounted, watchEffect, ref, computed, defineComponent } from 'vue'

import { useWindowSize } from '../../../composables/useWindowSize'
import { useRaf } from '../../../composables/useRaf'
import { useViewController } from '../../../composables/global/useViewController'
import { useEventListener } from '../../../composables/useEventListener'
import { easeInOutQuint, m2PI, mPI2 } from '../../../utils'
import { store } from '../../../store'

import AppLayout from '../../app/AppLayout.vue'

const MIN_VISIBLE_PROGRESS = 0.001 // min progress that can render on rewind; avoid flickering when starting progress from 0

interface Circle {
	radius: number
	color: string
	width: number
	center: { x: number; y: number }
}

export default defineComponent({
	components: {
		AppLayout,
	},
	setup() {
		const { width: windowWidth, height: windowHeight } = useWindowSize()
		const { setActiveView, AppView } = useViewController()

		const canvasRef = ref<HTMLCanvasElement | undefined>()
		const audioRef = ref<HTMLAudioElement | undefined>()

		const runDuration = computed(() => store.state.timerInterval)
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
			if (!canvasRef.value) {
				return
			}

			const { devicePixelRatio: dpr } = window

			circle.center.x = (windowWidth.value * dpr) / 2
			circle.center.y = (windowHeight.value * dpr) / 2
			circle.radius = circle.baseRadius * dpr
			circle.width = circle.baseWidth * dpr

			canvasRef.value.width = windowWidth.value * dpr
			canvasRef.value.height = windowHeight.value * dpr
			canvasRef.value.style.width = windowWidth.value + 'px'
			canvasRef.value.style.height = windowHeight.value + 'px'

			if (ctx) {
				ctx.scale(dpr, dpr)
			}
		}

		onMounted(() => {
			if (!canvasRef.value) {
				return
			}

			const ctx = canvasRef.value.getContext('2d')!
			let isRewinding = false

			setupCanvas(ctx)

			function draw(circle: Circle, startAngle: number, endAngle: number) {
				ctx.beginPath()
				ctx.arc(circle.center.x, circle.center.y, circle.radius, startAngle, endAngle)
				ctx.lineWidth = circle.width
				ctx.lineCap = 'round'
				ctx.strokeStyle = circle.color
				ctx.stroke()
			}

			function playSound() {
				audioRef.value?.play()
			}

			const { start, stop } = useRaf((elapsed) => {
				ctx.fillStyle = '#000000'
				ctx.fillRect(0, 0, canvasRef.value!.width, canvasRef.value!.height)

				// background circle
				draw({ ...circle, color: '#111827' }, 0, m2PI)

				// render progress circle
				if (elapsed < runDuration.value - rewindDuration) {
					const progress = elapsed / (runDuration.value - rewindDuration)

					const startAngle = -mPI2
					const endAngle = m2PI * progress + startAngle
					draw(circle, startAngle, endAngle)
				} else {
					// play sound and begin rewinding phase
					if (!isRewinding) {
						playSound()
						isRewinding = true
					}

					const elapsedRewind = elapsed - runDuration.value + rewindDuration
					const reverseProgress = 1 - elapsedRewind / rewindDuration

					// render progress rewind
					if (reverseProgress > 0) {
						const reverseProgressEase = Math.max(easeInOutQuint(reverseProgress), MIN_VISIBLE_PROGRESS)
						const endAngle = -mPI2
						const startAngle = -m2PI * reverseProgressEase + endAngle

						draw(circle, startAngle, endAngle)
					} else {
						isRewinding = false
						stop()
						start()
					}
				}
			})

			useEventListener(canvasRef.value, 'click', () => {
				stop()
				setActiveView(AppView.MENU)
			})

			useEventListener(audioRef.value, 'canplay', () => {
				start()
			})

			playSound()
		})

		return {
			canvasRef,
			audioRef,
			windowWidth,
			windowHeight,
		}
	},
})
</script>

<style lang="scss" scoped>
.canvas {
	background-color: #000000;
}
</style>
