/* eslint-disable no-console */

import { register } from 'register-service-worker'

export function registerServiceWorker() {
	if (process.env.NODE_ENV === 'production') {
		register(`${process.env.BASE_URL}service-worker.js`, {
			ready() {
				console.log(
					'App is being served from cache by a service worker.\n' +
						'For more details, visit https://goo.gl/AFskqB',
				)
			},
			registered() {
				console.log('Service worker has been registered.')
			},
			cached() {
				console.log('Content has been cached for offline use.')
			},
			updatefound() {
				console.log('New content is downloading.')
			},
			updated(registration) {
				console.log('New content is available; please refresh.')
				window.dispatchEvent(new CustomEvent('serviceWorkerUpdated', { detail: registration }))
			},
			offline() {
				console.log('No internet connection found. App is running in offline mode.')
			},
			error(error) {
				console.error('Error during service worker registration:', error)
			},
		})
	}
}

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
