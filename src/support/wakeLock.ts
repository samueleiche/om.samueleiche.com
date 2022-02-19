import { isDocumentVisible } from './utils'

type WakeLockType = 'screen'

export interface WakeLockSentinel extends EventTarget {
	type: WakeLockType
	released: boolean
	release: () => Promise<void>
}

type NavigatorWithWakeLock = Navigator & {
	wakeLock: { request: (type: WakeLockType) => Promise<WakeLockSentinel> }
}

const isSupported = 'wakeLock' in navigator
let lock: WakeLockSentinel | null = null

export async function requestWakeLock() {
	if (!isSupported) {
		console.info('[requestWakeLock]: Not supported')
		return
	}

	try {
		lock = await (navigator as NavigatorWithWakeLock).wakeLock.request('screen')
		console.info('[requestWakeLock]: Acquired')
	} catch (e) {
		console.info('[requestWakeLock]: Failed to acquire')
		console.error(e)
	}
}

export async function releaseWakeLock() {
	if (!isSupported || !lock) {
		console.info('[releaseWakeLock]: Not %s', !isSupported ? 'supported' : 'previously acquired')
		return
	}

	try {
		await lock.release()
		lock = null
		console.info('[releaseWakeLock]: Released')
	} catch (e) {
		console.info('[requestWakeLock]: Failed to release')
		console.error(e)
	}
}

document.addEventListener(
	'visibilitychange',
	() => {
		if (!lock) {
			return
		}

		if (isDocumentVisible()) {
			requestWakeLock()
		} else {
			console.info('[releaseWakeLock]: Released on visibilitychange')
		}
	},
	{ passive: true },
)
