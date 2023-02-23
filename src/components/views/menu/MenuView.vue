<template>
	<AppLayout>
		<div class="background"></div>

		<LotusMenu :options="timerOptions" :modelValue="timerInterval" @update:modelValue="onSelect" />

		<div class="footer">
			<button v-if="canAskNotificationPermission" type="button" @click="askNotificationPermission">
				Send Notifications
			</button>
			<button v-if="false" type="button" @click="setReducedMotionMode">Reduced Motion Off</button>
			<span>v{{ appVersion }}</span>
		</div>

		<img class="active-sound-img" src="../../../assets/large-bowl.png" alt="" />

		<SWUpdatePopup />
	</AppLayout>
</template>

<script lang="ts">
import { computed, ref, defineComponent } from 'vue'

import { store } from '../../../support/store'
import { loadAudio } from '../../../support/audio'
import { trackEvent } from '../../../support/analytics'
import { getNotificationPermission, requestNotificationPermission } from '../../../support/notification'
import { timerOptions } from '../../../support/settings'
import { getCircle, setCircleStyle } from '../../../support/transition'

import { useViewController } from '../../../composables/global/useViewController'

import LotusMenu from './components/LotusMenu.vue'
import AppLayout from '../../app/AppLayout.vue'
import SWUpdatePopup from './components/SWUpdatePopup.vue'

export default defineComponent({
	components: {
		AppLayout,
		LotusMenu,
		SWUpdatePopup,
	},
	setup() {
		const { activeView, setActiveView, AppView } = useViewController()

		const appVersion: string = process.env.VUE_APP_VERSION
		const timerInterval = computed(() => store.state.timerInterval)

		const canAskNotificationPermission = ref(!!getNotificationPermission().default)

		function askNotificationPermission() {
			requestNotificationPermission().then(() => {
				canAskNotificationPermission.value = !!getNotificationPermission().default
			})
		}

		function setReducedMotionMode() {
			// noop
		}

		function onSelect(id: number, event: PointerEvent) {
			const button = event.target as HTMLElement

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

			const circle = getCircle(button)
			setCircleStyle(circle)

			setActiveView(AppView.TIMER)
		}

		return {
			timerInterval,
			timerOptions,
			onSelect,
			AppView,
			activeView,
			appVersion,
			canAskNotificationPermission,
			askNotificationPermission,
			setReducedMotionMode,
		}
	},
})
</script>

<style lang="scss" scoped>
.app-layout {
	background-color: var(--primary-light);
}

.background {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	background-image: url('../../../assets/menu-background.jpg');
	background-size: cover;
	background-position: center center;
	opacity: 0.2;
}

.footer {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	align-items: center;
	padding: 0 16px;
	gap: 0 0.75rem;
	position: absolute;
	bottom: 0;
	right: 0;
	left: 0;
	text-align: center;
	font-size: 12px;
	line-height: 24px;
	color: var(--primary-dark);
}

.active-sound-img {
	position: absolute;
	left: 50%;
	transform: translate(-50%, -50%);
	top: 50%;
	width: 120px;
	border-radius: 50%;
}
</style>
