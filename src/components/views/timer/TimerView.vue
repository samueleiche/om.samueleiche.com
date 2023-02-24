<template>
	<AppLayout>
		<canvas ref="canvasRef" class="canvas" />

		<AppOverlayTransition>
			<TimerOverlay v-if="isOverlayActive(OverlayName.Timer)" />
		</AppOverlayTransition>

		<AppOverlayTransition>
			<CountDownOverlay v-if="isOverlayActive(OverlayName.CountDown)" />
		</AppOverlayTransition>
	</AppLayout>
</template>

<script lang="ts">
import { onMounted, onBeforeUnmount, watchPostEffect, ref, computed, defineComponent } from 'vue'

import { store } from '../../../support/store'
import { audio, playAudio, pauseAudio } from '../../../support/audio'
import { easeInOutQuint, toPx, m2PI, mPI2, dpr } from '../../../support/utils'
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

import { drawCircle, drawPoint, drawBackground } from './utils/canvas'
import {
	MIN_VISIBLE_PROGRESS,
	TRANSITION_IN_MS,
	REWIND_DURATION_MS,
	CIRCLE_COLOR,
	CIRCLE_BACKGROUND_COLOR,
	backgroundImage,
} from './utils/config'

const circle = {
	baseRadius: 100,
	radius: 0,
	baseWidth: 5,
	width: 0,
	color: CIRCLE_COLOR,
	opacity: 1,
	center: { x: 0, y: 0 },
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
		let timerStart = 0
		let isTimerRewinding = false

		function setupCanvas(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
			const ctx = canvas.getContext('2d')!

			circle.center.x = windowWidth.value / 2
			circle.center.y = windowHeight.value / 2
			circle.radius = circle.baseRadius
			circle.width = circle.baseWidth

			canvas.width = windowWidth.value * dpr
			canvas.height = windowHeight.value * dpr
			canvas.style.width = toPx(windowWidth.value)
			canvas.style.height = toPx(windowHeight.value)

			ctx.scale(dpr, dpr)

			return ctx
		}

		onMounted(() => {
			if (!canvasRef.value) {
				return
			}

			trackView('Timer')

			const ctx = setupCanvas(canvasRef.value)

			drawBackground({ ctx, img: backgroundImage })
			drawCircle({
				circle: { ...circle, opacity: 1, color: CIRCLE_BACKGROUND_COLOR },
				startAngle: 0,
				endAngle: m2PI,
				ctx,
			})

			requestWakeLock()

			const { start, stop } = useRaf((elapsed) => {
				if (!timerStart) {
					timerStart = Date.now()
				}

				const elapsedTotal = Date.now() - timerStart
				store.actions.setTimerElapsed(elapsedTotal)

				drawBackground({ ctx, img: backgroundImage })
				drawCircle({
					circle: { ...circle, opacity: 1, color: CIRCLE_BACKGROUND_COLOR },
					startAngle: 0,
					endAngle: m2PI,
					ctx,
				})

				// draw progress circle
				if (elapsed < timerInterval.value - REWIND_DURATION_MS) {
					const progress = elapsed / (timerInterval.value - REWIND_DURATION_MS)
					const startAngle = -mPI2
					const endAngle = m2PI * progress + startAngle

					circle.opacity = Math.min(elapsedTotal / TRANSITION_IN_MS, 1)

					drawCircle({ circle, startAngle, endAngle, ctx })
					drawPoint({ circle, angle: endAngle, ctx })
				} else {
					// play sound and begin rewinding phase
					if (!isTimerRewinding) {
						const elapsedMins = timerInterval.value / (60 * 1000)

						trackEvent('audio_play', {
							category: 'Timer',
							label: 'Bowl Hit',
							value: elapsedMins,
							nonInteraction: true,
						})

						playAudio(audio.defaultBowl)
						sendNotification('om says:', `${elapsedMins}min passed`)

						isTimerRewinding = true
					}

					const elapsedRewind = elapsed - timerInterval.value + REWIND_DURATION_MS
					const reverseProgress = 1 - elapsedRewind / REWIND_DURATION_MS

					drawPoint({ circle, angle: -mPI2, ctx })

					// draw progress rewind circle
					if (reverseProgress > 0) {
						const reverseProgressEase = Math.max(easeInOutQuint(reverseProgress), MIN_VISIBLE_PROGRESS)
						const endAngle = -mPI2
						const startAngle = -m2PI * reverseProgressEase + endAngle

						drawCircle({ circle, startAngle, endAngle, ctx })
					} else {
						// rewinding phase is done, now restart
						isTimerRewinding = false
						stop()
						start()
					}
				}
			})

			useEventListener(ctx.canvas, 'click', () => {
				addOverlay(OverlayName.Timer)
			})

			startTimer(3, async () => {
				try {
					await playAudio(audio.defaultBowl)

					trackEvent('audio_play', {
						category: 'Timer',
						label: 'Bowl Hit (initial)',
						value: timerInterval.value / (60 * 1000),
						nonInteraction: true,
					})

					start()
				} catch (err) {
					const msg = '[playAudio]: ' + err

					alert(msg)
					console.error(msg)
				}
			})
		})

		watchPostEffect(() => {
			if (!canvasRef.value) {
				return
			}

			const ctx = setupCanvas(canvasRef.value)

			drawBackground({ ctx, img: backgroundImage })
			drawCircle({
				circle: { ...circle, opacity: 1, color: CIRCLE_BACKGROUND_COLOR },
				startAngle: 0,
				endAngle: m2PI,
				ctx,
			})
		})

		watchPostEffect(() => {
			if (countDownTime.value > 0 && !isOverlayActive(OverlayName.CountDown)) {
				addOverlay(OverlayName.CountDown)
			}

			if (countDownTime.value < 0) {
				removeOverlay(OverlayName.CountDown)
			}
		})

		onBeforeUnmount(() => {
			pauseAudio(audio.defaultBowl)
			releaseWakeLock()
			store.actions.setTimerElapsed(0)
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
	background-color: #000;
	cursor: pointer;
	-webkit-tap-highlight-color: transparent;
}
</style>
