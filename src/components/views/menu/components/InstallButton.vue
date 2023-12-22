<template>
	<FooterButton v-if="isVisible" label="Install" @click="promptInstall" />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import FooterButton from './FooterButton.vue'

export default defineComponent({
	components: {
		FooterButton,
	},
	emits: ['click'],
	setup() {
		const deferredPrompt = ref<BeforeInstallPromptEvent | null>(null)
		const isVisible = ref(false)

		window.addEventListener('beforeinstallprompt', (event) => {
			event.preventDefault()
			deferredPrompt.value = event
			isVisible.value = true
		})

		async function promptInstall() {
			if (!deferredPrompt.value) {
				return
			}

			deferredPrompt.value.prompt()
			const { outcome } = await deferredPrompt.value.userChoice

			deferredPrompt.value = null
			isVisible.value = outcome !== 'accepted'
		}

		return {
			promptInstall,
			isVisible,
		}
	},
})
</script>
