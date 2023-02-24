<template>
	<Transition :name="transitionName" mode="in-out">
		<slot />
	</Transition>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { store } from '../../support/store'

export default defineComponent({
	setup() {
		const transitionName = computed(() => {
			return store.state.reducedMotion ? 'view-fade-transition' : 'view-circle-transition'
		})

		return {
			transitionName,
		}
	},
})
</script>

<style lang="scss" scoped>
.view-fade-transition-enter-active {
	opacity: 1;
	transition: opacity 400ms var(--ease-out-cubic);
}

.view-fade-transition-leave-active {
	transition: opacity 400ms var(--ease-out-cubic);
}

.view-fade-transition-enter-from,
.view-fade-transition-leave-to {
	opacity: 0;
}

.view-circle-transition-enter-active {
	clip-path: circle(var(--circle-radius) at var(--circle-x) var(--circle-y));
	transition: clip-path 1000ms var(--ease-in-out-cubic);
}

.view-circle-transition-leave-active {
	transition: clip-path 1000ms var(--ease-in-out-cubic);
}

.view-circle-transition-enter-from,
.view-circle-transition-leave-to {
	clip-path: circle(0px at var(--circle-x) var(--circle-y));
}
</style>
