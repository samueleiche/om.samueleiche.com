import { ref } from 'vue'
import { useEventListener } from './useEventListener'
import { isDocumentVisible } from '../utils'

type WakeLockType = 'screen'

export interface WakeLockSentinel extends EventTarget {
	type: WakeLockType
	released: boolean
	release: () => Promise<void>
}

type NavigatorWithWakeLock = Navigator & {
	wakeLock: { request: (type: WakeLockType) => Promise<WakeLockSentinel> }
}

export const useWakeLock = () => {
	let wakeLock: WakeLockSentinel | null
	const isSupported = navigator && 'wakeLock' in navigator
	const isActive = ref(false)

	useEventListener(document, 'visibilitychange', onVisibilityChange, { passive: true })

	async function onVisibilityChange() {
		if (!isSupported || !wakeLock) {
			return
		}

		if (isDocumentVisible()) {
			wakeLock = await (navigator as NavigatorWithWakeLock).wakeLock.request('screen')
		}

		isActive.value = !wakeLock.released
	}

	async function request(type: WakeLockType) {
		if (!isSupported) {
			return
		}

		wakeLock = await (navigator as NavigatorWithWakeLock).wakeLock.request(type)
		isActive.value = !wakeLock.released
	}

	async function release() {
		if (!isSupported || !wakeLock) {
			return
		}

		await wakeLock.release()
		isActive.value = !wakeLock.released
		wakeLock = null
	}

	return {
		isSupported,
		isActive,
		request,
		release,
	}
}
