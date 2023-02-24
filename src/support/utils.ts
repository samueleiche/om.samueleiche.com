export const m2PI = Math.PI * 2
export const mPI2 = Math.PI / 2
export const { devicePixelRatio: dpr } = window
export const easeInOutQuint = (t: number) => (t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t)
export const toPx = (value: string | number) => value + 'px'
export const isDocumentVisible = () => document.visibilityState === 'visible'
export const noop = () => {
	/* do nothing */
}
