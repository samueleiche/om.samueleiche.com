<template>
	<a v-if="link" class="footer-button" :href="link" target="_blank" rel="noopener">{{ label }}</a>
	<button
		v-else
		type="button"
		class="footer-button"
		:style="{ fontWeight: active ? 700 : 400 }"
		@click="$emit('click')"
	>
		{{ label }}
	</button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	props: {
		active: Boolean,
		label: String,
		link: String,
	},
	emits: ['click'],
})
</script>

<style lang="scss" scoped>
.footer-button {
	text-align: center;
	font-size: 12px;
	line-height: 24px;
	color: var(--primary-dark);
	-webkit-tap-highlight-color: transparent;
	text-decoration: none;
}
</style>
