import { watch, unref } from 'vue'
import { noop } from '../support/utils'
import { tryOnScopeDispose } from '../support/tryOnScopeDispose'

export function useEventListener(
	target: EventTarget | undefined,
	event: string,
	listener: (event: any) => void,
	options?: AddEventListenerOptions,
) {
	if (!target) {
		return noop
	}

	let cleanup = noop

	const stopWatch = watch(
		() => unref(target),
		(el) => {
			cleanup()

			if (!el) {
				return
			}

			el.addEventListener(event, listener, options)

			cleanup = () => {
				el.removeEventListener(event, listener, options)
				cleanup = noop
			}
		},
		{ immediate: true, flush: 'post' },
	)

	const stop = () => {
		stopWatch()
		cleanup()
	}

	tryOnScopeDispose(stop)

	return stop
}
