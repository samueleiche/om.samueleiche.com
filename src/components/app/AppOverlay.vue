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
</style>
