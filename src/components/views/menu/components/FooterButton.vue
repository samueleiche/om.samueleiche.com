<template>
	<button type="button" class="footer-button" :style="{ fontWeight: active ? 700 : 400 }" @click="$emit('click')">
		{{ label }}
	</button>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	emits: ['click'],
	props: {
		active: Boolean,
		label: String,
	},
})
</script>

<style lang="scss" scoped>
.footer-button {
	-webkit-tap-highlight-color: transparent;
}
</style>
