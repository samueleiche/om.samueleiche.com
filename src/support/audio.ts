export const audio: Record<string, HTMLAudioElement> = {}

export function loadAudio(data: { [key: string]: string }): Promise<void> {
	// call this in an event handler to load audio on user interaction
	// and store it to play later (required for playing on demand on iOS)
	return new Promise((resolve, reject) => {
		try {
			for (const sourceName in data) {
				if (!audio[sourceName]) {
					const source = data[sourceName]
					const audioElement = new Audio(source)
					audio[sourceName] = audioElement
				}

				audio[sourceName].load()
			}

			resolve()
		} catch (error) {
			reject(error)
		}
	})
}

export function playAudio(audioElement?: HTMLAudioElement): Promise<void> {
	if (!audioElement) {
		console.error('[playAudio] audioElement not found')
		return Promise.reject()
	}

	return audioElement.play()
}

export function pauseAudio(audioElement?: HTMLAudioElement): Promise<void> {
	if (!audioElement) {
		console.error('[pauseAudio] audioElement not found')
		return Promise.reject()
	}

	return new Promise((resolve) => {
		audioElement.pause()
		resolve()
	})
}
