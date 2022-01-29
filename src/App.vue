<template>
	<Transition>
		<Component :is="activeView.component" />
	</Transition>

	<Transition>
		<CountDownOverlay v-if="isModalActive(ModalName.CountDown)" />
	</Transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import CountDownOverlay from './components/views/menu/components/CountDownOverlay.vue'
import { useViewController } from './composables/global/useViewController'
import { useModalController, ModalName } from './composables/global/useModalController'

export default defineComponent({
	components: { CountDownOverlay },
	setup() {
		const { activeView } = useViewController()
		const { isModalActive } = useModalController()

		return { activeView, isModalActive, ModalName }
	},
})
</script>

<style lang="scss">
html,
body {
	position: relative;
	height: 100%;
	overflow: hidden;
}

body {
	background: #fef9f8;
	font-family: 'Inter', sans-serif;
	color: #000;
	margin: 0;
	padding: 0;
}

#app {
	height: 100%;
}
</style>
