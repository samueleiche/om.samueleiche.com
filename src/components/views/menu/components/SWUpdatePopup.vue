<template>
	<Transition name="v-sw-popup">
		<div v-if="showPopup" class="sw-update-popup">
			<div class="sw-update-popup-message">A new version is available.</div>
			<button class="sw-update-popup-button" type="button" @click="onConfirm">Update</button>
		</div>
	</Transition>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useEventListener } from '../../../../composables/useEventListener'
import { skipWaiting } from '../../../../support/serviceWorker'

export default defineComponent({
	setup() {
		const worker = ref<ServiceWorkerRegistration | null>(null)
		const showPopup = ref(false)

		function onConfirm() {
			showPopup.value = false
			skipWaiting(worker.value!).then(() => {
				window.location.reload()
			})
		}

		useEventListener(
			window,
			'serviceWorkerUpdated',
			(event: CustomEvent) => {
				showPopup.value = true
				worker.value = event.detail as ServiceWorkerRegistration
			},
			{ once: true },
		)

		return {
			showPopup,
			onConfirm,
		}
	},
})
</script>

<style lang="scss" scoped>
.sw-update-popup {
	transform: translate3d(-50%, 16px, 0);
	position: fixed;
	top: 0;
	left: 50%;
	padding: 20px 24px;
	min-width: 280px;
	border-radius: 16px;
	text-align: center;
	background-color: #fff;
	box-shadow: rgba(0, 0, 0, 0.15) 0px 3px 3px 0px;
}

.sw-update-popup-message {
	margin-bottom: 12px;
}

.sw-update-popup-button {
	padding: 8px 28px;
	border-radius: 12px;
	letter-spacing: 0.05em;
	font-weight: 700;
	font-size: 14px;
	color: #fff;
	background-color: #000;
	user-select: none;

	&:focus {
		outline: none;
	}

	&:active,
	&:focus-visible {
		background-color: rgba(#000, 0.75);
	}
}

.v-sw-popup-enter-active {
	animation: sw-popup-slide-in 300ms var(--ease-out-quint);
}

.v-sw-popup-leave-active {
	animation: sw-popup-slide-in 300ms var(--ease-in-quad) reverse;
}

@keyframes sw-popup-slide-in {
	0% {
		transform: translate3d(-50%, -100%, 0);
	}

	100% {
		transform: translate3d(-50%, 16px, 0);
	}
}
</style>
