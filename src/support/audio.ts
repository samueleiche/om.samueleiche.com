export const audio: Record<string, HTMLAudioElement> = {}

export function loadAudio(data: { [key: string]: string }): Promise<void> {
	// call this in an event handler to load audio on user interaction
	// and store it to play later (required for playing on demand on iOS)
	return new Promise((resolve, reject) => {
		try {
			for (const sourceName in data) {
				// reset audio if previously loaded
				if (audio[sourceName]) {
					audio[sourceName].load()
					continue
				}

				const source = data[sourceName]
				const audioElement = new Audio(source)

				audioElement.load()
				audio[sourceName] = audioElement
			}

			resolve()
		} catch (error) {
			reject()
		}
	})
}

export function playAudio(audioElement: HTMLAudioElement): Promise<HTMLAudioElement> {
	return new Promise((resolve) => {
		if (audioElement.readyState > audioElement.HAVE_CURRENT_DATA) {
			audioElement.play()
			resolve(audioElement)
		} else {
			audioElement.addEventListener(
				'canplay',
				() => {
					audioElement.play()
					resolve(audioElement)
				},
				{ once: true },
			)
		}
	})
}

export function pauseAudio(audioElement: HTMLAudioElement): Promise<HTMLAudioElement> {
	return new Promise((resolve) => {
		audioElement.pause()
		resolve(audioElement)
	})
}
