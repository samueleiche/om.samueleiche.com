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
	background-color: rgba(0, 0, 0, 0.5);
	overflow: hidden;
	z-index: 1;
}

.app-overlay-content {
	display: flex;
	flex-direction: column;
}

.v-overlay-enter-from,
.v-overlay-leave-to {
	.app-overlay-content {
		transform: scale(0.85) translate3d(0, 15px, 0);
	}
}

.v-overlay-enter-active,
.v-overlay-leave-active {
	.app-overlay-content {
		transition-property: transform;
		transition-duration: inherit;
		transition-timing-function: inherit;
	}
}
</style>
