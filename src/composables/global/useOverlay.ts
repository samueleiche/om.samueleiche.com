import { readonly, ref } from 'vue'

export enum OverlayName {
	CountDown = 'countDown',
	Timer = 'timer',
}

const overlays = ref([] as OverlayName[])

function addOverlay(name: OverlayName) {
	overlays.value.push(name)
}

function removeOverlay(name: OverlayName) {
	overlays.value = overlays.value.filter((modal) => modal !== name)
}

function toggleOverlay(name: OverlayName) {
	if (isOverlayActive(name)) {
		removeOverlay(name)
	} else {
		addOverlay(name)
	}
}

function isOverlayActive(name: OverlayName) {
	return overlays.value.includes(name)
}

export function createOverlayMount() {
	if (document.querySelector('#app-overlays')) {
		return
	}

	const overlayRoot = document.createElement('div')
	overlayRoot.setAttribute('id', 'app-overlays')
	document.body.appendChild(overlayRoot)
}

export function useOverlay() {
	return {
		overlays: readonly(overlays),
		addOverlay,
		removeOverlay,
		toggleOverlay,
		isOverlayActive,
	}
}
