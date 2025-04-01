<template>
	<div :class="['app-layout', { 'app-layout--mobile': isMobile() }]">
		<slot />
	</div>
</template>

<script setup lang="ts">
import { isMobile } from '@/support/utils'
</script>

<style lang="scss" scoped>
.app-layout {
	position: fixed;
	top: 0;
	height: 100%;
	width: 100%;
	overflow: hidden;
}
</style>
