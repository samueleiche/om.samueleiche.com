<template>
	<Transition name="view-transition" mode="in-out" @afterEnter="onAfterEnter">
		<slot />
	</Transition>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { setCircleStyle } from '../../support/transition'

export default defineComponent({
	setup() {
		function onAfterEnter() {
			setCircleStyle({ x: null, y: null, r: null })
		}

		return {
			onAfterEnter,
		}
	},
})
</script>

<style lang="scss" scoped>
.view-transition-enter-active {
	clip-path: circle(var(--circle-radius) at var(--circle-x) var(--circle-y));
	transition: clip-path 1000ms var(--ease-in-out-cubic);
	// TODO: reduced motion mode
	// opacity: 1;
	// transition: opacity 600ms var(--ease-out-cubic);
}

.view-transition-leave-active {
	transition: clip-path 1000ms var(--ease-in-out-cubic);
	// transition: opacity 600ms var(--ease-out-cubic);
}

.view-transition-enter-from,
.view-transition-leave-to {
	clip-path: circle(0px at var(--circle-x) var(--circle-y));
	// opacity: 0;
}
</style>
