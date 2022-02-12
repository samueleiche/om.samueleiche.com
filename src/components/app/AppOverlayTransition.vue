<template>
	<Transition name="v-overlay">
		<slot />
	</Transition>
</template>

<style lang="scss" scoped>
.v-overlay-enter-active {
	animation: fade-in 300ms var(--ease-out-cubic);
}

.v-overlay-leave-active {
	animation: fade-in 300ms var(--ease-out-cubic) reverse;
}

@keyframes fade-in {
	0% {
		opacity: 0;
	}

	100% {
		opacity: 1;
	}
}
</style>
