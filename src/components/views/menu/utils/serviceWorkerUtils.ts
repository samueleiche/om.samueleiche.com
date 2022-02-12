export function skipWaiting(worker: ServiceWorkerRegistration) {
	if (!worker) {
		return Promise.resolve()
	}

	return new Promise((resolve) => {
		let refreshing = false

		navigator.serviceWorker.addEventListener('controllerchange', () => {
			if (refreshing) {
				return
			}

			refreshing = true
			resolve(true)
		})

		worker?.waiting?.postMessage({ type: 'SKIP_WAITING' })
	})
}
