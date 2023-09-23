<template>
	<div :class="['background', `background-${backgroundId}`]" />
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { store } from '../../../../support/store'

export default defineComponent({
	setup() {
		const backgroundId = computed(() => store.state.backgroundId)

		store.actions.shuffleBackground()

		return {
			backgroundId,
		}
	},
})
</script>

<style lang="scss" scoped>
.background {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	background-size: cover;
}

.background-1 {
	// Bahman Farzad https://www.flickr.com/photos/21644167@N04
	background-image: url('../../../../assets/background-1.jpg');
	opacity: 0.3;
	background-position: top center;

	@media (min-width: 1000px) {
		opacity: 0.4;
		background-position: center 70%;
	}
}

.background-2 {
	// Unknown
	background-image: url('../../../../assets/background-2.jpg');
	opacity: 0.2;
	background-position: center center;

	@media (min-width: 1000px) {
		opacity: 0.3;
	}
}

.background-3 {
	// Otaka https://www.flickr.com/photos/otaka_photos
	background-image: url('../../../../assets/background-3.jpg');
	background-position: center center;
	opacity: 0.25;
}

.background-4 {
	// Unknown
	background-image: url('../../../../assets/background-4.jpg');
	background-position: top right;
	opacity: 0.2;
}
</style>
