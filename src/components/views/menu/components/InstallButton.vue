<template>
	<FooterButton v-if="isVisible" label="Install" @click="promptInstall" />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import FooterButton from './FooterButton.vue'

export default defineComponent({
	emits: ['click'],
	components: {
		FooterButton,
	},
	setup() {
		const deferredPrompt = ref<any>(null)
		const isVisible = ref(true)

		window.addEventListener('beforeinstallprompt', (event) => {
			event.preventDefault()
			deferredPrompt.value = event
			isVisible.value = true
		})

		async function promptInstall() {
			const result = await deferredPrompt.value.prompt()
			deferredPrompt.value = null
			isVisible.value = result.outcome !== 'accepted'
		}

		return {
			promptInstall,
			isVisible,
		}
	},
})
</script>
