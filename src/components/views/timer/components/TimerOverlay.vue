<template>
	<AppOverlay>
		<div class="timer-control">
			<h2 class="timer-control-message">
				Would you like
				<br />
				to finish?
			</h2>
			<button class="timer-control-button" type="button" @click="finish">Finish</button>
			<button class="timer-control-button timer-control-button-bordered" type="button" @click="close">
				Resume
			</button>
		</div>
	</AppOverlay>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import { trackEvent } from '../../../../support/analytics'
import { useOverlay, OverlayName } from '../../../../composables/global/useOverlay'
import { useViewController } from '../../../../composables/global/useViewController'
import AppOverlay from '../../../app/AppOverlay.vue'

export default defineComponent({
	components: {
		AppOverlay,
	},
	setup() {
		const { setActiveView, AppView } = useViewController()
		const { removeOverlay } = useOverlay()

		function finish() {
			trackEvent('click', { category: 'Timer', label: 'Leave Timer' })
			setActiveView(AppView.MENU)
			close()
		}

		function close() {
			removeOverlay(OverlayName.Timer)
		}

		return {
			finish,
			close,
		}
	},
})
</script>

<style lang="scss" scoped>
.timer-control {
	padding: 20px 24px;
	min-width: 280px;
	border-radius: 24px;
	text-align: center;
	background-color: #fff;
	box-shadow: rgba(0, 0, 0, 0.15) 0px 3px 3px 0px;
}

.timer-control-message {
	font-size: 24px;
	font-weight: 500;
	margin: 8px 0;
}

.timer-control-button {
	width: 100%;
	margin: 8px 0;
	padding: 10px 28px;
	border-radius: 16px;
	letter-spacing: 0.02em;
	font-weight: 700;
	font-size: 14px;
	color: #fff;
	background-color: #000;
	user-select: none;
	user-select: none;
	-webkit-tap-highlight-color: transparent;

	&:focus {
		outline: none;
	}

	&:active,
	&:focus-visible {
		background-color: rgba(#000, 0.75);
	}
}

.timer-control-button-bordered {
	background-color: transparent;
	color: #000;
	border: 2px solid #000;

	&:active,
	&:focus-visible {
		background-color: rgba(#000, 0.15);
	}
}
</style>
