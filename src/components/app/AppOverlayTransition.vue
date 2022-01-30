<template>
	<Transition name="v-overlay-fade-in">
		<slot />
	</Transition>
</template>

<style lang="scss" scoped>
.v-overlay-fade-in-enter-active {
	animation: fade-in 160ms ease-out;
}

.v-overlay-fade-in-leave-active {
	animation: fade-in 160ms ease-out reverse;
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
