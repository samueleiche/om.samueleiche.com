<template>
	<AppLayout class="menu-layout">
		<BackgroundImage />

		<div class="center-content">
			<div class="stage-backdrop"></div>
			<img class="sound-image" src="../../../assets/large-bowl.png" alt="" />
		</div>

		<LotusMenu :options="timerOptions" :modelValue="timerInterval" @update:modelValue="onSelect" />

		<div class="footer">
			<FooterButton
				:active="isStartSoundEnabled"
				:label="isStartSoundEnabled ? 'Start with sound (on)' : 'Start with sound (off)'"
				@click="toggleStartWithSound"
			/>
			<FooterButton
				:active="isReducedMotionMode"
				:label="isReducedMotionMode ? 'Reduce motion (on)' : 'Reduce motion (off)'"
				@click="toggleReducedMotionMode"
			/>
			<FooterButton
				v-if="canAskNotificationPermission"
				label="Enable web notifications"
				@click="askNotificationPermission"
			/>
			<InstallButton />
			<FooterButton label="About this app" link="https://samueleiche.github.io/om.samueleiche.com" />
			<FooterButton :label="'v' + appVersion" />
		</div>

		<SWUpdatePopup />
	</AppLayout>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'

import { store } from '@/support/store'
import { loadAudio } from '@/support/audio'
import { trackEvent } from '@/support/analytics'
import { getNotificationPermission, requestNotificationPermission } from '@/support/notification'
import { timerOptions } from '@/support/settings'
import { isMobile } from '@/support/utils'
import { updateThemeColorMeta } from '@/support/dom'

import { useViewController } from '@/composables/global/useViewController'

import LotusMenu from './components/LotusMenu/LotusMenu.vue'
import AppLayout from '../../app/AppLayout.vue'
import SWUpdatePopup from './components/SWUpdatePopup.vue'
import BackgroundImage from './components/BackgroundImage.vue'
import FooterButton from './components/FooterButton.vue'
import InstallButton from './components/InstallButton.vue'

updateThemeColorMeta('#ffffff')

const { transitionToView, AppView } = useViewController()
const appVersion = import.meta.env.VITE_APP_VERSION
const timerInterval = computed(() => store.state.timerInterval)
const isReducedMotionMode = computed(() => store.state.reducedMotion)
const isStartSoundEnabled = computed(() => store.state.startWithSound)

const canAskNotificationPermission = ref(!isMobile() && !!getNotificationPermission().default)

function askNotificationPermission() {
	requestNotificationPermission().then(() => {
		canAskNotificationPermission.value = !!getNotificationPermission().default
	})
}

function toggleReducedMotionMode() {
	store.actions.toggleReducedMotion()
}

function toggleStartWithSound() {
	store.actions.toggleStartWithSound()
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

	transitionToView(AppView.TIMER, button)
}
</script>

<style lang="scss" scoped>
.menu-layout {
	background-color: #d8dce7;
}

.center-content {
	display: flex;
	justify-content: center;
	align-items: center;
	position: absolute;
	left: 50%;
	transform: translate(-50%, -50%);
	top: 50%;
	max-width: 424px;
	max-height: 424px;
	width: calc(100vmin - 24px);
	height: calc(100vmin - 24px);
}

.stage-backdrop {
	position: absolute;
	bottom: 0;
	width: 144%;
	height: 100vh;
	background-color: white;
	border-top: none;
	border-bottom-left-radius: 999px;
	border-bottom-right-radius: 999px;
	opacity: 0.3;
	animation-name: fade-in;
	animation-duration: 0s;
	animation-iteration-count: 1;

	.app-layout:not(.app-layout--reduced-motion) & {
		animation-duration: 2s;
	}
}

@keyframes fade-in {
	0% {
		opacity: 0;
		transform: scale(0.95);
	}
	100% {
		opacity: 0.35;
		transform: scale(1);
	}
}

.sound-image {
	position: absolute;
	width: max(38%, 120px);
	margin-top: min(-70%, -200px);
	border-radius: 50%;
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
}
</style>
