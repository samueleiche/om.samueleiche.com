<template>
	<Transition name="overlay-transition">
		<slot />
	</Transition>
</template>

<style lang="scss" scoped>
.overlay-transition-enter-active,
.overlay-transition-leave-active {
	transition-property: opacity;
	transition-timing-function: var(--ease-out-quint);
	transition-duration: 800ms;
}

.overlay-transition-leave-active {
	transition-duration: 300ms;
}

.overlay-transition-enter-from,
.overlay-transition-leave-to {
	opacity: 0;
}
</style>
