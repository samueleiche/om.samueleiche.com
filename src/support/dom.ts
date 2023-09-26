export function updateThemeColorMeta(color: string) {
	document.querySelector("meta[name='theme-color']")!.setAttribute('content', color)
}
