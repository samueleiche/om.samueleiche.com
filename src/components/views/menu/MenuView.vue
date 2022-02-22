<template>
	<AppLayout>
		<LotusMenu :options="timerOptions" :modelValue="timerInterval" @update:modelValue="onChange" />

		<AppOverlayTransition>
			<CountDownOverlay v-if="isOverlayActive(OverlayName.CountDown)" />
		</AppOverlayTransition>

		<SWUpdatePopup />

		<div class="footer">
			<button v-if="canAskNotificationPermission" type="button" @click="askNotificationPermission">
				Enable Notifications
			</button>
			<div>v{{ appVersion }}</div>
		</div>
	</AppLayout>
</template>

<script lang="ts">
import { computed, watch, ref, defineComponent } from 'vue'

import { store } from '../../../support/store'
import { loadAudio } from '../../../support/audio'
import { trackEvent } from '../../../support/analytics'
import { getNotificationPermission, requestNotificationPermission } from '../../../support/notification'

import { useCountDown } from '../../../composables/global/useCountDown'
import { useViewController } from '../../../composables/global/useViewController'
import { useOverlay, OverlayName } from '../../../composables/global/useOverlay'

import LotusMenu, { MenuOption } from './components/LotusMenu.vue'
import AppLayout from '../../app/AppLayout.vue'
import AppOverlayTransition from '../../app/AppOverlayTransition.vue'
import CountDownOverlay from './components/CountDownOverlay.vue'
import SWUpdatePopup from './components/SWUpdatePopup.vue'

export const timerOptions: MenuOption[] = [
	{ id: 60000, text: '1 min' },
	{ id: 120000, text: '2 min' },
	{ id: 180000, text: '3 min' },
	{ id: 240000, text: '4 min' },
	{ id: 300000, text: '5 min' },
	{ id: 600000, text: '10 min' },
	{ id: 1200000, text: '20 min' },
	{ id: 1800000, text: '30 min' },
	{ id: 3600000, text: '60 min' },
]

if (process.env.NODE_ENV === 'development') {
	timerOptions.unshift({ id: 5000, text: '5 sec' })
}

export default defineComponent({
	components: {
		AppLayout,
		AppOverlayTransition,
		LotusMenu,
		CountDownOverlay,
		SWUpdatePopup,
	},
	setup() {
		const { addOverlay, removeOverlay, isOverlayActive } = useOverlay()
		const { time: countDownTime, startTimer } = useCountDown()
		const { activeView, setActiveView, AppView } = useViewController()

		const appVersion: string = process.env.VUE_APP_VERSION
		const timerInterval = computed(() => store.state.timerInterval)

		const canAskNotificationPermission = ref(!!getNotificationPermission().default)

		function askNotificationPermission() {
			requestNotificationPermission().then(() => {
				canAskNotificationPermission.value = !!getNotificationPermission().default
			})
		}

		function onChange(id: number) {
			trackEvent('select', {
				category: 'Menu',
				label: timerOptions.find((option) => option.id === id)?.text,
				value: id / (60 * 1000),
			})

			store.actions.setTimerInterval(id)

			loadAudio({
				defaultBowl: 'https://assets.samueleiche.com/media/bowls/large-bowl-1.mp3',
			}).catch((err) => {
				const msg = '[loadAudio]:' + err

				alert(msg)
				console.error(msg)
			})

			startTimer(3, () => {
				setActiveView(AppView.TIMER)
			})
		}

		watch(
			() => countDownTime.value,
			() => {
				if (countDownTime.value > -1 && !isOverlayActive(OverlayName.CountDown)) {
					addOverlay(OverlayName.CountDown)
				}

				if (countDownTime.value < 0) {
					removeOverlay(OverlayName.CountDown)
				}
			},
		)

		return {
			timerInterval,
			timerOptions,
			onChange,
			OverlayName,
			AppView,
			activeView,
			isOverlayActive,
			appVersion,
			canAskNotificationPermission,
			askNotificationPermission,
		}
	},
})
</script>

<style lang="scss" scoped>
.app-layout {
	background-color: #ffffff;
}

.footer {
	display: flex;
	justify-content: center;
	gap: 0.75rem;
	position: absolute;
	bottom: 0;
	right: 0;
	left: 0;
	text-align: center;
	font-size: 12px;
	line-height: 24px;
	color: #9ca3af;
}
</style>
