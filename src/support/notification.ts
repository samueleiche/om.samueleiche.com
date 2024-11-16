const isWebNotificationSupported = 'Notification' in window

// Safari doesn't support the promise-based version of notification.requestPermission()
// https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API/Using_the_Notifications_API
function isNotificationPromise() {
	try {
		Notification.requestPermission().then()
	} catch (err) {
		console.warn(err)

		return false
	}

	return true
}

export function getNotificationPermission() {
	if (!isWebNotificationSupported) {
		return {
			supported: false,
		}
	}

	return {
		supported: true,
		default: Notification.permission === 'default',
		granted: Notification.permission === 'granted',
		denied: Notification.permission === 'denied',
	}
}

export function sendNotification(title: string, body: string) {
	if (!getNotificationPermission().granted || !isWebNotificationSupported) {
		return
	}

	try {
		new Notification(title, {
			body: body,
			icon: 'https://om.samueleiche.com/icons/android-chrome-192x192.png',
			silent: true,
		})
	} catch (err) {
		console.error('[sendNotification]: Failed to send notification: ', err)
	}
}

export function requestNotificationPermission(): Promise<NotificationPermission | void> {
	if (!getNotificationPermission().default || !isWebNotificationSupported) {
		return Promise.resolve()
	}

	if (isNotificationPromise()) {
		return Notification.requestPermission()
	} else {
		return new Promise((resolve) => {
			Notification.requestPermission(() => {
				resolve()
			})
		})
	}
}
