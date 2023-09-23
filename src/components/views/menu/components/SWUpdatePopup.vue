<template>
	<Transition name="v-sw-popup">
		<div v-if="needRefresh" class="sw-update-popup">
			<div class="sw-update-popup-message">A new version is available</div>
			<button class="sw-update-popup-button" type="button" @click="onConfirm">Update</button>
		</div>
	</Transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRegisterSW } from 'virtual:pwa-register/vue'

export default defineComponent({
	setup() {
		const { needRefresh, updateServiceWorker } = useRegisterSW()

		const close = async () => {
			needRefresh.value = false
		}

		function onConfirm() {
			updateServiceWorker()
		}

		return {
			needRefresh,
			close,
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
	background-color: var(--primary-light);
	box-shadow:
		0 20px 25px -5px rgb(0 0 0 / 10%),
		0 8px 10px -6px rgb(0 0 0 / 10%);
}

.sw-update-popup-message {
	color: var(--primary-dark);
	margin-bottom: 12px;
}

.sw-update-popup-button {
	padding: 8px 28px;
	border-radius: 12px;
	letter-spacing: 0.02em;
	font-weight: 700;
	font-size: 14px;
	color: var(--primary-dark);
	user-select: none;
	border: 2px solid var(--primary-dark);

	&:focus {
		outline: none;
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
