<template>
	<div class="app-layout">
		<slot />
	</div>
</template>

<style lang="scss" scoped>
.app-layout {
	position: fixed;
	top: 0;
	height: 100%;
	width: 100%;
	overflow: hidden;
}
</style>
