<template>
	<div class="sw-update-popup"></div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useEventListener } from '../../../../composables/useEventListener'
import { skipWaiting } from '../utils/serviceWorkerUtils'

export default defineComponent({
	setup() {
		const worker = ref<ServiceWorkerRegistration | null>(null)
		let showPopup = false // for future

		useEventListener(
			window,
			'serviceWorkerUpdated',
			(event: CustomEvent) => {
				worker.value = event.detail as ServiceWorkerRegistration
				showPopup = true

				if (confirm('New content is available. Please reload.')) {
					showPopup = false

					skipWaiting(worker.value).then(() => {
						window.location.reload()
					})
				}
			},
			{ once: true },
		)
	},
})
</script>

<style lang="scss" scoped>
.sw-update-popup {
	display: block;
}
</style>
