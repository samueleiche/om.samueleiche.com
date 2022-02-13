<template>
	<AppLayout>
		<canvas ref="canvasRef" class="canvas" />
	</AppLayout>
</template>

<script lang="ts">
import { onMounted, onBeforeUnmount, watchEffect, ref, computed, defineComponent } from 'vue'

import { store } from '../../../support/store'
import { audio, playAudio, pauseAudio } from '../../../support/audio'
import { easeInOutQuint, m2PI, mPI2 } from '../../../support/utils'

import { useWindowSize } from '../../../composables/useWindowSize'
import { useRaf } from '../../../composables/useRaf'
import { useViewController } from '../../../composables/global/useViewController'
import { useEventListener } from '../../../composables/useEventListener'
import { useWakeLock } from '../../../composables/useWakeLock'

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
		const { request: requestWakeLock, release: releaseWakeLock } = useWakeLock()

		const canvasRef = ref<HTMLCanvasElement | undefined>()

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

			requestWakeLock('screen')
			setupCanvas(ctx)

			function drawCircle(circle: Circle, startAngle: number, endAngle: number) {
				ctx.beginPath()
				ctx.arc(circle.center.x, circle.center.y, circle.radius, startAngle, endAngle)
				ctx.lineWidth = circle.width
				ctx.lineCap = 'round'
				ctx.strokeStyle = circle.color
				ctx.stroke()
			}

			const { start, stop } = useRaf((elapsed) => {
				ctx.fillStyle = '#000000'
				ctx.fillRect(0, 0, canvasRef.value!.width, canvasRef.value!.height)

				// draw background circle
				drawCircle({ ...circle, color: '#111827' }, 0, m2PI)

				// draw progress circle
				if (elapsed < runDuration.value - rewindDuration) {
					const progress = elapsed / (runDuration.value - rewindDuration)

					const startAngle = -mPI2
					const endAngle = m2PI * progress + startAngle
					drawCircle(circle, startAngle, endAngle)
				} else {
					// play sound and begin rewinding phase
					if (!isRewinding) {
						playAudio(audio.defaultBowl)
						isRewinding = true
					}

					const elapsedRewind = elapsed - runDuration.value + rewindDuration
					const reverseProgress = 1 - elapsedRewind / rewindDuration

					// draw progress rewind circle
					if (reverseProgress > 0) {
						const reverseProgressEase = Math.max(easeInOutQuint(reverseProgress), MIN_VISIBLE_PROGRESS)
						const endAngle = -mPI2
						const startAngle = -m2PI * reverseProgressEase + endAngle

						drawCircle(circle, startAngle, endAngle)
					} else {
						// rewinding phase is done, now restart
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

			playAudio(audio.defaultBowl).then(() => {
				start()
			})
		})

		onBeforeUnmount(() => {
			pauseAudio(audio.defaultBowl)
			releaseWakeLock()
		})

		return {
			canvasRef,
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
