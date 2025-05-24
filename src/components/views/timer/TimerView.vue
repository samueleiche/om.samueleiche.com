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
import { updateThemeColorMeta } from '../../../support/dom'

import { useLayoutSize } from '@/composables/useLayoutSize'
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
	baseWidth: 8,
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
		updateThemeColorMeta('#000000')

		const { layoutWidth, layoutHeight } = useLayoutSize()
		const { addOverlay, removeOverlay, isOverlayActive } = useOverlay()
		const { time: countDownTime, startTimer } = useCountDown()

		const canvasRef = ref<HTMLCanvasElement | null>(null)

		const isStartSoundEnabled = computed(() => store.state.startWithSound)
		const timerInterval = computed(() => store.state.timerInterval)
		let timerStart = 0

		function setupCanvas(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
			const ctx = canvas.getContext('2d')!

			circle.center.x = layoutWidth.value / 2
			circle.center.y = layoutHeight.value / 2
			circle.radius = circle.baseRadius
			circle.width = circle.baseWidth

			canvas.width = Math.round(layoutWidth.value * dpr)
			canvas.height = Math.round(layoutHeight.value * dpr)
			canvas.style.width = toPx(layoutWidth.value)
			canvas.style.height = toPx(layoutHeight.value)

			ctx.scale(dpr, dpr)

			return ctx
		}

		onMounted(() => {
			const canvas = canvasRef.value!
			const ctx = setupCanvas(canvas)

			trackView('Timer')

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

				const progress = elapsed / timerInterval.value
				// begin arc from top (-Math.PI / 2 = -1.57) and end at the top (Math.PI * 2 - Math.PI / 2 = 4.71)
				let startAngle = -mPI2
				const endAngle = m2PI * progress + -mPI2

				// calc rewinding angle from startAngle
				if (elapsed > timerInterval.value - REWIND_DURATION_MS) {
					const elapsedRewind = Math.min(
						REWIND_DURATION_MS,
						elapsed - timerInterval.value + REWIND_DURATION_MS,
					)
					const reverseProgress = 1 - elapsedRewind / REWIND_DURATION_MS
					const reverseProgressEase = Math.max(easeInOutQuint(reverseProgress), MIN_VISIBLE_PROGRESS)

					startAngle = Math.min(-m2PI * reverseProgressEase - mPI2 + m2PI, endAngle)
				}

				// draw progress circle
				circle.opacity = Math.min(elapsedTotal / TRANSITION_IN_MS, 1)
				drawCircle({ circle, startAngle, endAngle, ctx })
				drawPoint({ circle, angle: endAngle, ctx })

				if (elapsed >= timerInterval.value) {
					const elapsedMins = timerInterval.value / (60 * 1000)

					playAudio(audio.defaultBowl)

					trackEvent('audio_play', {
						category: 'Timer',
						label: 'Sound',
						value: elapsedMins,
						nonInteraction: true,
					})
					sendNotification('OM says:', `${elapsedMins}min passed`)

					stop()
					start()
				}
			})

			useEventListener(ctx.canvas, 'click', () => {
				addOverlay(OverlayName.Timer)
			})

			startTimer(3, async () => {
				try {
					if (isStartSoundEnabled.value) {
						await playAudio(audio.defaultBowl)

						trackEvent('audio_play', {
							category: 'Timer',
							label: 'Sound (initial)',
							value: timerInterval.value / (60 * 1000),
							nonInteraction: true,
						})
					}

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
			isOverlayActive,
			OverlayName,
		}
	},
})
</script>

<style lang="scss" scoped>
.canvas {
	background-color: var(--black);
	cursor: pointer;
	-webkit-tap-highlight-color: transparent;
}
</style>
