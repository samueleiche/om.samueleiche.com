export declare global {
	/**
	 * The BeforeInstallPromptEvent is fired at the Window.onbeforeinstallprompt
	 * handler before a user is prompted to "install" a web site to a home screen
	 * on mobile.
	 *
	 * @see   https://stackoverflow.com/a/51847335
	 * @see   https://developer.mozilla.org/en-US/docs/Web/API/BeforeInstallPromptEvent
	 */
	interface BeforeInstallPromptEvent extends Event {
		readonly platforms: string[]
		readonly userChoice: Promise<{
			outcome: 'accepted' | 'dismissed'
			platform: string
		}>
		prompt(): Promise<void>
	}

	interface Window {
		gtag: (...params: unknown[]) => void
	}

	interface WindowEventMap {
		beforeinstallprompt: BeforeInstallPromptEvent
	}
}
