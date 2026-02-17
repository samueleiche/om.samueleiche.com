/** Gets a circle with a radius wide enough that would cover the screen from its position. */
function getCircle(button: HTMLElement) {
	const rect = button.getBoundingClientRect()
	const w = window.innerWidth
	const h = window.innerHeight

	// Center coordinates as percentages
	const x = ((rect.left + rect.width / 2) / w) * 100
	const y = ((rect.top + rect.height / 2) / h) * 100

	// Find the furthest distance to an edge in pixels
	const centerX = rect.left + rect.width / 2
	const centerY = rect.top + rect.height / 2

	const maxDX = Math.max(centerX, w - centerX)
	const maxDY = Math.max(centerY, h - centerY)

	// The required pixel radius to hit the furthest corner
	const rPixels = Math.sqrt(Math.pow(maxDX, 2) + Math.pow(maxDY, 2))

	// CSS circle() percentages are relative to: sqrt(width^2 + height^2) / sqrt(2)
	const referenceValue = Math.sqrt(Math.pow(w, 2) + Math.pow(h, 2)) / Math.sqrt(2)
	const r = (rPixels / referenceValue) * 100

	return { x, y, r }
}

function setCircleStyle({ x, y, r }: { x: number | null; y: number | null; r: number | null }) {
	const root = document.documentElement
	root.style.setProperty('--circle-x', x ? `${x}%` : '')
	root.style.setProperty('--circle-y', y ? `${y}%` : '')
	root.style.setProperty('--circle-radius', r ? `${r}%` : '')
}

export function transitionFromElement(element: HTMLElement) {
	const circle = getCircle(element)
	setCircleStyle(circle)
}

export function transitionFromCenter() {
	// default root styles are set to center
	setCircleStyle({ x: null, y: null, r: null })
}
