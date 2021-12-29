export const PI2 = Math.PI * 2
export const PIHalf = Math.PI / 2

export function minsToMs(minutes: number) {
	return minutes * 60 * 1000
}

export function easeInOutQuint(t: number) {
	const t2 = t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t
	return Math.max(t2, 0.0000001)
}
