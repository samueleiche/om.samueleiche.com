export const m2PI = Math.PI * 2
export const mPI2 = Math.PI / 2
export const { devicePixelRatio: dpr } = window
export const easeInOutQuint = (x: number) => (x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2)
export const toPx = (value: string | number) => value + 'px'
export const isDocumentVisible = () => document.visibilityState === 'visible'
export const noop = () => {
	/* do nothing */
}
