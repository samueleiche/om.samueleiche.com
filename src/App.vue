<template>
	<AppViewTransition>
		<Component :is="activeView.component" />
	</AppViewTransition>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useViewController } from './composables/global/useViewController'
import AppViewTransition from './components/app/AppViewTransition.vue'

export default defineComponent({
	components: {
		AppViewTransition,
	},
	setup() {
		const { activeView } = useViewController()

		return { activeView }
	},
})
</script>

<style lang="scss">
:root {
	--ease-out-quad: cubic-bezier(0.5, 1, 0.89, 1);
	--ease-out-cubic: cubic-bezier(0.33, 1, 0.68, 1);
	--ease-in-out-cubic: cubic-bezier(0.65, 0, 0.35, 1);
	--ease-out-quint: cubic-bezier(0.22, 1, 0.36, 1);

	--circle-x: 50%;
	--circle-y: 50%;
	--circle-radius: 71%;

	--black: #000;
	--primary-light: #f9f9f9;
	--primary-dark: #48402e;

	--secondary-light: #f2b04d;
}

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
	overflow: hidden;
}

body {
	font-family: 'Inter', sans-serif;
	color: var(--primary-dark);
	margin: 0;
	padding: 0;
}

button {
	padding: 0;
	border: none;
	outline: none;
	font: inherit;
	color: inherit;
	background: none;
	cursor: pointer;
}
</style>
