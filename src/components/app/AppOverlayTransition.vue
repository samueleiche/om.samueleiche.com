<template>
	<Transition name="v-overlay">
		<slot />
	</Transition>
</template>

<style lang="scss" scoped>
.v-overlay-enter-active,
.v-overlay-leave-active {
	transition-property: opacity;
	transition-timing-function: var(--ease-out-quint);
	transition-duration: 800ms;
}

.v-overlay-leave-active {
	transition-duration: 300ms;
}

.v-overlay-enter-from,
.v-overlay-leave-to {
	opacity: 0;
}
</style>
