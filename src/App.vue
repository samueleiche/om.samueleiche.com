<template>
	<Component :is="activeView.component" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useViewController } from './composables/global/useViewController'

export default defineComponent({
	setup() {
		const { activeView } = useViewController()

		return { activeView }
	},
})
</script>

<style lang="scss">
*,
*::before,
*::after {
	box-sizing: border-box;
}

html {
	font-size: 16px;
	line-height: 1.5;
	text-size-adjust: 100%;
	tab-size: 4;
	touch-action: pan-x pan-y; // disable touch zooming
}

html,
body {
	position: relative;
	height: 100%;
	overflow: hidden;
}

body {
	background: #fef9f8;
	font-family: 'Inter', sans-serif;
	color: #000;
	margin: 0;
	padding: 0;
}

h1,
h2,
h3,
h4 {
	font-family: 'PT Serif', serif;
	margin: 0;
	font-size: inherit;
	font-weight: inherit;
}

#app {
	height: 100%;
}
</style>
