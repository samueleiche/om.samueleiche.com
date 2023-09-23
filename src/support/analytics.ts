interface EventParams {
	category?: 'Menu' | 'Timer'
	label?: string
	value?: number
	nonInteraction?: boolean
}

export function trackEvent(action: string, params: EventParams = {}) {
	if (!window.gtag) {
		return
	}

	window.gtag('event', action, {
		event_category: params.category,
		event_label: params.label,
		event_value: params.value,
		non_interaction: !!params.nonInteraction,
	})
}

export function trackView(viewName: string) {
	if (!window.gtag) {
		return
	}

	window.gtag('event', 'screen_view', {
		screen_name: viewName,
	})
}
