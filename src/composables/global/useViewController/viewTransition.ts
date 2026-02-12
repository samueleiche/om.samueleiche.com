function getCircle(button: HTMLElement) {
	const buttonRect = button.getBoundingClientRect()

	const screenWidth = window.innerWidth
	const screenHeight = window.innerHeight
	const dpr = window.devicePixelRatio

	const screenCenter = {
		x: screenWidth / 2,
		y: screenHeight / 2,
	}
	const buttonCenter = {
		x: buttonRect.left + buttonRect.width / 2,
		y: buttonRect.top + buttonRect.height / 2,
	}

	// position of the circle so that it is centered on the button
	const x = (buttonCenter.x * 100) / screenWidth
	const y = (buttonCenter.y * 100) / screenHeight

	// a circle radius wide enough it would cover the screen from the new position
	const positionX = Math.abs(screenCenter.x - buttonCenter.x)
	const positionY = Math.abs(screenCenter.y - buttonCenter.y)
	const baseRadius = Math.sqrt(Math.pow(screenCenter.x + positionX, 2) + Math.pow(screenCenter.y + positionY, 2))
	const r = baseRadius * dpr

	return { x, y, r }
}

function setCircleStyle({ x, y, r }: { x: number | null; y: number | null; r: number | null }) {
	const root = document.documentElement
	root.style.setProperty('--circle-x', x ? `${x}%` : '')
	root.style.setProperty('--circle-y', y ? `${y}%` : '')
	root.style.setProperty('--circle-radius', r ? `${r}px` : '')
}

export function transitionFromElement(element: HTMLElement) {
	const circle = getCircle(element)
	setCircleStyle(circle)
}

export function transitionFromCenter() {
	// default root styles are set to center
	setCircleStyle({ x: null, y: null, r: null })
}
