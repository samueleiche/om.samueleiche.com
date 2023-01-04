<template>
	<AppLayout>
		<canvas ref="canvasRef" class="canvas" />

		<AppOverlayTransition>
			<TimerOverlay v-if="isOverlayActive(OverlayName.Timer)" />
		</AppOverlayTransition>

		<CountDownOverlay v-if="isOverlayActive(OverlayName.CountDown)" />
	</AppLayout>
</template>

<script lang="ts">
import { onMounted, onBeforeUnmount, watch, watchEffect, ref, computed, defineComponent } from 'vue'

import { store } from '../../../support/store'
import { audio, playAudio, pauseAudio } from '../../../support/audio'
import { easeInOutQuint, m2PI, mPI2 } from '../../../support/utils'
import { trackEvent, trackView } from '../../../support/analytics'
import { requestWakeLock, releaseWakeLock } from '../../../support/wakeLock'
import { sendNotification } from '../../../support/notification'

import { useWindowSize } from '../../../composables/useWindowSize'
import { useRaf } from '../../../composables/useRaf'
import { useOverlay, OverlayName } from '../../../composables/global/useOverlay'
import { useEventListener } from '../../../composables/useEventListener'
import { useCountDown } from '../../../composables/global/useCountDown'

import AppLayout from '../../app/AppLayout.vue'
import AppOverlayTransition from '../../app/AppOverlayTransition.vue'
import TimerOverlay from './components/TimerOverlay.vue'
import CountDownOverlay from './components/CountDownOverlay.vue'

const MIN_VISIBLE_PROGRESS = 0.0005 // min progress that can render on rewind; avoid flickering when starting progress from 0

interface Circle {
	radius: number
	color: string
	width: number
	center: { x: number; y: number }
}

function drawCircle({
	circle,
	startAngle,
	endAngle,
	ctx,
}: {
	circle: Circle
	startAngle: number
	endAngle: number
	ctx: CanvasRenderingContext2D
}) {
	ctx.beginPath()
	ctx.arc(circle.center.x, circle.center.y, circle.radius, startAngle, endAngle)
	ctx.lineWidth = circle.width
	ctx.lineCap = 'round'
	ctx.strokeStyle = circle.color
	ctx.stroke()
}

export default defineComponent({
	components: {
		AppLayout,
		AppOverlayTransition,
		TimerOverlay,
		CountDownOverlay,
	},
	setup() {
		const { width: windowWidth, height: windowHeight } = useWindowSize()
		const { addOverlay, removeOverlay, isOverlayActive } = useOverlay()
		const { time: countDownTime, startTimer } = useCountDown()

		const canvasRef = ref<HTMLCanvasElement | null>(null)

		const timerInterval = computed(() => store.state.timerInterval)
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

			const ctx = canvasRef.value?.getContext('2d')
			if (ctx) {
				drawCircle({ circle: { ...circle, color: '#111827' }, startAngle: 0, endAngle: m2PI, ctx }) // background circle
			}
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

			trackView('Timer')

			const ctx = canvasRef.value.getContext('2d')!
			let isRewinding = false

			requestWakeLock()
			setupCanvas(ctx)

			const { start, stop } = useRaf((elapsed) => {
				if (!store.state.timerStart) {
					store.actions.setTimerStart(Date.now())
				}

				ctx.fillStyle = '#000000'
				ctx.fillRect(0, 0, canvasRef.value!.width, canvasRef.value!.height)
				drawCircle({ circle: { ...circle, color: '#111827' }, startAngle: 0, endAngle: m2PI, ctx }) // background circle

				// draw progress circle
				if (elapsed < timerInterval.value - rewindDuration) {
					const progress = elapsed / (timerInterval.value - rewindDuration)

					const startAngle = -mPI2
					const endAngle = m2PI * progress + startAngle
					drawCircle({ circle, startAngle, endAngle, ctx })
				} else {
					// play sound and begin rewinding phase
					if (!isRewinding) {
						const elapsedMins = timerInterval.value / (60 * 1000)

						trackEvent('audio_play', {
							category: 'Timer',
							label: 'Bowl Hit',
							value: elapsedMins,
							nonInteraction: true,
						})

						playAudio(audio.defaultBowl)
						sendNotification('om says:', `${elapsedMins}min passed`)

						isRewinding = true
					}

					const elapsedRewind = elapsed - timerInterval.value + rewindDuration
					const reverseProgress = 1 - elapsedRewind / rewindDuration

					// draw progress rewind circle
					if (reverseProgress > 0) {
						const reverseProgressEase = Math.max(easeInOutQuint(reverseProgress), MIN_VISIBLE_PROGRESS)
						const endAngle = -mPI2
						const startAngle = -m2PI * reverseProgressEase + endAngle

						drawCircle({ circle, startAngle, endAngle, ctx })
					} else {
						// rewinding phase is done, now restart
						isRewinding = false
						stop()
						start()
					}
				}
			})

			useEventListener(canvasRef.value!, 'click', () => {
				addOverlay(OverlayName.Timer)
			})

			startTimer(3, () => {
				playAudio(audio.defaultBowl)
					.then(() => {
						trackEvent('audio_play', {
							category: 'Timer',
							label: 'Bowl Hit (initial)',
							value: timerInterval.value / (60 * 1000),
							nonInteraction: true,
						})
						start()
					})
					.catch((err) => {
						const msg = '[playAudio]: ' + err

						alert(msg)
						console.error(msg)
					})
			})
		})

		watch(
			() => countDownTime.value,
			() => {
				if (countDownTime.value > 0 && !isOverlayActive(OverlayName.CountDown)) {
					addOverlay(OverlayName.CountDown)
				}

				if (countDownTime.value < 0) {
					removeOverlay(OverlayName.CountDown)
				}
			},
		)

		onBeforeUnmount(() => {
			pauseAudio(audio.defaultBowl)
			releaseWakeLock()
			store.actions.setTimerStart(0)
		})

		return {
			canvasRef,
			windowWidth,
			windowHeight,
			isOverlayActive,
			OverlayName,
		}
	},
})
</script>

<style lang="scss" scoped>
.canvas {
	background-color: #000000;
	cursor: pointer;
	-webkit-tap-highlight-color: transparent;
}
</style>
