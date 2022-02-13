<template>
	<Transition :name="transitionName">
		<Component :is="activeView.component" />
	</Transition>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useViewController } from './composables/global/useViewController'

export default defineComponent({
	setup() {
		const { activeView, AppView } = useViewController()

		const transitionName = computed(() =>
			activeView.value.name === AppView.TIMER ? 'v-fade-in-slow' : 'v-fade-in',
		)

		return { activeView, transitionName }
	},
})
</script>

<style lang="scss">
:root {
	// https://easings.net
	--ease-out-quad: cubic-bezier(0.5, 1, 0.89, 1);
	--ease-out-cubic: cubic-bezier(0.33, 1, 0.68, 1);
	--ease-in-quint: cubic-bezier(0.64, 0, 0.78, 0);
	--ease-out-quint: cubic-bezier(0.22, 1, 0.36, 1);
	--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
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
	height: 100%;
	overflow: hidden;
}

body {
	background: #fef9f8;
	font-family: 'Inter', sans-serif;
	color: #000;
	background-color: #000;
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

button {
	padding: 0;
	border: none;
	outline: none;
	font: inherit;
	color: inherit;
	background: none;
	cursor: pointer;
}

#app {
	height: 100%;
}

.v-fade-in-slow-enter-active {
	animation: fade-in 4s var(--ease-out-expo);
}

.v-fade-in-slow-leave-active {
	animation: fade-in 4s var(--ease-out-expo) reverse;
}

.v-fade-in-enter-active {
	animation: fade-in 300ms var(--ease-out-cubic);
}

.v-fade-in-leave-active {
	animation: fade-in 300ms var(--ease-out-cubic) reverse;
}

.v-fade-in-slow-enter-from,
.v-fade-in-slow-leave-to,
.v-fade-in-enter-from,
.v-fade-in-leave-to {
	position: absolute;
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
