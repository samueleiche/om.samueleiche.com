<template>
	<div class="app-overlay">
		<div class="app-overlay-content">
			<slot />
		</div>
	</div>
</template>

<style lang="scss" scoped>
.app-overlay {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
	z-index: 1;
}

.app-overlay-content {
	display: flex;
	flex-direction: column;
}

.overlay-transition-enter-from,
.overlay-transition-leave-to {
	.app-overlay-content {
		transform: scale(0.96) translate3d(0, 15px, 0);
	}
}

.overlay-transition-enter-active,
.overlay-transition-leave-active {
	.app-overlay-content {
		transition-property: transform;
		transition-duration: inherit;
		transition-timing-function: inherit;
	}
}
</style>
